/** Straight-line distance in meters. */
export function haversine(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6_371_000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(s));
}

/**
 * Rough driving ETA from straight-line distance.
 *
 * Short hops are mostly surface streets and parking, so they get a slower
 * assumed speed plus a flat two minutes for finding a spot and walking in.
 */
export function drivingEta(distanceMeters: number): number {
  const km = distanceMeters / 1000;
  const kph = km < 2 ? 22 : km < 8 ? 34 : 55;
  return Math.max(1, Math.round((km / kph) * 60) + 2);
}

export function milesLabel(distanceMeters: number): string {
  const miles = distanceMeters / 1609.34;
  if (miles < 0.1) return 'at the spa';
  if (miles < 10) return `${miles.toFixed(1)} mi away`;
  return `${Math.round(miles)} mi away`;
}

/** Point `fraction` of the way from `from` to `to`. Used by the demo location simulator. */
export function interpolate(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  fraction: number,
): { lat: number; lng: number } {
  const f = Math.min(1, Math.max(0, fraction));
  return {
    lat: from.lat + (to.lat - from.lat) * f,
    lng: from.lng + (to.lng - from.lng) * f,
  };
}
