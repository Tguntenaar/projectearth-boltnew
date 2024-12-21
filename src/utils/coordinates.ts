import * as THREE from 'three';

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
