import { Html } from '@react-three/drei';
import { TravelLocation } from '../../types/travel';
import { applyEarthSpin, surfacePoint } from '../../utils/globeMath';

interface PlaceMarkersProps {
  places: TravelLocation[];
  rotation: number;
  highlightedId: number | null;
  pinnedId: number | null;
  onHover: (id: number | null) => void;
  onSelect: (id: number | null) => void;
}

export function PlaceMarkers({
  places,
  rotation,
  highlightedId,
  pinnedId,
  onHover,
  onSelect,
}: PlaceMarkersProps) {
  return (
    <group>
      {places.map((place) => {
        const isHighlighted = highlightedId === place.id || pinnedId === place.id;
        const position = applyEarthSpin(
          surfacePoint(place.coordinates[0], place.coordinates[1], 1.004),
          rotation
        );
        const showLabel = isHighlighted;

        return (
          <group key={place.id} position={position}>
            <mesh
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
            >
              <sphereGeometry args={[isHighlighted ? 0.018 : 0.01, 12, 12]} />
              <meshBasicMaterial
                color={isHighlighted ? '#fef08a' : '#f97316'}
                transparent
                opacity={isHighlighted ? 1 : 0.75}
              />
            </mesh>
            {isHighlighted && (
              <mesh>
                <sphereGeometry args={[0.028, 16, 16]} />
                <meshBasicMaterial color="#fef08a" transparent opacity={0.2} depthWrite={false} />
              </mesh>
            )}
            {showLabel && (
              <Html
                distanceFactor={4}
                style={{ pointerEvents: 'none', transform: 'translate(-50%, -140%)' }}
                zIndexRange={[100, 0]}
              >
                <div className="rounded-lg border border-white/20 bg-slate-950/90 px-2.5 py-1.5 text-center shadow-lg backdrop-blur-md">
                  <p className="text-xs font-semibold text-white whitespace-nowrap">{place.city}</p>
                  <p className="text-[10px] text-slate-300 whitespace-nowrap">{place.country}</p>
                </div>
              </Html>
            )}
          </group>
        );
      })}
    </group>
  );
}
