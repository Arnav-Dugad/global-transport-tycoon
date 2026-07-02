// The deterministic simulation tick. Everything here is a pure function of
// (state, dt, rng-in-state). Called in fixed timesteps by the engine and directly
// by unit tests. Order is fixed: produce -> move vehicles -> decay -> daily rollover.

import { CARGO_BY_ID } from '../data/cargo';
import { CITY_BY_ID } from '../data/cities';
import { MODEL_BY_ID } from '../data/vehicles';
import { BALANCE } from './balance';
import { transact } from './economy';
import { rollDailyEvents, maybeBreakdownOnArrival } from './events';
import { checkAchievements } from './achievements';
import { updateContracts, creditContracts } from './contracts';
import { greatCirclePoint, haversineKm, bearingDeg, type LngLat } from '../utils/geo';
import type { CityState, GameState, Vehicle } from './types';

const FINANCE_HISTORY_CAP = 180;

function cityLngLat(id: string): LngLat {
  const c = CITY_BY_ID[id];
  return [c.lng, c.lat];
}

function legDistanceKm(originId: string, destId: string): number {
  return haversineKm(cityLngLat(originId), cityLngLat(destId));
}

// ---- Production ----
function cityStationLevel(state: GameState, cityId: string): number {
  let level = 0;
  for (const st of Object.values(state.stations)) {
    if (st.cityId === cityId && st.level > level) level = st.level;
  }
  return level;
}

function produceCargo(state: GameState, dtMin: number): void {
  const hours = dtMin / 60;
  for (const city of Object.values(state.cities)) {
    const level = cityStationLevel(state, city.id);
    const levelMult = level > 0 ? 1 + 0.25 * (level - 1) : 1;
    const cap = BALANCE.stockCapPerPop * city.population * (1 + 0.4 * Math.max(0, level - 1));
    const boosted = (state.time < city.boostUntil ? 2 : 1) * levelMult;
    // Universal passengers + mail
    addStock(city, 'passengers', BALANCE.productionPerPopPerHour * BALANCE.paxProductionMult * city.population * hours * boosted, cap);
    addStock(city, 'mail', BALANCE.productionPerPopPerHour * 0.5 * city.population * hours * boosted, cap);
    // Resource cargo this city produces
    for (const c of city.produces) {
      addStock(city, c, BALANCE.productionPerPopPerHour * city.population * hours * boosted, cap);
    }
  }
}

function addStock(city: CityState, cargo: string, amount: number, cap: number): void {
  city.stock[cargo] = Math.min(cap, (city.stock[cargo] ?? 0) + amount);
}

// ---- Vehicle movement ----
function conditionSpeedFactor(condition: number): number {
  const t = Math.max(0, Math.min(1, condition / 100));
  return BALANCE.conditionSpeedFloor + (1 - BALANCE.conditionSpeedFloor) * t;
}

function nextStopIndex(v: Vehicle, stopCount: number): { index: number; reverse: boolean } {
  if (stopCount <= 1) return { index: 0, reverse: v.reverse };
  let idx = v.reverse ? v.legIndex - 1 : v.legIndex + 1;
  let reverse = v.reverse;
  if (idx >= stopCount) { idx = stopCount - 2; reverse = true; }
  if (idx < 0) { idx = 1; reverse = false; }
  return { index: idx, reverse };
}

function updateVehicles(state: GameState, dtMin: number): void {
  const weatherSlow = state.time < state.weatherUntil ? 0.6 : 1;
  for (const v of Object.values(state.vehicles)) {
    const route = state.routes[v.routeId];
    const model = MODEL_BY_ID[v.modelId];
    if (!route || !model || route.stops.length < 2) continue;

    if (v.status === 'broken') {
      v.brokenTimer -= dtMin;
      if (v.brokenTimer <= 0) {
        v.status = 'loading';
        v.loadTimer = BALANCE.loadTimeMinutes;
      }
      continue;
    }

    if (v.status === 'loading') {
      v.loadTimer -= dtMin;
      if (v.loadTimer <= 0) depart(state, v, route.stops);
      continue;
    }

    // moving
    const destInfo = nextStopIndex(v, route.stops.length);
    const originId = route.stops[v.legIndex];
    const destId = route.stops[destInfo.index];
    const dist = Math.max(1, legDistanceKm(originId, destId));
    const effSpeed = model.speed * conditionSpeedFactor(v.condition) * weatherSlow;
    const hours = dtMin / 60;
    const delta = (hours * effSpeed) / dist;

    const stepFraction = Math.min(delta, 1 - v.progress);
    const kmThisStep = stepFraction * dist;
    const fuelCost = kmThisStep * model.fuelPerKm * state.fuelPrice;
    if (fuelCost > 0) transact(state, 'fuel', -fuelCost);

    v.progress += delta;
    if (v.progress >= 1) {
      arrive(state, v, route.stops, destInfo, dist);
    }
  }
}

