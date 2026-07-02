// Achievement definitions + checker. Evaluated once per game-day.

import { netWorth } from './economy';
import { pushEvent } from './events';
import type { GameState } from './types';

export interface AchievementDef {
  id: string;
  name: string;
  description: string;
  emoji: string;
  test: (s: GameState) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: 'first_route', name: 'On the Map', description: 'Build your first route.', emoji: '🗺️', test: (s) => Object.keys(s.routes).length >= 1 },
  { id: 'fleet5', name: 'Small Fleet', description: 'Own 5 vehicles.', emoji: '🚐', test: (s) => Object.keys(s.vehicles).length >= 5 },
  { id: 'fleet25', name: 'Logistics Network', description: 'Own 25 vehicles.', emoji: '🚚', test: (s) => Object.keys(s.vehicles).length >= 25 },
  { id: 'multimodal', name: 'Multimodal', description: 'Operate 3 different transport modes.', emoji: '🔀', test: (s) => new Set(Object.values(s.routes).map((r) => r.mode)).size >= 3 },
  { id: 'millionaire', name: 'Millionaire', description: 'Reach $1M net worth.', emoji: '💰', test: (s) => netWorth(s) >= 1_000_000 },
  { id: 'tycoon', name: 'Tycoon', description: 'Reach $10M net worth.', emoji: '🏦', test: (s) => netWorth(s) >= 10_000_000 },
  { id: 'magnate', name: 'Global Magnate', description: 'Reach $100M net worth.', emoji: '👑', test: (s) => netWorth(s) >= 100_000_000 },
  { id: 'debtfree', name: 'Debt Free', description: 'Pay off all loans.', emoji: '✅', test: (s) => s.loan <= 0 && Object.keys(s.routes).length > 0 },
  { id: 'researcher', name: 'Innovator', description: 'Unlock 5 technologies.', emoji: '🔬', test: (s) => s.unlockedTech.length >= 5 },
  { id: 'delivered1m', name: 'Cargo King', description: 'Deliver 1,000,000 units of cargo.', emoji: '📦', test: (s) => s.stats.totalDelivered >= 1_000_000 },
];

const ACH_BY_ID = Object.fromEntries(ACHIEVEMENTS.map((a) => [a.id, a]));

export function checkAchievements(state: GameState): void {
  const have = new Set(state.achievements.map((a) => a.id));
  for (const a of ACHIEVEMENTS) {
    if (have.has(a.id)) continue;
    if (a.test(state)) {
      state.achievements.push({ id: a.id, unlockedAt: state.time });
      pushEvent(state, {
        kind: 'achievement',
        title: `Achievement: ${a.name}`,
        message: `${a.emoji} ${a.description}`,
      });
    }
  }
}

export { ACH_BY_ID };
