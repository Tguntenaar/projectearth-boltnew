import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';

export function SceneLighting() {
  const mainLightRef = useRef<THREE.DirectionalLight>(null);
  
  useFrame(() => {
    if (mainLightRef.current) {
      // Ensure light always points at the Earth
      mainLightRef.current.lookAt(0, 0, 0);
    }
  });

  return (
    <>
      {/* Soft ambient light for base illumination */}
      <ambientLight intensity={0.2} />
      
      {/* Main directional light positioned far away */}
      <directionalLight
        ref={mainLightRef}
        position={[50, 30, 50]}
        intensity={2}
        castShadow
      />
      
      {/* Secondary rim light for depth */}
      <directionalLight
        position={[-30, -10, -30]}
        intensity={0.5}
        color="#4444ff"
      />
      
      {/* Subtle fill light from behind */}
      <directionalLight
        position={[0, 0, -40]}
        intensity={0.3}
        color="#ffffff"
      />
    </>
  );
}