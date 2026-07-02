// Core simulation types. GameState is a plain, serializable object — the engine
// mutates it in fixed timesteps; the whole thing round-trips through JSON for saves.

import type { Mode } from '../data/vehicles';
import type { Difficulty } from './balance';
import type { RngState } from './rng';

export type { Mode };

export interface CityState {
  id: string;
  population: number; // millions (grows over time)
  produces: string[]; // resource cargo ids this city outputs
  demands: string[]; // resource cargo ids this city wants
  stock: Record<string, number>; // cargo waiting to be shipped
  saturation: Record<string, number>; // per-cargo demand flooding (0..~1)
  satisfaction: number; // 0..1 rolling service quality -> growth
  boostUntil: number; // game-minute timestamp of an active "city boom"
}

export interface Station {
  id: string; // `${cityId}:${mode}`
  cityId: string;
  mode: Mode;
  level: number; // 1..3
}

export type VehicleStatus = 'loading' | 'moving' | 'broken';

export interface Vehicle {
  id: string;
  name: string;
  modelId: string;
  mode: Mode;
  routeId: string;
  legIndex: number; // index of current stop in route.stops (the origin of current leg)
  progress: number; // 0..1 along current leg
  status: VehicleStatus;
  loadTimer: number; // game minutes remaining in loading state
  brokenTimer: number; // game minutes remaining broken
  cargo: Record<string, number>;
  condition: number; // 0..100
  age: number; // game days in service
  totalIncome: number; // lifetime gross delivery income
  reverse: boolean; // traversing the route stops backwards (ping-pong)
}

export interface Route {
  id: string;
  name: string;
  mode: Mode;
  stops: string[]; // ordered city ids (>=2)
  color: string;
  createdAt: number;
}

export interface FinanceDay {
  day: number;
  income: number;
  expenses: number;
  netWorth: number;
}

export interface LedgerTotals {
  freight: number;
  maintenance: number;
  fuel: number;
  interest: number;
  purchases: number;
  other: number;
}

export interface GameEvent {
  id: string;
  time: number;
  kind: 'breakdown' | 'weather' | 'fuel' | 'boom' | 'strike' | 'info' | 'achievement';
  title: string;
  message: string;
}

export interface Achievement {
  id: string;
  unlockedAt: number;
}

export interface Contract {
  id: string;
  fromCity: string;
  toCity: string;
  cargo: string;
  amount: number;
  reward: number;
  rp: number;
  deadline: number; // game-minute timestamp
  createdAt: number;
  progress: number;
  status: 'active' | 'done' | 'failed';
}

export interface GameStats {
  totalDelivered: number; // cargo units
  totalTrips: number;
  totalIncome: number;
  totalSpent: number;
}

export interface GameState {
  version: number;
  seed: number;
  rng: RngState;
  difficulty: Difficulty;
  companyName: string;

  time: number; // game minutes since start
  lastProcessedDay: number; // for daily rollovers

  cash: number;
  loan: number;
  interestRate: number;

  researchPoints: number;
  unlockedTech: string[];
  unlockedModes: Mode[];
  autoReplace: boolean;

  cities: Record<string, CityState>;
  stations: Record<string, Station>;
  routes: Record<string, Route>;
  vehicles: Record<string, Vehicle>;

  ledgerToday: LedgerTotals;
  finance: FinanceDay[]; // rolling daily history (capped)
  reputation: number; // 0..100
  fuelPrice: number; // multiplier around 1.0
  weatherUntil: number; // game-minute timestamp; while active, vehicles run slower

  stats: GameStats;
  achievements: Achievement[];
  contracts: Contract[];
  events: GameEvent[]; // recent, capped

  nextId: number; // monotonic id counter (deterministic)
}