function arrive(
  state: GameState,
  v: Vehicle,
  stops: string[],
  destInfo: { index: number; reverse: boolean },
  dist: number,
): void {
  const destId = stops[destInfo.index];
  const dest = state.cities[destId];
  deliverCargo(state, v, dest, dist);

  v.legIndex = destInfo.index;
  v.reverse = destInfo.reverse;
  v.progress = 0;
  v.condition = Math.max(0, v.condition - wearPerLeg(state));
  v.status = 'loading';
  v.loadTimer = BALANCE.loadTimeMinutes;
  state.stats.totalTrips += 1;

  maybeBreakdownOnArrival(state, v);
}

function wearPerLeg(state: GameState): number {
  const mult = state.unlockedTech.includes('maintenance') ? BALANCE.maintenanceReducedMult : 1;
  return BALANCE.wearPerLeg * mult;
}

function deliverCargo(state: GameState, v: Vehicle, dest: CityState, dist: number): void {
  const model = MODEL_BY_ID[v.modelId];
  const logistics = state.unlockedTech.includes('logistics') ? 1 + BALANCE.logisticsBonus : 1;
  let income = 0;

  for (const [cargoId, amount] of Object.entries(v.cargo)) {
    if (amount <= 0) continue;
    const def = CARGO_BY_ID[cargoId];
    if (!def) continue;

    const universallyDemanded = cargoId === 'passengers' || cargoId === 'mail';
    const wanted = universallyDemanded || dest.demands.includes(cargoId);
    const demandBase = wanted ? BALANCE.demandMatchMult : BALANCE.demandMissMult;

    const sat = dest.saturation[cargoId] ?? 0;
    const satFactor = Math.max(BALANCE.minDemandMult, 1 - sat);

    const pay =
      amount * def.basePrice * (dist / 100) * demandBase * satFactor *
      BALANCE.modeIncomeMult[model.mode] * logistics;
    income += pay;

    // Flood the destination for this cargo (recovers over time).
    const floodMult = state.unlockedTech.includes('logistics') ? 0.7 : 1;
    dest.saturation[cargoId] = Math.min(0.92, sat + BALANCE.saturationPerDelivery * (amount / 100) * floodMult);

    state.stats.totalDelivered += amount;
    if (def.category === 'freight') {
      state.researchPoints += pay * BALANCE.researchPerDeliveryValue;
    }
    creditContracts(state, dest.id, cargoId, amount);
  }

  if (income > 0) {
    transact(state, 'freight', income);
    v.totalIncome += income;
    dest.satisfaction = Math.min(1, dest.satisfaction + 0.05);
  }
  v.cargo = {};
}

function depart(state: GameState, v: Vehicle, stops: string[]): void {
  const model = MODEL_BY_ID[v.modelId];
  const origin = state.cities[stops[v.legIndex]];
  const destInfo = nextStopIndex(v, stops.length);
  const dest = state.cities[stops[destInfo.index]];

  // Candidate cargo: what this vehicle can carry AND the destination wants.
  const candidates: string[] = [];
  if (model.carries === 'pax') {
    candidates.push('passengers');
  } else {
    // freight vehicles: mail + any resource the destination demands
    if ((origin.stock['mail'] ?? 0) > 0) candidates.push('mail');
    for (const c of dest.demands) {
      if ((origin.stock[c] ?? 0) > 0) candidates.push(c);
    }
    // If destination demands nothing we have, carry whatever we produce (sells cheap).
    if (candidates.length === 0) {
      for (const c of origin.produces) if ((origin.stock[c] ?? 0) > 0) candidates.push(c);
    }
  }

  // Highest value first, fill to capacity.
  candidates.sort((a, b) => (CARGO_BY_ID[b]?.basePrice ?? 0) - (CARGO_BY_ID[a]?.basePrice ?? 0));
  let remaining = model.capacity;
  const cargo: Record<string, number> = {};
  for (const c of candidates) {
    if (remaining <= 0) break;
    const take = Math.min(remaining, Math.floor(origin.stock[c] ?? 0));
    if (take <= 0) continue;
    cargo[c] = take;
    origin.stock[c] -= take;
    remaining -= take;
  }

  v.cargo = cargo;
  v.progress = 0;
  v.status = 'moving';
}

