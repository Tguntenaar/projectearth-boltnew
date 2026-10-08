import { useEffect, useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';

interface CameraFollowProps {
  focusPoint: THREE.Vector3 | null;
  enabled: boolean;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

const _desired = new THREE.Vector3();
const _look = new THREE.Vector3();

export function CameraFollow({ focusPoint, enabled, controlsRef }: CameraFollowProps) {
  const { camera } = useThree();
  const distanceRef = useRef(3.35);

  useEffect(() => {
    distanceRef.current = camera.position.length();
  }, [camera]);

  useFrame((_, delta) => {
    const controls = controlsRef.current;
    if (!controls || !focusPoint || !enabled) return;

    const distance = distanceRef.current;
    _desired.copy(focusPoint).normalize().multiplyScalar(distance);
    const lerp = 1 - Math.pow(0.001, delta);
    camera.position.lerp(_desired, lerp * 0.12);
    _look.set(0, 0, 0);
    camera.lookAt(_look);
    controls.target.copy(_look);
    controls.update();
  });

  return null;
}
