// Persistence via IndexedDB (idb-keyval). Saves are plain JSON-cloneable GameState
// plus a small meta record for the load menu. Versioned for forward migrations.

import { get, set, del, keys } from 'idb-keyval';
import { netWorth } from './economy';
import type { GameState } from './types';

export const SAVE_VERSION = 1;
const PREFIX = 'gtt:save:';
export const AUTOSAVE_SLOT = 'auto';

export interface SaveMeta {
  slot: string;
  savedAt: number; // real epoch ms
  gameTime: number;
  netWorth: number;
  routes: number;
  vehicles: number;
  difficulty: string;
}

interface SaveRecord {
  meta: SaveMeta;
  state: GameState;
}

export async function saveGame(slot: string, state: GameState): Promise<void> {
  const meta: SaveMeta = {
    slot,
    savedAt: Date.now(),
    gameTime: state.time,
    netWorth: netWorth(state),
    routes: Object.keys(state.routes).length,
    vehicles: Object.keys(state.vehicles).length,
    difficulty: state.difficulty,
  };
  // Deep-clone through JSON so we never persist live object references.
  const record: SaveRecord = { meta, state: JSON.parse(JSON.stringify(state)) };
  await set(PREFIX + slot, record);
}

export async function loadGame(slot: string): Promise<GameState | null> {
  const record = (await get(PREFIX + slot)) as SaveRecord | undefined;
  if (!record) return null;
  return migrate(record.state);
}

export async function deleteSave(slot: string): Promise<void> {
  await del(PREFIX + slot);
}

export async function listSaves(): Promise<SaveMeta[]> {
  const allKeys = (await keys()) as string[];
  const metas: SaveMeta[] = [];
  for (const k of allKeys) {
    if (typeof k === 'string' && k.startsWith(PREFIX)) {
      const record = (await get(k)) as SaveRecord | undefined;
      if (record?.meta) metas.push(record.meta);
    }
  }
  return metas.sort((a, b) => b.savedAt - a.savedAt);
}

/** Apply forward migrations. Currently v1 only. */
function migrate(state: GameState): GameState {
  // Defensive defaults for fields that may be missing in older saves.
  if (state.weatherUntil == null) state.weatherUntil = 0;
  if (state.reputation == null) state.reputation = 50;
  state.version = SAVE_VERSION;
  return state;
}
