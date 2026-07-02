// Player commands. Each validates fully and returns a typed result so the UI can
// show a clear message. Nothing here bypasses the economy or mutates outside rules.

import { CITY_BY_ID } from '../data/cities';
import { MODEL_BY_ID, MODE_META, type Mode } from '../data/vehicles';
import { TECH_BY_ID } from '../data/tech';
import { BALANCE } from './balance';
import { transact } from './economy';
import { pushEvent } from './events';
import { checkAchievements } from './achievements';
import type { GameState, Route, Vehicle } from './types';

export interface ActionResult {
  ok: boolean;
  error?: string;
  id?: string;
}

const ok = (id?: string): ActionResult => ({ ok: true, id });
const fail = (error: string): ActionResult => ({ ok: false, error });

function stationKey(cityId: string, mode: Mode): string {
  return `${cityId}:${mode}`;
}

export function routeBuildCost(state: GameState, mode: Mode, stops: string[]): number {
  let cost = 0;
  for (const cityId of new Set(stops)) {
    if (!state.stations[stationKey(cityId, mode)]) cost += BALANCE.stationCost[mode];
  }
  return cost;
}

export function buildRoute(state: GameState, mode: Mode, stops: string[], name?: string): ActionResult {
  if (!state.unlockedModes.includes(mode)) return fail(`${MODE_META[mode].name} transport is not researched yet.`);
  const clean = stops.filter((id, i) => CITY_BY_ID[id] && stops.indexOf(id) === i);
  if (clean.length < 2) return fail('A route needs at least 2 different cities.');
  if (clean.length > 6) return fail('Routes can have at most 6 stops.');
  if (mode === 'sea' && clean.some((id) => !CITY_BY_ID[id].coastal)) {
    return fail('Sea routes can only connect coastal cities (ports).');
  }

  const cost = routeBuildCost(state, mode, clean);
  if (state.cash < cost) return fail(`Not enough cash — need ${'$' + cost.toLocaleString('en-US')} for stations.`);

  if (cost > 0) transact(state, 'purchases', -cost);
  for (const cityId of new Set(clean)) {
    const key = stationKey(cityId, mode);
    if (!state.stations[key]) {
      state.stations[key] = { id: key, cityId, mode, level: 1 };
    }
  }

  const id = `r${state.nextId++}`;
  const label = name ?? `${CITY_BY_ID[clean[0]].name} ↔ ${CITY_BY_ID[clean[clean.length - 1]].name}`;
  const route: Route = { id, name: label, mode, stops: clean, color: MODE_META[mode].color, createdAt: state.time };
  state.routes[id] = route;
  checkAchievements(state);
  return ok(id);
}

export function removeRoute(state: GameState, routeId: string): ActionResult {
  const route = state.routes[routeId];
  if (!route) return fail('Route not found.');
  // Refund vehicles assigned to this route.
  for (const v of Object.values(state.vehicles)) {
    if (v.routeId === routeId) sellVehicle(state, v.id, true);
  }
  delete state.routes[routeId];
  return ok();
}

export function buyVehicle(state: GameState, modelId: string, routeId: string, name?: string): ActionResult {
  const model = MODEL_BY_ID[modelId];
  const route = state.routes[routeId];
  if (!model) return fail('Unknown vehicle model.');
  if (!route) return fail('Route not found.');
  if (model.mode !== route.mode) return fail(`${model.name} cannot run on a ${route.mode} route.`);
  if (model.tech && !state.unlockedTech.includes(model.tech)) return fail(`${model.name} requires research.`);
  if (state.cash < model.price) return fail(`Not enough cash — ${model.name} costs $${model.price.toLocaleString('en-US')}.`);

  transact(state, 'purchases', -model.price);
  const id = `v${state.nextId++}`;
  const count = Object.values(state.vehicles).filter((v) => v.modelId === modelId).length + 1;
  const vehicle: Vehicle = {
    id,
    name: name ?? `${model.name} ${count}`,
    modelId,
    mode: model.mode,
    routeId,
    legIndex: 0,
    progress: 0,
    status: 'loading',
    loadTimer: 5, // depart soon after purchase
    brokenTimer: 0,
    cargo: {},
    condition: 100,
    age: 0,
    totalIncome: 0,
    reverse: false,
  };
  state.vehicles[id] = vehicle;
  checkAchievements(state);
  return ok(id);
}

