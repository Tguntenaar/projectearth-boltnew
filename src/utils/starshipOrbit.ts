import * as THREE from 'three';

// East is increasing longitude: the globe maps positive longitude toward -Z.
// Keep radius 3 and 0.18 radians/second, independent of refresh rate.
export const STARSHIP_ORBIT_RADIUS = 3;
export const STARSHIP_ORBIT_SPEED = 0.18;

export function sampleStarshipOrbit(
  phase: number,
  position: THREE.Vector3,
  radial: THREE.Vector3,
  tangent: THREE.Vector3,
): void {
  radial.set(Math.cos(phase), 0, -Math.sin(phase));
  tangent.set(-Math.sin(phase), 0, -Math.cos(phase));
  position.copy(radial).multiplyScalar(STARSHIP_ORBIT_RADIUS);
}

/** Start inside the right edge so the flyby is visible on the first rendered frame.
 * Solve once for the actual portrait/landscape framing without changing the orbit. */
export function openingStarshipPhase(camera: THREE.Camera): number {
  const projected = new THREE.Vector3();
  let low = Math.PI / 2;
  let high = Math.PI;
  camera.updateMatrixWorld();
  for (let i = 0; i < 32; i++) {
    const phase = (low + high) / 2;
    projected
      .set(
        Math.cos(phase) * STARSHIP_ORBIT_RADIUS,
        0,
        -Math.sin(phase) * STARSHIP_ORBIT_RADIUS,
      )
      .project(camera);
    if (projected.x > 0.92) low = phase;
    else high = phase;
  }
  return (low + high) / 2;
}
