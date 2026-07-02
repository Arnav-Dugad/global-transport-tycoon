// Contracts / missions. Timed delivery goals that pay bonus cash + research points.
// Generation and crediting run inside the deterministic sim (seeded state RNG), so
// contracts are reproducible and never break save determinism.

import { CITIES, CITY_BY_ID } from '../data/cities';
import { CARGO_BY_ID } from '../data/cargo';
import { nextFloat, nextInt } from './rng';
import { transact } from './economy';
import { pushEvent } from './events';
import { haversineKm } from '../utils/geo';
import type { Contract, GameState } from './types';

const MAX_ACTIVE = 3;
const GEN_CHANCE_PER_DAY = 0.5;

function pickCity(state: GameState): string {
  const i = nextInt(state.rng, 0, CITIES.length - 1);
  return CITIES[i].id;
}

/** Called each game-day: spawn new contracts and expire old ones. */
export function updateContracts(state: GameState): void {
  // Expire past-deadline active contracts.
  for (const c of state.contracts) {
    if (c.status === 'active' && state.time > c.deadline) {
      c.status = 'failed';
      pushEvent(state, { kind: 'info', title: 'Contract expired', message: `⌛ ${CITY_BY_ID[c.fromCity]?.name} → ${CITY_BY_ID[c.toCity]?.name} was not fulfilled in time.` });
    }
  }
  // Drop resolved contracts from the list (keep only active).
  state.contracts = state.contracts.filter((c) => c.status === 'active');

  // Maybe generate a new one.
  const active = state.contracts.length;
  if (active < MAX_ACTIVE && nextFloat(state.rng) < GEN_CHANCE_PER_DAY) {
    const from = pickCity(state);
    let to = pickCity(state);
    let guard = 0;
    while (to === from && guard++ < 8) to = pickCity(state);
    if (to === from) return;

    const dest = state.cities[to];
    const cargo = dest.demands.length > 0 && nextFloat(state.rng) < 0.7
      ? dest.demands[nextInt(state.rng, 0, dest.demands.length - 1)]
      : 'passengers';

    const distance = haversineKm([CITY_BY_ID[from].lng, CITY_BY_ID[from].lat], [CITY_BY_ID[to].lng, CITY_BY_ID[to].lat]);
    const amount = 50 + nextInt(state.rng, 0, 10) * 25; // 50..300
    const def = CARGO_BY_ID[cargo];
    const reward = Math.round(amount * (def?.basePrice ?? 3) * (distance / 100) * (1.4 + nextFloat(state.rng) * 0.8));
    const days = 20 + nextInt(state.rng, 0, 20);

    const contract: Contract = {
      id: `c${state.nextId++}`,
      fromCity: from,
      toCity: to,
      cargo,
      amount,
      reward,
      rp: Math.round(reward / 400),
      deadline: state.time + days * 24 * 60,
      createdAt: state.time,
      progress: 0,
      status: 'active',
    };
    state.contracts.push(contract);
    pushEvent(state, {
      kind: 'info',
      title: 'New contract available',
      message: `📋 Deliver ${amount} ${def?.name ?? cargo} to ${CITY_BY_ID[to]?.name} for ${reward.toLocaleString('en-US')}.`,
    });
  }
}

/** Called on every delivery: advance any matching active contract. */
export function creditContracts(state: GameState, destCityId: string, cargoId: string, amount: number): void {
  for (const c of state.contracts) {
    if (c.status !== 'active') continue;
    if (c.toCity !== destCityId || c.cargo !== cargoId) continue;
    c.progress += amount;
    if (c.progress >= c.amount) {
      c.status = 'done';
      transact(state, 'other', c.reward);
      state.researchPoints += c.rp;
      state.reputation = Math.min(100, state.reputation + 2);
      pushEvent(state, {
        kind: 'achievement',
        title: 'Contract complete! 🎉',
        message: `+${c.reward.toLocaleString('en-US')} and +${c.rp} RP for delivering to ${CITY_BY_ID[c.toCity]?.name}.`,
      });
    }
  }
}
