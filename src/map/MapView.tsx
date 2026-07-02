import { useEffect, useRef } from 'react';
import maplibregl, { type GeoJSONSource } from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';

import { CITIES, CITY_BY_ID } from '../data/cities';
import { MODEL_BY_ID } from '../data/vehicles';
import { registerVehicleSprites, spriteKey } from './vehicleSprites';
import { engine } from '../game/engine';
import { useGameTick } from '../game/useEngine';
import { vehicleLngLat } from '../game/simulation';
import { useUI } from '../store/uiStore';
import { daylight } from '../utils/format';
import { arcPoints, type LngLat } from '../utils/geo';
import {
  BUILDING_SOURCE_LAYER,
  INITIAL_VIEW,
  OMT_SOURCE,
  STYLE_URL,
} from './mapConfig';

type FC = GeoJSON.FeatureCollection;

const EMPTY: FC = { type: 'FeatureCollection', features: [] };

// Animated "flowing cargo" dash pattern for route lines (classic ant-path).
const DASH_SEQUENCE: number[][] = [
  [0, 4, 3], [0.5, 4, 2.5], [1, 4, 2], [1.5, 4, 1.5], [2, 4, 1], [2.5, 4, 0.5],
  [3, 4, 0], [0, 0.5, 3, 3.5], [0, 1, 3, 3], [0, 1.5, 3, 2.5], [0, 2, 3, 2],
  [0, 2.5, 3, 1.5], [0, 3, 3, 1], [0, 3.5, 3, 0.5],
];

/** A small "reset to world view" (globe) button in the map control group. */
class ResetViewControl implements maplibregl.IControl {
  private container?: HTMLDivElement;
  onAdd(map: maplibregl.Map): HTMLElement {
    const c = document.createElement('div');
    c.className = 'maplibregl-ctrl maplibregl-ctrl-group';
    const b = document.createElement('button');
    b.type = 'button';
    b.title = 'Reset to world view';
    b.setAttribute('aria-label', 'Reset to world view');
    b.textContent = '🌍';
    b.style.cssText = 'width:29px;height:29px;font-size:16px;line-height:29px;filter:none;';
    b.onclick = () => map.flyTo({
      center: INITIAL_VIEW.center, zoom: INITIAL_VIEW.zoom,
      pitch: INITIAL_VIEW.pitch, bearing: 0, duration: 1400, essential: true,
    });
    c.appendChild(b);
    this.container = c;
    return c;
  }
  onRemove(): void {
    this.container?.parentNode?.removeChild(this.container);
  }
}

function citiesGeoJSON(): FC {
  return {
    type: 'FeatureCollection',
    features: CITIES.map((c) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
      properties: { id: c.id, name: c.name, pop: c.pop },
    })),
  };
}

function routesGeoJSON(): FC {
  const feats: GeoJSON.Feature[] = [];
  for (const r of Object.values(engine.state.routes)) {
    const coords: LngLat[] = [];
    for (let i = 0; i < r.stops.length - 1; i++) {
      const a = CITY_BY_ID[r.stops[i]];
      const b = CITY_BY_ID[r.stops[i + 1]];
      if (!a || !b) continue;
      const seg = arcPoints([a.lng, a.lat], [b.lng, b.lat], 40);
      if (i > 0) seg.shift();
      coords.push(...seg);
    }
    if (coords.length >= 2) {
      feats.push({
        type: 'Feature',
        geometry: { type: 'LineString', coordinates: coords },
        properties: { id: r.id, color: r.color },
      });
    }
  }
  return { type: 'FeatureCollection', features: feats };
}

function hubsGeoJSON(): FC {
  const cityIds = new Set<string>();
  for (const st of Object.values(engine.state.stations)) cityIds.add(st.cityId);
  return {
    type: 'FeatureCollection',
    features: [...cityIds].map((id) => {
      const c = CITY_BY_ID[id];
      return {
        type: 'Feature',
        geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
        properties: { id },
      } as GeoJSON.Feature;
    }),
  };
}

function draftGeoJSON(stops: string[]): { points: FC; line: FC } {
  const coords: LngLat[] = [];
  for (let i = 0; i < stops.length - 1; i++) {
    const a = CITY_BY_ID[stops[i]];
    const b = CITY_BY_ID[stops[i + 1]];
    if (!a || !b) continue;
    const seg = arcPoints([a.lng, a.lat], [b.lng, b.lat], 30);
    if (i > 0) seg.shift();
    coords.push(...seg);
  }
  return {
    points: {
      type: 'FeatureCollection',
      features: stops.map((id, idx) => {
        const c = CITY_BY_ID[id];
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [c.lng, c.lat] },
          properties: { id, order: idx + 1 },
        } as GeoJSON.Feature;
      }),
    },
    line:
      coords.length >= 2
        ? { type: 'FeatureCollection', features: [{ type: 'Feature', geometry: { type: 'LineString', coordinates: coords }, properties: {} }] }
        : EMPTY,
  };
}

