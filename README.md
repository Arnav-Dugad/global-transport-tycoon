# 🌍 Global Transport Tycoon

A **premium, 100% free** transport-tycoon game played on the **real world** with
**OpenStreetMap** and **3D buildings**. Build a global logistics empire — connect real
cities with trucks, trains, planes and ships, master supply & demand, research new
technology, and grow your fortune. Runs entirely in the browser, works great on mobile,
and needs **no account, no backend, and no API keys**.

![Free](https://img.shields.io/badge/price-free%20forever-38e8c6) ![No API key](https://img.shields.io/badge/API%20key-none-5cc8ff)

## ✨ Features

- **Real 3D world map** — MapLibre GL JS + [OpenFreeMap](https://openfreemap.org) vector
  tiles with real building heights (fill-extrusion), pitch/rotate, and day–night lighting.
- **4 transport modes** — Road, Rail, Air and Sea, each with its own vehicles, speeds,
  infrastructure and unlock gates.
- **Deep economy** — cargo & passenger types, per-city supply & demand, market saturation,
  loans with interest, fuel prices, maintenance, and a live finance chart.
- **Deterministic simulation** — a fixed-timestep engine with a seeded RNG. Same seed +
  same actions ⇒ identical outcome (fully unit-tested), so saves are perfectly reproducible.
- **Progression** — a research tech tree, station upgrades, city growth, random events
  (breakdowns, weather, booms, strikes), achievements and reputation.
- **Mobile-first** — bottom-sheet UI, big touch targets, pinch-zoom/tilt, safe-area insets,
  a low-graphics mode for weaker phones, and an installable PWA manifest.
- **Offline saves** — multiple save slots + autosave in IndexedDB. Your progress never
  leaves your device.

## 🎮 How to play

1. **Build a route** — tap *Build*, pick a mode (Road is available from the start), then tap
   2–6 glowing cities on the map. Confirm to build stations.
2. **Add vehicles** — open the route and buy vehicles. They auto-load whatever a destination
   demands and shuttle it back and forth for profit.
3. **Grow** — deliver what cities want (it pays most), spread routes to avoid flooding a
   market, research trains/planes/ships, manage debt, and climb from Millionaire to
   **Global Magnate**.

## 🛠️ Tech stack

| Area | Choice |
| --- | --- |
| Framework | React 18 + TypeScript + Vite |
| Map | MapLibre GL JS + OpenFreeMap (no key) |
| State | Custom fixed-timestep engine + Zustand (UI) |
| UI | Tailwind CSS + Framer Motion |
| Charts | Recharts |
| Storage | IndexedDB (idb-keyval) |

## 🚀 Local development

```bash
npm install
npm run dev        # start dev server
npm run test       # run the simulation unit tests
npm run build      # type-check + production build
npm run preview    # preview the production build
```

## ☁️ Deploy to Vercel

This is a static SPA — deployment is zero-config and free.

1. Push this repo to GitHub.
2. In [Vercel](https://vercel.com), **Add New → Project** and import the repo.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output `dist`.
4. Deploy. `vercel.json` already contains the SPA rewrite so deep links work.

No environment variables are required.

## 🗂️ Project structure

```
src/
  game/      # deterministic simulation: engine, economy, transport, events, save
  data/      # cities, cargo, vehicle catalog, tech tree
  map/       # MapLibre setup + layers (3D buildings, routes, vehicles)
  store/     # Zustand UI store
  ui/        # HUD, bottom-sheet panels, start screen, tutorial
  utils/     # geo (haversine/great-circle), formatting
```

## 📜 Credits & license

- Map data © [OpenStreetMap](https://www.openstreetmap.org/copyright) contributors.
- Tiles by [OpenFreeMap](https://openfreemap.org) & [OpenMapTiles](https://openmaptiles.org).
- Built with MapLibre GL JS (BSD-3), React, Vite (MIT).

Made to be free forever. Enjoy building your empire! 🚚🚆✈️🚢
