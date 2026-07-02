// ALL tunable game-balance numbers live here. Keeping them centralized makes
// the economy easy to reason about and prevents "magic number" bugs.

import type { Mode } from '../data/vehicles';

export const BALANCE = {
  // ---- Time ----
  // Real seconds -> game minutes conversion at each speed multiplier.
  gameMinutesPerRealSecond: { pause: 0, x1: 60, x2: 240, x3: 720 } as Record<string, number>,
  simStepMinutes: 2, // fixed sim timestep (game minutes)
  maxStepsPerFrame: 400, // guard against spiral-of-death after tab is backgrounded

  // ---- Starting conditions by difficulty ----
  difficulty: {
    easy: { startCash: 500_000, startLoan: 250_000, interestRate: 0.04, eventRate: 0.5, label: 'Relaxed' },
    normal: { startCash: 350_000, startLoan: 200_000, interestRate: 0.06, eventRate: 1.0, label: 'Standard' },
    hard: { startCash: 200_000, startLoan: 150_000, interestRate: 0.09, eventRate: 1.6, label: 'Tycoon' },
  } as Record<string, { startCash: number; startLoan: number; interestRate: number; eventRate: number; label: string }>,

  maxLoan: 5_000_000,
  loanStep: 100_000,

  // ---- Production / demand ----
  // Cargo produced per game-hour at a city, scaled by population (millions).
  productionPerPopPerHour: 0.9,
  stockCapPerPop: 60, // max stockpile per cargo per million pop
  paxProductionMult: 1.4, // passengers/mail generate faster than resources

  // ---- Delivery economy ----
  demandMatchMult: 1.0, // paid rate when destination demands the cargo
  demandMissMult: 0.35, // paid rate when it doesn't (still sells, cheaply)
  saturationPerDelivery: 0.06, // how fast a route floods a destination
  saturationDecayPerHour: 0.04, // how fast demand recovers
  minDemandMult: 0.18, // floor so a flooded route still earns a little
  logisticsBonus: 0.15, // extra income from 'logistics' tech

  // Per-mode income multiplier (air/sea move value differently).
  modeIncomeMult: { road: 1.0, rail: 1.05, air: 1.25, sea: 1.1 } as Record<Mode, number>,

  loadTimeMinutes: 45, // time spent at a station loading/unloading

  // ---- Vehicle running / wear ----
  wearPerLeg: 0.6, // condition points lost per completed leg
  conditionSpeedFloor: 0.55, // worst-case speed factor at 0 condition
  maintenanceReducedMult: 0.75, // with 'maintenance' tech

  // ---- Infrastructure ----
  stationCost: { road: 25_000, rail: 120_000, air: 400_000, sea: 350_000 } as Record<Mode, number>,
  stationUpgradeCostMult: 1.6,
  stationSellRefund: 0.4,
  vehicleResaleFactor: 0.55, // fraction of price recovered when selling

  // ---- Research ----
  researchPointsPerDay: 2, // passive
  researchPerDeliveryValue: 0.002, // RP per $ of freight income

  // ---- Events (probabilities per city-day / vehicle-day, scaled by difficulty) ----
  breakdownChancePerLegBase: 0.01,
  events: {
    weatherPerDay: 0.05,
    fuelSpikePerDay: 0.03,
    cityBoomPerDay: 0.02,
    strikePerDay: 0.015,
  },

  // ---- City growth ----
  growthPerSatisfactionPerDay: 0.0006, // pop growth fraction when well-served
  satisfactionDecayPerDay: 0.15,

  fuelPriceBase: 1.0,
} as const;

export type Difficulty = keyof typeof BALANCE.difficulty;