function vehiclesGeoJSON(): FC {
  const feats: GeoJSON.Feature[] = [];
  for (const v of Object.values(engine.state.vehicles)) {
    const model = MODEL_BY_ID[v.modelId];
    if (!model) continue;
    const { pos, bearing } = vehicleLngLat(engine.state, v);
    feats.push({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: pos },
      properties: {
        id: v.id,
        sprite: spriteKey(model.mode, model.carries),
        bearing,
        broken: v.status === 'broken' ? 1 : 0,
      },
    });
  }
  return { type: 'FeatureCollection', features: feats };
}

export default function MapView() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);
  const readyRef = useRef(false);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = new maplibregl.Map({
      container: containerRef.current,
      style: STYLE_URL,
      center: INITIAL_VIEW.center,
      zoom: INITIAL_VIEW.zoom,
      pitch: INITIAL_VIEW.pitch,
      bearing: INITIAL_VIEW.bearing,
      minZoom: INITIAL_VIEW.minZoom,
      maxZoom: INITIAL_VIEW.maxZoom,
      attributionControl: { compact: true },
    });
    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'bottom-right');
    map.addControl(new ResetViewControl(), 'bottom-right');

    map.on('load', () => {
      readyRef.current = true;
      const quality = useUI.getState().settings.graphics;
      // MapLibre's style-expression types are extremely strict; our expressions are
      // valid at runtime, so we add layers through a thin any-typed helper.
      const addLayer = (spec: unknown) => map.addLayer(spec as maplibregl.LayerSpecification);

      // Register canvas-drawn 2D vehicle sprites.
      registerVehicleSprites(map);

      // ---- 3D buildings ----
      if (quality === 'high') {
        try {
          addLayer({
            id: 'gtt-3d-buildings',
            source: OMT_SOURCE,
            'source-layer': BUILDING_SOURCE_LAYER,
            type: 'fill-extrusion',
            minzoom: 13,
            paint: {
              'fill-extrusion-color': ['interpolate', ['linear'], ['get', 'render_height'], 0, '#2a3450', 60, '#3a4870', 200, '#4a5a90'],
              'fill-extrusion-height': ['interpolate', ['linear'], ['zoom'], 13, 0, 14.5, ['coalesce', ['get', 'render_height'], 8]],
              'fill-extrusion-base': ['coalesce', ['get', 'render_min_height'], 0],
              'fill-extrusion-opacity': 0.85,
            },
          });
        } catch {
          /* building layer optional — style may vary */
        }
      }

      // ---- Sources ----
      map.addSource('gtt-cities', { type: 'geojson', data: citiesGeoJSON() });
      map.addSource('gtt-routes', { type: 'geojson', data: routesGeoJSON() });
      map.addSource('gtt-hubs', { type: 'geojson', data: hubsGeoJSON() });
      map.addSource('gtt-vehicles', { type: 'geojson', data: vehiclesGeoJSON() });
      map.addSource('gtt-draft-line', { type: 'geojson', data: EMPTY });
      map.addSource('gtt-draft-points', { type: 'geojson', data: EMPTY });
      map.addSource('gtt-city-selected', { type: 'geojson', data: EMPTY });

      // ---- Route lines ----
      addLayer({
        id: 'gtt-routes-glow', type: 'line', source: 'gtt-routes',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 7, 'line-opacity': 0.18, 'line-blur': 4 },
      });
      addLayer({
        id: 'gtt-routes-line', type: 'line', source: 'gtt-routes',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': ['get', 'color'], 'line-width': 2.2, 'line-opacity': 0.9 },
      });
      // Flowing dashes overlay (animated in the rAF loop) — high graphics only.
      if (quality === 'high') {
        addLayer({
          id: 'gtt-routes-flow', type: 'line', source: 'gtt-routes',
          layout: { 'line-cap': 'butt', 'line-join': 'round' },
          paint: { 'line-color': '#ffffff', 'line-width': 1.6, 'line-opacity': 0.55, 'line-dasharray': [0, 4, 3] },
        });
      }

      // ---- Draft (route builder preview) ----
      addLayer({
        id: 'gtt-draft-line', type: 'line', source: 'gtt-draft-line',
        layout: { 'line-cap': 'round', 'line-join': 'round' },
        paint: { 'line-color': '#38e8c6', 'line-width': 2.5, 'line-dasharray': [2, 2], 'line-opacity': 0.9 },
      });

      // ---- Hub rings ----
      addLayer({
        id: 'gtt-hubs', type: 'circle', source: 'gtt-hubs',
        paint: {
          'circle-radius': 9, 'circle-color': 'rgba(0,0,0,0)',
          'circle-stroke-color': '#38e8c6', 'circle-stroke-width': 2, 'circle-stroke-opacity': 0.7,
        },
      });

      // ---- Selected city highlight ring (pulsed in the rAF loop) ----
      addLayer({
        id: 'gtt-city-ring', type: 'circle', source: 'gtt-city-selected',
        paint: {
          'circle-radius': 14, 'circle-color': 'rgba(0,0,0,0)',
          'circle-stroke-color': '#38e8c6', 'circle-stroke-width': 3, 'circle-stroke-opacity': 0.9,
        },
      });

      // ---- Cities ----
      addLayer({
        id: 'gtt-cities-glow', type: 'circle', source: 'gtt-cities',
        paint: {
          'circle-radius': ['min', 16, ['+', 5, ['*', ['get', 'pop'], 0.35]]],
          'circle-color': '#5ff0d4', 'circle-opacity': 0.12, 'circle-blur': 1,
        },
      });
      addLayer({
        id: 'gtt-cities', type: 'circle', source: 'gtt-cities',
        paint: {
          'circle-radius': ['min', 9, ['+', 2.5, ['*', ['get', 'pop'], 0.18]]],
          'circle-color': '#eafcf7',
          'circle-stroke-color': '#0a0e17', 'circle-stroke-width': 1.5,
        },
      });
      // Invisible, enlarged hit target so cities are easy to tap on mobile.
      addLayer({
        id: 'gtt-cities-hit', type: 'circle', source: 'gtt-cities',
        paint: { 'circle-radius': 16, 'circle-color': '#000000', 'circle-opacity': 0 },
      });
      addLayer({
        id: 'gtt-draft-points', type: 'circle', source: 'gtt-draft-points',
        paint: {
          'circle-radius': 8,
          'circle-color': 'rgba(0,0,0,0)', 'circle-stroke-color': '#ffcf5c', 'circle-stroke-width': 3,
        },
      });
      addLayer({
        id: 'gtt-city-labels', type: 'symbol', source: 'gtt-cities',
        minzoom: 3,
        layout: {
          'text-field': ['get', 'name'],
          'text-size': ['interpolate', ['linear'], ['zoom'], 3, 10, 8, 14],
          'text-offset': [0, 1.3], 'text-anchor': 'top',
          'text-font': ['Noto Sans Regular'],
          'text-allow-overlap': false,
        },
        paint: { 'text-color': '#dfeaf5', 'text-halo-color': '#0a0e17', 'text-halo-width': 1.4 },
      });

      // ---- Vehicles (2D top-down sprites, rotated to travel bearing) ----
      addLayer({
        id: 'gtt-vehicles', type: 'symbol', source: 'gtt-vehicles',
        layout: {
          'icon-image': ['get', 'sprite'],
          'icon-size': ['interpolate', ['linear'], ['zoom'], 2, 0.55, 6, 0.9, 12, 1.2],
          'icon-rotate': ['get', 'bearing'],
          'icon-rotation-alignment': 'map',
          'icon-allow-overlap': true,
          'icon-ignore-placement': true,
        },
        paint: { 'icon-opacity': ['case', ['==', ['get', 'broken'], 1], 0.45, 1] },
      });

      // ---- Interactions ----
      // A single, forgiving tap handler: query a padded box and pick the nearest
      // city so small targets at world zoom are still easy to hit on mobile.
      const PAD = 22;
      map.on('click', (e) => {
        const ui = useUI.getState();

        // Vehicles take priority when tapped directly.
        const vehHits = map.queryRenderedFeatures(e.point, { layers: ['gtt-vehicles'] });
        if (vehHits.length && !ui.buildMode) {
          const id = vehHits[0].properties?.id as string;
          if (id) { ui.selectVehicle(id); return; }
        }

        const box: [maplibregl.PointLike, maplibregl.PointLike] = [
          [e.point.x - PAD, e.point.y - PAD],
          [e.point.x + PAD, e.point.y + PAD],
        ];
        const hits = map.queryRenderedFeatures(box, { layers: ['gtt-cities-hit'] });
        if (!hits.length) return;

        // Nearest city centroid to the tap point.
        let best: string | null = null;
        let bestD = Infinity;
        for (const f of hits) {
          const id = f.properties?.id as string;
          const c = CITY_BY_ID[id];
          if (!c) continue;
          const p = map.project([c.lng, c.lat]);
          const d = (p.x - e.point.x) ** 2 + (p.y - e.point.y) ** 2;
          if (d < bestD) { bestD = d; best = id; }
        }
        if (!best) return;
        if (ui.buildMode) ui.toggleDraftStop(best);
        else ui.selectCity(best);
      });

      map.on('mousemove', (e) => {
        const hits = map.queryRenderedFeatures(e.point, { layers: ['gtt-cities-hit', 'gtt-vehicles'] });
        map.getCanvas().style.cursor = hits.length ? 'pointer' : '';
      });
    });

    return () => { map.remove(); mapRef.current = null; readyRef.current = false; };
  }, []);

  // Per-frame animation (independent of React renders): vehicles, route flow,
  // day/night tint and the selected-city pulse ring.
  useEffect(() => {
    let raf = 0;
    let dashStep = 0;
    let lastDash = 0;
    const tick = (ts: number) => {
      const map = mapRef.current;
      if (map && readyRef.current) {
        const src = map.getSource('gtt-vehicles') as GeoJSONSource | undefined;
        if (src) src.setData(vehiclesGeoJSON());

        // Day/night: dim the 3D buildings at night for a subtle time-of-day feel.
        const d = daylight(engine.state.time);
        try { map.setPaintProperty('gtt-3d-buildings', 'fill-extrusion-opacity', 0.5 + d * 0.4); } catch { /* layer may not exist */ }

        // Flowing route dashes (advance ~18fps).
        if (ts - lastDash > 55) {
          lastDash = ts;
          dashStep = (dashStep + 1) % DASH_SEQUENCE.length;
          try { map.setPaintProperty('gtt-routes-flow', 'line-dasharray', DASH_SEQUENCE[dashStep]); } catch { /* flow layer optional */ }
        }

        // Selected-city pulse.
        const pulse = (Math.sin(ts / 320) + 1) / 2;
        try {
          map.setPaintProperty('gtt-city-ring', 'circle-radius', 12 + pulse * 10);
          map.setPaintProperty('gtt-city-ring', 'circle-stroke-opacity', 0.15 + (1 - pulse) * 0.75);
        } catch { /* ring optional */ }
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Rebuild routes + hubs only when their signature changes (cheap + no flicker).
  const tick = useGameTick();
  const sigRef = useRef('');
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    const s = engine.state;
    const sig =
      Object.keys(s.routes).sort().join(',') +
      '|' +
      Object.values(s.stations).map((st) => st.id + st.level).sort().join(',');
    if (sig === sigRef.current) return;
    sigRef.current = sig;
    (map.getSource('gtt-routes') as GeoJSONSource | undefined)?.setData(routesGeoJSON());
    (map.getSource('gtt-hubs') as GeoJSONSource | undefined)?.setData(hubsGeoJSON());
  }, [tick]);

  // Draft (route-builder) preview follows the UI store.
  const draftStops = useUI((s) => s.draftStops);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    const { points, line } = draftGeoJSON(draftStops);
    (map.getSource('gtt-draft-points') as GeoJSONSource | undefined)?.setData(points);
    (map.getSource('gtt-draft-line') as GeoJSONSource | undefined)?.setData(line);
  }, [draftStops]);

  // Fly to a selected city + drive the highlight ring.
  const selectedCity = useUI((s) => s.selectedCity);
  useEffect(() => {
    const map = mapRef.current;
    if (!map || !readyRef.current) return;
    const ring = map.getSource('gtt-city-selected') as GeoJSONSource | undefined;
    if (!selectedCity) { ring?.setData(EMPTY); return; }
    const c = CITY_BY_ID[selectedCity];
    if (!c) return;
    ring?.setData({
      type: 'FeatureCollection',
      features: [{ type: 'Feature', geometry: { type: 'Point', coordinates: [c.lng, c.lat] }, properties: {} }],
    });
    map.flyTo({ center: [c.lng, c.lat], zoom: Math.max(map.getZoom(), 5), duration: 1200, essential: true });
  }, [selectedCity]);

  return <div ref={containerRef} className="absolute inset-0 h-full w-full" />;
}
