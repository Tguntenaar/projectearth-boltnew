import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

/** A camera-relative studio rig keeps geography readable while orbiting. */
export function SceneLighting() {
  const rig = useRef<THREE.Group>(null);
  useFrame(({ camera }) => {
    if (rig.current) rig.current.quaternion.copy(camera.quaternion);
  });
  return (
    <>
      <ambientLight intensity={0.7} color="#c5d8ef" />
      <hemisphereLight intensity={0.8} color="#d8eaff" groundColor="#60738d" />
      <group ref={rig}>
        <directionalLight
          position={[-3, 4, 5]}
          intensity={2.8}
          color="#fff4e3"
        />
        <directionalLight
          position={[4, 0, 2]}
          intensity={1.1}
          color="#a9cfff"
        />
        <directionalLight
          position={[0, 2, -4]}
          intensity={1.5}
          color="#72adff"
        />
      </group>
    </>
  );
}
