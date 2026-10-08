import { MutableRefObject, RefObject, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FlightCurve, easeFlight } from '../../utils/globeMath';
import { PlaybackMotion } from '../../hooks/useTravelPlayback';

// Chase: distance behind the aircraft, height above it, and how far ahead to look.
const BEHIND = 0.5;
const ABOVE = 0.22;
const AHEAD = 0.12;
// Overhead: camera height above the aircraft, looking straight down.
const OVERHEAD = 0.9;

/** Camera that follows the active aircraft, either chasing it from behind or
 * looking straight down on it with north up. Samples the same arc-length point
 * as TravelingAircraft, then maps it through the globe's rotation into world space. */
export function AircraftChase({
  curve,
  motion,
  globe,
  mode,
}: {
  curve: FlightCurve;
  motion: MutableRefObject<PlaybackMotion>;
  globe: RefObject<THREE.Group>;
  mode: 'chase' | 'overhead';
}) {
  const scratch = useMemo(
    () => ({
      point: new THREE.Vector3(),
      forward: new THREE.Vector3(),
      up: new THREE.Vector3(),
      north: new THREE.Vector3(),
      desired: new THREE.Vector3(),
      desiredUp: new THREE.Vector3(),
      target: new THREE.Vector3(),
      look: new THREE.Vector3(),
      normal: new THREE.Matrix3(),
    }),
    [],
  );
  // Mounted fresh each time the view is chosen: snap on the first frame, then ease.
  const snapped = useRef(false);
  useFrame(({ camera }, delta) => {
    if (!globe.current) return;
    const { point, forward, up, north, desired, desiredUp, target, look } =
      scratch;
    const t = easeFlight(motion.current.progress);
    curve.getPointAt(t, point);
    curve.getTangentAt(t, forward);
    globe.current.updateMatrixWorld();
    point.applyMatrix4(globe.current.matrixWorld);
    scratch.normal.getNormalMatrix(globe.current.matrixWorld);
    forward.applyMatrix3(scratch.normal).normalize();
    up.copy(point).normalize();
    if (mode === 'chase') {
      desired
        .copy(point)
        .addScaledVector(forward, -BEHIND)
        .addScaledVector(up, ABOVE);
      desiredUp.copy(up);
      target.copy(point).addScaledVector(forward, AHEAD);
    } else {
      desired.copy(point).addScaledVector(up, OVERHEAD);
      // Screen-up is the globe's north axis (+Y) projected onto the local horizon.
      north.set(0, 1, 0).applyMatrix3(scratch.normal);
      desiredUp.copy(north).addScaledVector(up, -north.dot(up));
      // Directly over a pole north is undefined; fall back to the flight direction.
      if (desiredUp.lengthSq() < 1e-6) desiredUp.copy(forward);
      desiredUp.normalize();
      target.copy(point);
    }
    // Ease toward the follow position so leg changes glide instead of cutting.
    const blend = snapped.current
      ? 1 - Math.exp(-Math.min(delta, 0.05) * 4)
      : 1;
    snapped.current = true;
    camera.position.lerp(desired, blend);
    camera.up.lerp(desiredUp, blend).normalize();
    look.lerp(target, blend);
    camera.lookAt(look);
  });
  return null;
}
