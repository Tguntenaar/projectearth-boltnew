import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { TravelLocation } from '../../types/travel';
import { surfacePoint } from '../../utils/globeMath';
import { PlaybackMotion } from '../../hooks/useTravelPlayback';
export function AirportPulses({
  from,
  to,
  motion,
  reducedMotion,
  color,
}: {
  from: TravelLocation;
  to: TravelLocation;
  motion: React.MutableRefObject<PlaybackMotion>;
  reducedMotion: boolean;
  color: string;
}) {
  const departure = useRef<THREE.Mesh>(null);
  const arrival = useRef<THREE.Mesh>(null);
  const geometry = useMemo(() => new THREE.RingGeometry(0.75, 1, 40), []);
  const positions = useMemo(
    () => [from, to].map((p) => surfacePoint(...p.coordinates, 1.009)),
    [from, to],
  );
  const orientations = useMemo(
    () =>
      positions.map((p) =>
        new THREE.Quaternion().setFromUnitVectors(
          new THREE.Vector3(0, 0, 1),
          p.clone().normalize(),
        ),
      ),
    [positions],
  );
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame(() => {
    const p = motion.current.progress;
    if (departure.current) {
      const t = p / 0.2;
      departure.current.visible = !reducedMotion && t < 1;
      departure.current.scale.setScalar(0.008 + Math.min(t, 1) * 0.035);
      (departure.current.material as THREE.MeshBasicMaterial).opacity =
        (1 - Math.min(t, 1)) * 0.75;
    }
    if (arrival.current) {
      const t = (p - 0.8) / 0.2;
      arrival.current.visible = !reducedMotion && t > 0;
      arrival.current.scale.setScalar(0.008 + Math.max(t, 0) * 0.035);
      (arrival.current.material as THREE.MeshBasicMaterial).opacity =
        (1 - Math.max(t, 0)) * 0.75;
    }
  });
  return (
    <>
      <mesh
        ref={departure}
        geometry={geometry}
        position={positions[0]}
        quaternion={orientations[0]}
      >
        <meshBasicMaterial
          color={color}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
      <mesh
        ref={arrival}
        geometry={geometry}
        position={positions[1]}
        quaternion={orientations[1]}
      >
        <meshBasicMaterial
          color={color}
          transparent
          depthWrite={false}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
        />
      </mesh>
    </>
  );
}
