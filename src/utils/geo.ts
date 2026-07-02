// Geospatial helpers. Pure functions — safe to unit test and reuse anywhere.

const R_EARTH_KM = 6371;
const DEG2RAD = Math.PI / 180;
const RAD2DEG = 180 / Math.PI;

export type LngLat = [number, number]; // [lng, lat] — MapLibre order

/** Great-circle distance in kilometres between two [lng,lat] points. */
export function haversineKm(a: LngLat, b: LngLat): number {
  const lat1 = a[1] * DEG2RAD;
  const lat2 = b[1] * DEG2RAD;
  const dLat = (b[1] - a[1]) * DEG2RAD;
  const dLng = (b[0] - a[0]) * DEG2RAD;
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * R_EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)));
}

/**
 * Great-circle interpolation (slerp) between two [lng,lat] points.
 * t in [0,1]. Falls back to linear for near-identical points.
 */
export function greatCirclePoint(a: LngLat, b: LngLat, t: number): LngLat {
  const lat1 = a[1] * DEG2RAD;
  const lon1 = a[0] * DEG2RAD;
  const lat2 = b[1] * DEG2RAD;
  const lon2 = b[0] * DEG2RAD;

  const dLat = lat2 - lat1;
  const dLon = lon2 - lon1;
  const hav =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  const d = 2 * Math.asin(Math.min(1, Math.sqrt(hav)));

  if (d < 1e-9) return [a[0], a[1]];

  const A = Math.sin((1 - t) * d) / Math.sin(d);
  const B = Math.sin(t * d) / Math.sin(d);

  const x = A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
  const y = A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
  const z = A * Math.sin(lat1) + B * Math.sin(lat2);

  const lat = Math.atan2(z, Math.sqrt(x * x + y * y));
  const lon = Math.atan2(y, x);
  return [lon * RAD2DEG, lat * RAD2DEG];
}

/** Initial bearing (degrees, 0=N clockwise) from a to b. */
export function bearingDeg(a: LngLat, b: LngLat): number {
  const lat1 = a[1] * DEG2RAD;
  const lat2 = b[1] * DEG2RAD;
  const dLon = (b[0] - a[0]) * DEG2RAD;
  const y = Math.sin(dLon) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
  return (Math.atan2(y, x) * RAD2DEG + 360) % 360;
}

/** Densify a great-circle arc into a polyline for smooth map rendering. */
export function arcPoints(a: LngLat, b: LngLat, segments = 48): LngLat[] {
  const pts: LngLat[] = [];
  for (let i = 0; i <= segments; i++) {
    pts.push(greatCirclePoint(a, b, i / segments));
  }
  return pts;
}
