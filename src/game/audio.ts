// Tiny WebAudio sound engine — all sounds are synthesized, so there are no asset
// files (keeps the game free & light). Respects the user's sound setting and only
// starts the AudioContext after a user gesture (browser autoplay policy).

import { useUI } from '../store/uiStore';

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    try { ctx = new Ctor(); } catch { return null; }
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

function enabled(): boolean {
  return useUI.getState().settings.sound;
}

function tone(freq: number, start: number, dur: number, type: OscillatorType, peak: number): void {
  const c = getCtx();
  if (!c) return;
  const t0 = c.currentTime + start;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + dur + 0.02);
}

/** Call once from the first user gesture so audio is unlocked on mobile. */
export function unlockAudio(): void {
  getCtx();
}

export const sfx = {
  coin(): void {
    if (!enabled()) return;
    tone(880, 0, 0.09, 'triangle', 0.06);
    tone(1320, 0.06, 0.12, 'triangle', 0.05);
  },
  click(): void {
    if (!enabled()) return;
    tone(420, 0, 0.05, 'square', 0.03);
  },
  achievement(): void {
    if (!enabled()) return;
    [523, 659, 784, 1047].forEach((f, i) => tone(f, i * 0.08, 0.18, 'triangle', 0.06));
  },
  error(): void {
    if (!enabled()) return;
    tone(200, 0, 0.16, 'sawtooth', 0.04);
  },
};
