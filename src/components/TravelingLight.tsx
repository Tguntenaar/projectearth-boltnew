import { useRef } from "react";
import * as THREE from "three";
import { TravelLocation } from "../types/travel";
import { useAnimatedPath } from "../hooks/useAnimatedPath";

interface TravelingLightProps {
  from: TravelLocation;
  to: TravelLocation;
  progress: number;
  rotation: number;
}

export function TravelingLight({
  from,
  to,
  progress,
  rotation,
}: TravelingLightProps) {
  const lightRef = useRef<THREE.PointLight>(null);
  const position = useAnimatedPath(from, to, progress, rotation);

  const rotatedPosition = ((point) => {
    const rotated = point.clone();
    // No idea why I need to multiply by 2, but it works
    rotated.applyAxisAngle(new THREE.Vector3(0, -1, 0), 2 * rotation);
    rotated.x = -rotated.x;

    return rotated;
  })(position);

  /**
   * <pointLight
      ref={lightRef}
      position={rotatedPosition}
      color="cyan"
      intensity={2}
      distance={0.5}
      decay={2}
    />
   */

  return (
    <mesh position={rotatedPosition}>
      <sphereGeometry args={[0.01, 8, 8]} />
      <meshBasicMaterial color="blue" />
    </mesh>
  );
}
