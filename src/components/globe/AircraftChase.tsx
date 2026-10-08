import { MutableRefObject, RefObject, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FlightCurve, easeFlight } from '../../utils/globeMath';
import { PlaybackMotion } from '../../hooks/useTravelPlayback';

// Chase distance behind the aircraft, height above it, and how far ahead to look.
const BEHIND = 0.5;
const ABOVE = 0.22;
const AHEAD = 0.12;

/** Chase camera behind the active aircraft. Samples the same arc-length point as
 * TravelingAircraft, then maps it through the globe's rotation into world space. */
export function AircraftChase({
  curve,
  motion,
  globe,
}: {
  curve: FlightCurve;
  motion: MutableRefObject<PlaybackMotion>;
  globe: RefObject<THREE.Group>;
}) {
  const scratch = useMemo(
    () => ({
      point: new THREE.Vector3(),
      forward: new THREE.Vector3(),
      up: new THREE.Vector3(),
      desired: new THREE.Vector3(),
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
    const { point, forward, up, desired, target, look, normal } = scratch;
    const t = easeFlight(motion.current.progress);
    curve.getPointAt(t, point);
    curve.getTangentAt(t, forward);
    globe.current.updateMatrixWorld();
    point.applyMatrix4(globe.current.matrixWorld);
    normal.getNormalMatrix(globe.current.matrixWorld);
    forward.applyMatrix3(normal).normalize();
    up.copy(point).normalize();
    desired
      .copy(point)
      .addScaledVector(forward, -BEHIND)
      .addScaledVector(up, ABOVE);
    target.copy(point).addScaledVector(forward, AHEAD);
    // Ease toward the chase position so leg changes glide instead of cutting.
    const blend = snapped.current ? 1 - Math.exp(-Math.min(delta, 0.05) * 4) : 1;
    snapped.current = true;
    camera.position.lerp(desired, blend);
    camera.up.lerp(up, blend).normalize();
    look.lerp(target, blend);
    camera.lookAt(look);
  });
  return null;
}