// ---- Saturation decay ----
function decaySaturation(state: GameState, dtMin: number): void {
  const factor = 1 - BALANCE.saturationDecayPerHour * (dtMin / 60);
  for (const city of Object.values(state.cities)) {
    for (const k of Object.keys(city.saturation)) {
      city.saturation[k] *= factor;
      if (city.saturation[k] < 0.001) delete city.saturation[k];
    }
  }
}

// ---- Daily rollover ----
function processDay(state: GameState): void {
  // Loan interest (360-day financial year)
  if (state.loan > 0) {
    const daily = (state.loan * state.interestRate) / 360;
    transact(state, 'interest', -daily);
  }

  // Fleet maintenance
  const maintMult = state.unlockedTech.includes('maintenance') ? BALANCE.maintenanceReducedMult : 1;
  let maint = 0;
  for (const v of Object.values(state.vehicles)) {
    const model = MODEL_BY_ID[v.modelId];
    if (model) maint += model.maintenancePerDay * maintMult;
    v.age += 1;
  }
  if (maint > 0) transact(state, 'maintenance', -maint);

  // Passive research
  state.researchPoints += BALANCE.researchPointsPerDay;

  // Fuel price random walk (mean-reverting)
  const drift = (BALANCE.fuelPriceBase - state.fuelPrice) * 0.1;
  const noise = (nextRng(state) - 0.5) * 0.12;
  state.fuelPrice = Math.max(0.6, Math.min(1.9, state.fuelPrice + drift + noise));

  // City growth + satisfaction decay + reputation
  let satSum = 0;
  const cityList = Object.values(state.cities);
  for (const city of cityList) {
    city.population *= 1 + BALANCE.growthPerSatisfactionPerDay * city.satisfaction;
    city.satisfaction = Math.max(0, city.satisfaction - BALANCE.satisfactionDecayPerDay * city.satisfaction);
    satSum += city.satisfaction;
  }
  const avgSat = cityList.length ? satSum / cityList.length : 0.5;
  const repTarget = 30 + avgSat * 70 + (state.cash > 0 ? 0 : -25);
  state.reputation += (repTarget - state.reputation) * 0.1;
  state.reputation = Math.max(0, Math.min(100, state.reputation));

  // Random events + contracts
  rollDailyEvents(state);
  updateContracts(state);

  // Finance snapshot
  const l = state.ledgerToday;
  const income = l.freight + Math.max(0, l.other);
  const expenses = -(l.maintenance + l.fuel + l.interest + l.purchases) + Math.max(0, -l.other);
  const day = Math.floor(state.time / 1440);
  state.finance.push({ day, income, expenses, netWorth: state.cash + estimateAssets(state) - state.loan });
  if (state.finance.length > FINANCE_HISTORY_CAP) state.finance.shift();
  state.ledgerToday = { freight: 0, maintenance: 0, fuel: 0, interest: 0, purchases: 0, other: 0 };

  checkAchievements(state);
}

function estimateAssets(state: GameState): number {
  let total = 0;
  for (const v of Object.values(state.vehicles)) {
    const m = MODEL_BY_ID[v.modelId];
    if (m) total += m.price * BALANCE.vehicleResaleFactor * (v.condition / 100);
  }
  for (const st of Object.values(state.stations)) {
    total += BALANCE.stationCost[st.mode] * st.level * BALANCE.stationSellRefund;
  }
  return total;
}

// Small RNG helper local to sim (keeps import surface tidy).
function nextRng(state: GameState): number {
  state.rng.s = (state.rng.s + 0x6d2b79f5) >>> 0;
  let t = state.rng.s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Live map position + heading of a vehicle (for rendering, not simulation). */
export function vehicleLngLat(state: GameState, v: Vehicle): { pos: LngLat; bearing: number } {
  const route = state.routes[v.routeId];
  if (!route || route.stops.length < 2) return { pos: [0, 0], bearing: 0 };
  const originId = route.stops[v.legIndex];
  const dest = nextStopIndex(v, route.stops.length);
  const destId = route.stops[dest.index];
  const a = cityLngLat(originId);
  const b = cityLngLat(destId);
  if (v.status !== 'moving') return { pos: a, bearing: bearingDeg(a, b) };
  return { pos: greatCirclePoint(a, b, Math.max(0, Math.min(1, v.progress))), bearing: bearingDeg(a, b) };
}

/** Advance the entire world by `dtMin` game minutes. */
export function advanceWorld(state: GameState, dtMin: number): void {
  state.time += dtMin;
  produceCargo(state, dtMin);
  updateVehicles(state, dtMin);
  decaySaturation(state, dtMin);

  const currentDay = Math.floor(state.time / 1440);
  let guard = 0;
  while (state.lastProcessedDay < currentDay && guard < 3650) {
    state.lastProcessedDay += 1;
    processDay(state);
    guard += 1;
  }
}
