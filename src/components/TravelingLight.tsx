import { useRef } from 'react';
import * as THREE from 'three';
import { TravelLocation } from '../types/travel';
import { useAnimatedPath } from '../hooks/useAnimatedPath';

interface TravelingLightProps {
  from: TravelLocation;
  to: TravelLocation;
  progress: number;
  rotation: number;
}

export function TravelingLight({ from, to, progress, rotation }: TravelingLightProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const position = useAnimatedPath(from, to, progress, rotation);

  return (
    <pointLight
      ref={lightRef}
      position={position}
      color="cyan"
      intensity={2}
      distance={0.5}
      decay={2}
    />
  );
}