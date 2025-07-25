const ORIGIN = { lat: 40.765, lon: -111.89 }; // Set to your area

export function gpsToXY(lat: number, lon: number): [number, number] {
  const R = 6371000; // Earth radius in meters
  const dLat = (lat - ORIGIN.lat) * (Math.PI / 180);
  const dLon = (lon - ORIGIN.lon) * (Math.PI / 180);
  const x = dLon * R * Math.cos(ORIGIN.lat * Math.PI / 180);
  const y = dLat * R;
  return [x, y];
}
