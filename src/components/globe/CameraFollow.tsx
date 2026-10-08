import { MutableRefObject, RefObject, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { FlightCurve, easeFlight } from '../../utils/globeMath';
import { PlaybackMotion } from '../../hooks/useTravelPlayback';

/** Keep the active journey facing the Earth camera; give manual orbit priority. */
export function CameraFollow({
  curve,
  motion,
  globe,
  interacting,
  enabled,
}: {
  curve: FlightCurve;
  motion: MutableRefObject<PlaybackMotion>;
  globe: RefObject<THREE.Group>;
  interacting: MutableRefObject<boolean>;
  enabled: boolean;
}) {
  const point = useMemo(() => new THREE.Vector3(), []);
  const resumeAt = useRef(0);
  useFrame(({ camera, clock }, delta) => {
    if (interacting.current) resumeAt.current = clock.elapsedTime + 2.5;
    if (!enabled || !globe.current || clock.elapsedTime < resumeAt.current)
      return;
    curve.getPoint(easeFlight(motion.current.progress), point);
    const desired =
      Math.atan2(point.z, point.x) -
      Math.atan2(camera.position.z, camera.position.x);
    const difference = Math.atan2(
      Math.sin(desired - globe.current.rotation.y),
      Math.cos(desired - globe.current.rotation.y),
    );
    globe.current.rotation.y +=
      difference * (1 - Math.exp(-Math.min(delta, 0.05) * 0.8));
  });
  return null;
}
