// Random events + breakdowns. All randomness goes through the seeded state RNG,
// so events are reproducible and fair. Difficulty scales frequency.

import { CITY_BY_ID } from '../data/cities';
import { MODEL_BY_ID } from '../data/vehicles';
import { BALANCE } from './balance';
import { chance, nextFloat, nextInt } from './rng';
import type { GameEvent, GameState, Vehicle } from './types';

const EVENT_CAP = 40;

export function pushEvent(state: GameState, ev: Omit<GameEvent, 'id' | 'time'>): void {
  state.events.unshift({ ...ev, id: `e${state.nextId++}`, time: state.time });
  if (state.events.length > EVENT_CAP) state.events.pop();
}

export function maybeBreakdownOnArrival(state: GameState, v: Vehicle): void {
  const model = MODEL_BY_ID[v.modelId];
  if (!model) return;
  const maintMult = state.unlockedTech.includes('maintenance') ? 0.6 : 1;
  // Lower condition + lower reliability -> higher breakdown chance.
  const conditionRisk = 1 - v.condition / 100;
  const p =
    BALANCE.breakdownChancePerLegBase *
    (2 - model.reliability) *
    (0.5 + conditionRisk) *
    maintMult;
  if (chance(state.rng, p)) {
    v.status = 'broken';
    v.brokenTimer = 60 + nextInt(state.rng, 30, 180); // 1.5–4h stranded
    v.condition = Math.max(5, v.condition - 8);
    pushEvent(state, {
      kind: 'breakdown',
      title: `${v.name} broke down`,
      message: `${model.emoji} ${v.name} needs roadside repair. Consider servicing your fleet.`,
    });
  }
}

export function rollDailyEvents(state: GameState): void {
  const rate = BALANCE.difficulty[state.difficulty].eventRate;
  const e = BALANCE.events;

  // Weather: temporary global slowdown
  if (chance(state.rng, e.weatherPerDay * rate)) {
    state.weatherUntil = state.time + (6 + nextInt(state.rng, 2, 12)) * 60;
    pushEvent(state, {
      kind: 'weather',
      title: 'Severe weather',
      message: '🌧️ Storms are slowing every vehicle for a while.',
    });
  }

  // Fuel price spike
  if (chance(state.rng, e.fuelSpikePerDay * rate)) {
    state.fuelPrice = Math.min(1.9, state.fuelPrice + 0.3 + nextFloat(state.rng) * 0.4);
    pushEvent(state, {
      kind: 'fuel',
      title: 'Fuel price spike',
      message: `⛽ Fuel is now ${state.fuelPrice.toFixed(2)}× baseline. Running costs are up.`,
    });
  }

  // City boom: a random city doubles production for a while + demand surges
  if (chance(state.rng, e.cityBoomPerDay * rate)) {
    const ids = Object.keys(state.cities);
    const cityId = ids[nextInt(state.rng, 0, ids.length - 1)];
    const city = state.cities[cityId];
    city.boostUntil = state.time + (2 + nextInt(state.rng, 1, 4)) * 24 * 60;
    city.satisfaction = Math.min(1, city.satisfaction + 0.2);
    pushEvent(state, {
      kind: 'boom',
      title: `Economic boom: ${CITY_BY_ID[cityId]?.name ?? cityId}`,
      message: `📈 ${CITY_BY_ID[cityId]?.name ?? cityId} is booming — production and demand surge!`,
    });
  }

  // Strike: temporary maintenance cost hit (one-off charge)
  if (chance(state.rng, e.strikePerDay * rate) && Object.keys(state.vehicles).length > 0) {
    const cost = 5000 + nextInt(state.rng, 0, 15000);
    state.cash -= cost;
    state.ledgerToday.other -= cost;
    pushEvent(state, {
      kind: 'strike',
      title: 'Labor dispute',
      message: `✊ A staffing dispute cost you $${cost.toLocaleString('en-US')} in settlements.`,
    });
  }
}
