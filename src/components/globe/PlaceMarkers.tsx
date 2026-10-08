import { TravelLocation } from '../../types/travel';
import { surfacePoint } from '../../utils/globeMath';

interface PlaceMarkersProps {
  places: TravelLocation[];
  highlightedId: number | null;
  pinnedId: number | null;
  onHover: (id: number | null, screen?: { x: number; y: number }) => void;
  onSelect: (id: number | null) => void;
}

export function PlaceMarkers({
  places,
  highlightedId,
  pinnedId,
  onHover,
  onSelect,
}: PlaceMarkersProps) {
  return (
    <group>
      {places.map((place) => {
        const isHighlighted = highlightedId === place.id || pinnedId === place.id;
        const position = surfacePoint(place.coordinates[0], place.coordinates[1], 1.004);

        return (
          <mesh
            key={place.id}
            position={position}
            onPointerOver={(e) => {
              e.stopPropagation();
              onHover(place.id, { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
            }}
            onPointerMove={(e) => {
              if (highlightedId === place.id) {
                onHover(place.id, { x: e.nativeEvent.clientX, y: e.nativeEvent.clientY });
              }
            }}
            onPointerOut={(e) => {
              e.stopPropagation();
              if (pinnedId !== place.id) onHover(null);
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(pinnedId === place.id ? null : place.id);
            }}
          >
            <sphereGeometry args={[isHighlighted ? 0.018 : 0.01, 10, 10]} />
            <meshBasicMaterial
              color={isHighlighted ? '#fef08a' : '#f97316'}
              transparent
              opacity={isHighlighted ? 1 : 0.72}
            />
          </mesh>
        );
      })}
    </group>
  );
}
