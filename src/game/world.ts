// New-game construction and deterministic per-city economic profiles.

import { CITIES } from '../data/cities';
import { RESOURCE_TYPES } from '../data/cargo';
import { BALANCE, type Difficulty } from './balance';
import { createRng, hashString } from './rng';
import type { CityState, GameState } from './types';

/**
 * Each city's produced/demanded resources are derived deterministically from its
 * id, so a given world is always economically consistent (and reproducible).
 * Passengers + mail are universal (added at delivery time), so this only covers
 * the resource cargo that create trade opportunities between cities.
 */
export function cityProfile(cityId: string): { produces: string[]; demands: string[] } {
  const h = hashString(cityId);
  const n = RESOURCE_TYPES.length;
  const a = h % n;
  const b = (Math.floor(h / n) + 1) % n;
  const c = (Math.floor(h / (n * n)) + 3) % n;

  const produces = [RESOURCE_TYPES[a]];
  if (b !== a) produces.push(RESOURCE_TYPES[b]);

  // Demands are offset from what it produces -> encourages inter-city trade.
  const demands: string[] = [];
  const d1 = RESOURCE_TYPES[(a + 2) % n];
  const d2 = RESOURCE_TYPES[(c + 1) % n];
  if (!produces.includes(d1)) demands.push(d1);
  if (!produces.includes(d2) && d2 !== d1) demands.push(d2);
  if (demands.length === 0) demands.push(RESOURCE_TYPES[(a + 4) % n]);

  return { produces, demands };
}

function makeCity(id: string, population: number): CityState {
  const { produces, demands } = cityProfile(id);
  return {
    id,
    population,
    produces,
    demands,
    stock: {},
    saturation: {},
    satisfaction: 0.5,
    boostUntil: 0,
  };
}

export function newGame(difficulty: Difficulty, seed?: number, companyName?: string): GameState {
  const s = seed ?? (Math.floor(Math.random() * 0xffffffff) >>> 0);
  const cfg = BALANCE.difficulty[difficulty];

  const cities: Record<string, CityState> = {};
  for (const c of CITIES) cities[c.id] = makeCity(c.id, c.pop);

  return {
    version: 1,
    seed: s,
    rng: createRng(s),
    difficulty,
    companyName: companyName?.trim() || 'Ancora Logistics',

    time: 8 * 60, // start at 08:00 day 1
    lastProcessedDay: 0,

    cash: cfg.startCash,
    loan: cfg.startLoan,
    interestRate: cfg.interestRate,

    researchPoints: 0,
    unlockedTech: [],
    unlockedModes: ['road'],
    autoReplace: false,

    cities,
    stations: {},
    routes: {},
    vehicles: {},

    ledgerToday: { freight: 0, maintenance: 0, fuel: 0, interest: 0, purchases: 0, other: 0 },
    finance: [],
    reputation: 50,
    fuelPrice: BALANCE.fuelPriceBase,
    weatherUntil: 0,

    stats: { totalDelivered: 0, totalTrips: 0, totalIncome: 0, totalSpent: 0 },
    achievements: [],
    contracts: [],
    events: [],

    nextId: 1,
  };
}

/** Monotonic, deterministic id generator (safe for saves & replays). */
export function nextId(state: GameState, prefix: string): string {
  const id = `${prefix}${state.nextId}`;
  state.nextId += 1;
  return id;
}
