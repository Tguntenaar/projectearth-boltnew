import * as THREE from 'three';


/**
 * TODO the coordinates this returns need to be corrected in flight path
 * rotated.applyAxisAngle(new THREE.Vector3(0, -1, 0), rotation);
 * rotated.x = -rotated.x;
 * @param lat 
 * @param long 
 * @returns 
 */
export function latLongToVector3(lat: number, long: number): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (long + 180) * (Math.PI / 180);
  const x = Math.sin(phi) * Math.cos(theta);
  const y = Math.cos(phi);
  const z = Math.sin(phi) * Math.sin(theta);

  const threshold = 1e-10; // Define a small threshold for rounding to zero

  // Round components to zero if they are very close to zero
  const roundToZero = (value: number) => Math.abs(value) < threshold ? 0 : value;

  return new THREE.Vector3(roundToZero(x), roundToZero(y), roundToZero(z));
}


export function calculateDistance(lat1: number, long1: number, lat2: number, long2: number): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLong = (long2 - long1) * (Math.PI / 180);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLong / 2) * Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export function calculateDistanceInKm(lat1: number, long1: number, lat2: number, long2: number): number {
  const distance = calculateDistance(lat1, long1, lat2, long2);
  // Round with out decimal
  return Math.round(distance / 1000);
}

export function scaleValue(value: number, fromMin: number, fromMax: number, toMin: number, toMax: number): number {
  return toMin + (toMax - toMin) * ((value - fromMin) / (fromMax - fromMin));
}
