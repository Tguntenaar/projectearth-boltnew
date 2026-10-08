import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TravelLocation } from '../../types/travel';
import { getPointOnArc, getTangentOnArc } from '../../utils/globeMath';

interface TravelingAircraftProps {
  from: TravelLocation;
  to: TravelLocation;
  progress: number;
  color?: string;
}

export function TravelingAircraft({
  from,
  to,
  progress,
  color = '#f8fafc',
}: TravelingAircraftProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame(() => {
    if (!groupRef.current) return;
    const worldPos = getPointOnArc(from, to, progress);
    const worldTan = getTangentOnArc(from, to, progress);
    const up = worldPos.clone().normalize();

    const matrix = new THREE.Matrix4();
    matrix.lookAt(worldPos, worldPos.clone().add(worldTan), up);
    groupRef.current.position.copy(worldPos);
    groupRef.current.quaternion.setFromRotationMatrix(matrix);
  });

  const scale = 0.9 + Math.sin(progress * Math.PI) * 0.15;

  return (
    <group ref={groupRef} scale={scale}>
      <mesh rotation={[0, Math.PI / 2, 0]}>
        <coneGeometry args={[0.012, 0.05, 6]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.6} metalness={0.4} roughness={0.3} />
      </mesh>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <boxGeometry args={[0.055, 0.004, 0.018]} />
        <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.35} />
      </mesh>
      <mesh position={[-0.018, 0, 0.012]} rotation={[0.4, 0, 0.2]}>
        <boxGeometry args={[0.02, 0.003, 0.01]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <mesh position={[-0.018, 0, -0.012]} rotation={[-0.4, 0, -0.2]}>
        <boxGeometry args={[0.02, 0.003, 0.01]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <pointLight color={color} intensity={0.6} distance={0.3} decay={2} />
    </group>
  );
}
