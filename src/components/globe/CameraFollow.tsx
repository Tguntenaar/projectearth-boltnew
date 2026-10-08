import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { worldZAfterGlobeSpin } from '../../utils/globeMath';

interface CameraFollowProps {
  /** Point on the unit sphere in pre-spin geographic space. */
  focusLocal: THREE.Vector3;
  enabled: boolean;
  globeRotation: number;
  onGlobeRotation: (rotation: number) => void;
}

/** Y rotation on the globe group that faces `local` toward the camera at +Z. */
function targetRotationForPoint(local: THREE.Vector3, hint: number): number {
  let best = hint;
  let bestScore = -Infinity;
  const searchRadius = Math.PI * 0.55;
  const steps = 48;
  for (let i = 0; i <= steps; i++) {
    const candidate = hint - searchRadius + (2 * searchRadius * i) / steps;
    const score = worldZAfterGlobeSpin(local, candidate);
    if (score > bestScore) {
      bestScore = score;
      best = candidate;
    }
  }
  return best;
}

export function CameraFollow({
  focusLocal,
  enabled,
  globeRotation,
  onGlobeRotation,
}: CameraFollowProps) {
  const rotationRef = useRef(globeRotation);
  rotationRef.current = globeRotation;

  useFrame((_, delta) => {
    if (!enabled) return;
    const current = rotationRef.current;
    const target = targetRotationForPoint(focusLocal, current);
    let deltaAngle = target - current;
    while (deltaAngle > Math.PI) deltaAngle -= Math.PI * 2;
    while (deltaAngle < -Math.PI) deltaAngle += Math.PI * 2;
    const lerp = 1 - Math.pow(0.001, delta);
    const next = current + deltaAngle * lerp * 0.1;
    rotationRef.current = next;
    onGlobeRotation(next);
  });

  return null;
}
