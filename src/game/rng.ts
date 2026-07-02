// Seeded, serializable PRNG (mulberry32) + string hashing.
// Deterministic: same seed + same call sequence => identical results.
// This is the backbone of reproducible saves and fair random events.

export interface RngState {
  s: number;
}

export function createRng(seed: number): RngState {
  return { s: seed >>> 0 };
}

/** Advance the RNG and return a float in [0,1). Mutates state. */
export function nextFloat(state: RngState): number {
  state.s = (state.s + 0x6d2b79f5) >>> 0;
  let t = state.s;
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

/** Integer in [min, max] inclusive. */
export function nextInt(state: RngState, min: number, max: number): number {
  return min + Math.floor(nextFloat(state) * (max - min + 1));
}

/** True with probability p. */
export function chance(state: RngState, p: number): boolean {
  return nextFloat(state) < p;
}

export function pick<T>(state: RngState, arr: readonly T[]): T {
  return arr[Math.floor(nextFloat(state) * arr.length)];
}

/** Stable 32-bit hash of a string — for deterministic per-entity traits. */
export function hashString(str: string): number {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** Deterministic float in [0,1) derived from a string (no shared state). */
export function hashFloat(str: string): number {
  return hashString(str) / 4294967296;
}