export function sellVehicle(state: GameState, vehicleId: string, silent = false): ActionResult {
  const v = state.vehicles[vehicleId];
  if (!v) return fail('Vehicle not found.');
  const model = MODEL_BY_ID[v.modelId];
  const refund = model ? model.price * BALANCE.vehicleResaleFactor * (v.condition / 100) : 0;
  transact(state, 'other', refund);
  delete state.vehicles[vehicleId];
  if (!silent) pushEvent(state, { kind: 'info', title: 'Vehicle sold', message: `Recovered $${Math.round(refund).toLocaleString('en-US')}.` });
  return ok();
}

export function serviceVehicle(state: GameState, vehicleId: string): ActionResult {
  const v = state.vehicles[vehicleId];
  if (!v) return fail('Vehicle not found.');
  const model = MODEL_BY_ID[v.modelId];
  if (!model) return fail('Unknown model.');
  const cost = Math.round((model.price * 0.12) * (1 - v.condition / 100));
  if (cost <= 0) return fail('Vehicle is already in top condition.');
  if (state.cash < cost) return fail(`Servicing costs $${cost.toLocaleString('en-US')}.`);
  transact(state, 'maintenance', -cost);
  v.condition = 100;
  if (v.status === 'broken') { v.status = 'loading'; v.loadTimer = BALANCE.loadTimeMinutes; v.brokenTimer = 0; }
  return ok();
}

export function upgradeStation(state: GameState, cityId: string, mode: Mode): ActionResult {
  const key = stationKey(cityId, mode);
  const st = state.stations[key];
  if (!st) return fail('No station here to upgrade.');
  if (st.level >= 3) return fail('Station is already at maximum level.');
  const cost = Math.round(BALANCE.stationCost[mode] * st.level * BALANCE.stationUpgradeCostMult);
  if (state.cash < cost) return fail(`Upgrade costs $${cost.toLocaleString('en-US')}.`);
  transact(state, 'purchases', -cost);
  st.level += 1;
  return ok();
}

export function takeLoan(state: GameState, amount: number): ActionResult {
  const room = BALANCE.maxLoan - state.loan;
  const take = Math.min(amount, room);
  if (take <= 0) return fail('You have reached your maximum credit line.');
  state.loan += take;
  state.cash += take; // liability, not income — no ledger entry
  return ok();
}

export function repayLoan(state: GameState, amount: number): ActionResult {
  const pay = Math.min(amount, state.loan, Math.max(0, state.cash));
  if (pay <= 0) return fail('Nothing to repay, or not enough cash.');
  state.loan -= pay;
  state.cash -= pay;
  checkAchievements(state);
  return ok();
}

export function research(state: GameState, techId: string): ActionResult {
  const node = TECH_BY_ID[techId];
  if (!node) return fail('Unknown technology.');
  if (state.unlockedTech.includes(techId)) return fail('Already researched.');
  for (const req of node.requires) {
    if (!state.unlockedTech.includes(req)) return fail(`Requires ${TECH_BY_ID[req]?.name ?? req} first.`);
  }
  if (state.researchPoints < node.cost) return fail(`Need ${node.cost} research points.`);
  state.researchPoints -= node.cost;
  state.unlockedTech.push(techId);
  if (node.unlocksMode && !state.unlockedModes.includes(node.unlocksMode)) {
    state.unlockedModes.push(node.unlocksMode);
  }
  pushEvent(state, { kind: 'info', title: `Researched: ${node.name}`, message: node.description });
  checkAchievements(state);
  return ok();
}
