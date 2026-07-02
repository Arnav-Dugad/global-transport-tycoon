// React bindings for the engine. Components subscribe to the engine `tick` and read
// live state through a selector. Cheap: the selector recomputes only on tick change.

import { useSyncExternalStore } from 'react';
import { engine } from './engine';
import type { GameState } from './types';

export function useGameTick(): number {
  return useSyncExternalStore(engine.subscribe, engine.getTick, engine.getTick);
}

export function useGame<T>(selector: (s: GameState) => T): T {
  useGameTick();
  return selector(engine.state);
}

export { engine };
