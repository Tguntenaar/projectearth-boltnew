import * as THREE from 'three';

// Preserve the original scene's equatorial orbit: radius 3, -0.003 Y rotation
// per 60 Hz frame. Time-based motion gives the same trajectory at any refresh rate.
export const STARSHIP_ORBIT_RADIUS = 3;
export const STARSHIP_ORBIT_SPEED = 0.18;

export function sampleStarshipOrbit(
  phase: number,
  position: THREE.Vector3,
  radial: THREE.Vector3,
  tangent: THREE.Vector3,
): void {
  radial.set(Math.cos(phase), 0, Math.sin(phase));
  tangent.set(-Math.sin(phase), 0, Math.cos(phase));
  position.copy(radial).multiplyScalar(STARSHIP_ORBIT_RADIUS);
}
