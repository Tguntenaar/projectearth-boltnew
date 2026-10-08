import { memo, useEffect, useMemo } from 'react';
import * as THREE from 'three';
import { Html } from '@react-three/drei';
import { TravelLocation } from '../../types/travel';
import { surfacePoint } from '../../utils/globeMath';

interface PlaceMarkersProps {
  places: TravelLocation[];
  highlightedId: number | null;
  pinnedId: number | null;
  onHover: (id: number | null) => void;
  onSelect: (id: number | null) => void;
}

export const PlaceMarkers = memo(function PlaceMarkers({
  places,
  highlightedId,
  pinnedId,
  onHover,
  onSelect,
}: PlaceMarkersProps) {
  const geometry = useMemo(() => new THREE.SphereGeometry(0.006, 10, 8), []);
  const material = useMemo(
    () =>
      new THREE.MeshBasicMaterial({
        color: '#d2e6ff',
        transparent: true,
        opacity: 0.8,
      }),
    [],
  );
  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );
  const positions = useMemo(
    () => places.map((place) => surfacePoint(...place.coordinates, 1.008)),
    [places],
  );
  return (
    <group>
      {places.map((place, index) => {
        const isHighlighted =
          highlightedId === place.id || pinnedId === place.id;
        const position = positions[index];
        const showLabel = isHighlighted;

        return (
          <group key={place.id} position={position}>
            <mesh
              geometry={geometry}
              material={material}
              scale={isHighlighted ? 1.8 : 1}
              onPointerOver={(e) => {
                e.stopPropagation();
                onHover(place.id);
              }}
              onPointerOut={(e) => {
                e.stopPropagation();
                onHover(null);
              }}
              onClick={(e) => {
                e.stopPropagation();
                onSelect(pinnedId === place.id ? null : place.id);
              }}
            ></mesh>
            {isHighlighted && (
              <mesh>
                <sphereGeometry args={[0.028, 16, 16]} />
                <meshBasicMaterial
                  color="#fef08a"
                  transparent
                  opacity={0.2}
                  depthWrite={false}
                />
              </mesh>
            )}
            {showLabel && (
              <Html
                distanceFactor={4}
                style={{
                  pointerEvents: 'none',
                  transform: 'translate(-50%, -140%)',
                }}
                zIndexRange={[100, 0]}
              >
                <div className="rounded-lg border border-white/20 bg-slate-950/90 px-2.5 py-1.5 text-center shadow-lg backdrop-blur-md">
                  <p className="text-xs font-semibold text-white whitespace-nowrap">
                    {place.city}
                  </p>
                  <p className="text-[10px] text-slate-300 whitespace-nowrap">
                    {place.country}
                  </p>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
});
