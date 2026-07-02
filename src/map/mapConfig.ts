// Map tile configuration. OpenFreeMap = free, no API key, no rate limits, and its
// vector tiles carry building heights for 3D extrusion. Swap STYLE_URL to change
// providers (e.g. a MapTiler style URL with a key) without touching anything else.

export const STYLE_URL = 'https://tiles.openfreemap.org/styles/liberty';

// Vector source + source-layer that OpenMapTiles/OpenFreeMap use for buildings.
export const OMT_SOURCE = 'openmaptiles';
export const BUILDING_SOURCE_LAYER = 'building';

export const INITIAL_VIEW = {
  center: [10, 30] as [number, number],
  zoom: 2.2,
  pitch: 30,
  bearing: 0,
  minZoom: 1.4,
  maxZoom: 17,
};
