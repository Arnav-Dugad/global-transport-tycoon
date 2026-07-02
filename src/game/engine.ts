// The engine owns the authoritative GameState and runs the fixed-timestep loop.
// UI subscribes via `tick` (useSyncExternalStore); the map reads `state` live each
// animation frame. Player actions go through here so we notify + autosave centrally.

import { BALANCE } from './balance';
import { advanceWorld } from './simulation';
import { newGame } from './world';
import { AUTOSAVE_SLOT, saveGame } from './save';
import * as A from './actions';
import type { GameState } from './types';
import type { Difficulty } from './balance';
import type { Mode } from '../data/vehicles';

export type SpeedKey = 'pause' | 'x1' | 'x2' | 'x3';

const STEP = BALANCE.simStepMinutes;
const AUTOSAVE_INTERVAL_MS = 30_000;
const NOTIFY_INTERVAL_MS = 90;

class GameEngine {
  state: GameState = newGame('normal');
  speed: SpeedKey = 'pause';
  private listeners = new Set<() => void>();
  private tick = 0;
  private raf = 0;
  private lastTs = 0;
  private acc = 0;
  private lastNotify = 0;
  private lastAutosave = 0;
  started = false;
  active = false; // true once a game is actually started/loaded (gates autosave)

  // ---- external store contract ----
  subscribe = (cb: () => void): (() => void) => {
    this.listeners.add(cb);
    return () => this.listeners.delete(cb);
  };
  getTick = (): number => this.tick;
  private notify(): void {
    this.tick++;
    this.listeners.forEach((l) => l());
  }

  // ---- lifecycle ----
  startGame(difficulty: Difficulty, seed?: number, companyName?: string): void {
    this.state = newGame(difficulty, seed, companyName);
    this.speed = 'x1';
    this.acc = 0;
    this.active = true;
    this.notify();
  }

  loadState(state: GameState): void {
    this.state = state;
    this.speed = 'pause';
    this.acc = 0;
    this.active = true;
    this.notify();
  }

  start(): void {
    if (this.started) return;
    this.started = true;
    this.lastTs = performance.now();
    this.lastAutosave = this.lastTs;
    const loop = (ts: number) => {
      this.frame(ts);
      this.raf = requestAnimationFrame(loop);
    };
    this.raf = requestAnimationFrame(loop);
  }

  stop(): void {
    this.started = false;
    cancelAnimationFrame(this.raf);
  }

  setSpeed(speed: SpeedKey): void {
    this.speed = speed;
    this.notify();
  }

  private frame(ts: number): void {
    const dtMs = Math.min(250, ts - this.lastTs); // clamp big gaps (tab switch)
    this.lastTs = ts;

    const gmPerSec = BALANCE.gameMinutesPerRealSecond[this.speed] ?? 0;
    this.acc += (dtMs / 1000) * gmPerSec;

    let steps = 0;
    while (this.acc >= STEP && steps < BALANCE.maxStepsPerFrame) {
      advanceWorld(this.state, STEP);
      this.acc -= STEP;
      steps += 1;
    }
    if (this.acc > STEP * BALANCE.maxStepsPerFrame) this.acc = 0; // drop backlog

    if (ts - this.lastNotify >= NOTIFY_INTERVAL_MS) {
      this.lastNotify = ts;
      this.notify();
    }

    if (this.active && ts - this.lastAutosave >= AUTOSAVE_INTERVAL_MS) {
      this.lastAutosave = ts;
      void saveGame(AUTOSAVE_SLOT, this.state);
    }
  }

  // ---- action wrappers (validate -> mutate -> notify) ----
  buildRoute(mode: Mode, stops: string[], name?: string): A.ActionResult {
    const r = A.buildRoute(this.state, mode, stops, name);
    this.notify();
    return r;
  }
  removeRoute(id: string): A.ActionResult { const r = A.removeRoute(this.state, id); this.notify(); return r; }
  buyVehicle(modelId: string, routeId: string, name?: string): A.ActionResult {
    const r = A.buyVehicle(this.state, modelId, routeId, name); this.notify(); return r;
  }
  sellVehicle(id: string): A.ActionResult { const r = A.sellVehicle(this.state, id); this.notify(); return r; }
  serviceVehicle(id: string): A.ActionResult { const r = A.serviceVehicle(this.state, id); this.notify(); return r; }
  upgradeStation(cityId: string, mode: Mode): A.ActionResult { const r = A.upgradeStation(this.state, cityId, mode); this.notify(); return r; }
  takeLoan(amount: number): A.ActionResult { const r = A.takeLoan(this.state, amount); this.notify(); return r; }
  repayLoan(amount: number): A.ActionResult { const r = A.repayLoan(this.state, amount); this.notify(); return r; }
  research(techId: string): A.ActionResult { const r = A.research(this.state, techId); this.notify(); return r; }
  setAutoReplace(v: boolean): void { this.state.autoReplace = v; this.notify(); }

  saveNow(slot: string): Promise<void> { return saveGame(slot, this.state); }
}

export const engine = new GameEngine();
