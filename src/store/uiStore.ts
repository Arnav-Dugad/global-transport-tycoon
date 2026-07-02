// UI-only state (not part of the simulation): which panel is open, map selection,
// route-building draft, settings. Persisted settings live in localStorage.

import { create } from 'zustand';
import type { Mode } from '../data/vehicles';

export type PanelId = 'build' | 'fleet' | 'routes' | 'finance' | 'research' | 'contracts' | 'city' | 'menu' | null;
export type GraphicsQuality = 'high' | 'low';

interface Settings {
  graphics: GraphicsQuality;
  sound: boolean;
  music: boolean;
}

function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem('gtt:settings');
    if (raw) return { graphics: 'high', sound: true, music: false, ...JSON.parse(raw) };
  } catch {
    /* ignore */
  }
  return { graphics: 'high', sound: true, music: false };
}

function saveSettings(s: Settings): void {
  try { localStorage.setItem('gtt:settings', JSON.stringify(s)); } catch { /* ignore */ }
}

export type Phase = 'start' | 'playing';

interface UIState {
  phase: Phase;
  showTutorial: boolean;
  panel: PanelId;
  selectedCity: string | null;
  selectedRoute: string | null;
  selectedVehicle: string | null;

  // Route builder draft
  buildMode: Mode | null;
  draftStops: string[];

  toast: string | null;

  settings: Settings;

  openPanel: (p: PanelId) => void;
  closePanel: () => void;
  selectCity: (id: string | null) => void;
  selectRoute: (id: string | null) => void;
  selectVehicle: (id: string | null) => void;

  startBuild: (mode: Mode) => void;
  cancelBuild: () => void;
  toggleDraftStop: (cityId: string) => void;

  showToast: (msg: string) => void;
  clearToast: () => void;

  setGraphics: (q: GraphicsQuality) => void;
  toggleSound: () => void;
  toggleMusic: () => void;

  setPhase: (p: Phase) => void;
  setShowTutorial: (v: boolean) => void;
}

export const useUI = create<UIState>((set, getState) => ({
  phase: 'start',
  showTutorial: false,
  panel: null,
  selectedCity: null,
  selectedRoute: null,
  selectedVehicle: null,
  buildMode: null,
  draftStops: [],
  toast: null,
  settings: loadSettings(),

  openPanel: (p) => set({ panel: p }),
  closePanel: () => set({ panel: null }),
  selectCity: (id) => set({ selectedCity: id, panel: id ? 'city' : null }),
  selectRoute: (id) => set({ selectedRoute: id }),
  selectVehicle: (id) => set({ selectedVehicle: id }),

  startBuild: (mode) => set({ buildMode: mode, draftStops: [], panel: 'build', selectedCity: null }),
  cancelBuild: () => set({ buildMode: null, draftStops: [] }),
  toggleDraftStop: (cityId) => {
    const { draftStops } = getState();
    if (draftStops.includes(cityId)) {
      set({ draftStops: draftStops.filter((c) => c !== cityId) });
    } else {
      if (draftStops.length >= 6) return;
      set({ draftStops: [...draftStops, cityId] });
    }
  },

  showToast: (msg) => {
    set({ toast: msg });
    window.setTimeout(() => {
      if (getState().toast === msg) set({ toast: null });
    }, 2600);
  },
  clearToast: () => set({ toast: null }),

  setGraphics: (q) => set((s) => { const settings = { ...s.settings, graphics: q }; saveSettings(settings); return { settings }; }),
  toggleSound: () => set((s) => { const settings = { ...s.settings, sound: !s.settings.sound }; saveSettings(settings); return { settings }; }),
  toggleMusic: () => set((s) => { const settings = { ...s.settings, music: !s.settings.music }; saveSettings(settings); return { settings }; }),

  setPhase: (p) => set({ phase: p }),
  setShowTutorial: (v) => set({ showTutorial: v }),
}));
