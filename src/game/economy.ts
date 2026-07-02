// The single money pipeline. EVERY cash movement flows through `transact`, which
// keeps the books balanced and feeds the finance report. No ad-hoc `cash +=`.

import { MODEL_BY_ID } from '../data/vehicles';
import { BALANCE } from './balance';
import type { GameState, LedgerTotals } from './types';

export type LedgerCategory = keyof LedgerTotals;

/**
 * Apply a cash change. `amount` > 0 is income, < 0 is expense.
 * Returns the amount actually applied.
 */
export function transact(state: GameState, category: LedgerCategory, amount: number): number {
  state.cash += amount;
  state.ledgerToday[category] += amount;
  if (amount > 0) state.stats.totalIncome += amount;
  else state.stats.totalSpent += -amount;
  return amount;
}

/** Resale value of the whole fleet (used for net worth). */
export function fleetValue(state: GameState): number {
  let total = 0;
  for (const v of Object.values(state.vehicles)) {
    const model = MODEL_BY_ID[v.modelId];
    if (!model) continue;
    total += model.price * BALANCE.vehicleResaleFactor * (v.condition / 100);
  }
  return total;
}

/** Refundable value of built stations. */
export function stationValue(state: GameState): number {
  let total = 0;
  for (const st of Object.values(state.stations)) {
    total += BALANCE.stationCost[st.mode] * st.level * BALANCE.stationSellRefund;
  }
  return total;
}

export function netWorth(state: GameState): number {
  return state.cash + fleetValue(state) + stationValue(state) - state.loan;
}

/** Can the player afford `amount`? (keeps a small buffer to avoid soft-locks). */
export function canAfford(state: GameState, amount: number): boolean {
  return state.cash >= amount;
}
