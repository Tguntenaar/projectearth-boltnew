import { Suspense, lazy, useMemo, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Earth } from '../Earth';
import { SceneLighting } from '../SceneLighting';
import { useEarthRotation } from '../../hooks/useEarthRotation';
import { travelData, isFlightSegment } from '../../data/travelData';
import { FlightArc } from './FlightArc';
import { TravelingAircraft } from './TravelingAircraft';
import { PlaceMarkers } from './PlaceMarkers';
import { colorForDate } from '../../utils/yearColors';

const Moon = lazy(() => import('../Moon').then((m) => ({ default: m.Moon })));

interface GlobeSceneProps {
  activeSegment: number;
  progress: number;
  isPlaying: boolean;
  onLegSelect: (index: number) => void;
  highlightedPlaceId: number | null;
  pinnedPlaceId: number | null;
  onPlaceHover: (id: number | null) => void;
  onPlaceSelect: (id: number | null) => void;
  yearFilter: number | null;
}

export function GlobeScene({
  activeSegment,
  progress,
  isPlaying,
  onLegSelect,
  highlightedPlaceId,
  pinnedPlaceId,
  onPlaceHover,
  onPlaceSelect,
  yearFilter,
}: GlobeSceneProps) {
  const { rotation } = useEarthRotation(0.00035);
  const [hoveredLeg, setHoveredLeg] = useState<number | null>(null);

  const segments = useMemo(() => {
    const list: { index: number; from: typeof travelData[0]; to: typeof travelData[0] }[] = [];
    for (let i = 0; i < travelData.length - 1; i++) {
      if (!isFlightSegment(travelData[i], travelData[i + 1])) continue;
      list.push({ index: i, from: travelData[i], to: travelData[i + 1] });
    }
    return list;
  }, []);

  const activeFrom = travelData[activeSegment];
  const activeTo = travelData[activeSegment + 1];
  const showAircraft = isFlightSegment(activeFrom, activeTo);

  return (
    <Canvas
      camera={{ position: [0, 0, 2.65], fov: 42 }}
      dpr={[1, 1.75]}
      className="touch-none"
      onCreated={({ gl }) => {
        gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
      }}
    >
      <Suspense fallback={null}>
        <SceneLighting />
        <Stars radius={280} depth={50} count={8000} factor={4} fade speed={0.4} />
        <Earth rotation={rotation} />
        <Suspense fallback={null}>
          <Moon rotation={rotation} position={[8, 0, 0]} />
        </Suspense>

        {segments.map(({ index, from, to }) => {
          const isActive = index === activeSegment;
          const isHovered = hoveredLeg === index;
          const legYear = Number(to.date.slice(0, 4));
          const yearMatch = yearFilter === null || legYear === yearFilter;
          const legProgress = isActive && isPlaying ? progress : isActive ? 1 : 0;
          return (
            <FlightArc
              key={index}
              from={from}
              to={to}
              rotation={rotation}
              progress={legProgress}
              isActive={(isActive || isHovered) && yearMatch}
              dimmed={!yearMatch}
              color={colorForDate(to.date)}
              onPointerOver={() => setHoveredLeg(index)}
              onPointerOut={() => setHoveredLeg(null)}
              onClick={() => onLegSelect(index)}
            />
          );
        })}

        <PlaceMarkers
          places={travelData}
          rotation={rotation}
          highlightedId={highlightedPlaceId}
          pinnedId={pinnedPlaceId}
          onHover={onPlaceHover}
          onSelect={onPlaceSelect}
        />

        {showAircraft && (
          <TravelingAircraft
            from={activeFrom}
            to={activeTo}
            progress={progress}
            rotation={rotation}
            color={colorForDate(activeTo.date)}
          />
        )}

        <OrbitControls
          enableZoom
          enablePan={false}
          enableRotate
          zoomSpeed={0.55}
          rotateSpeed={0.45}
          minDistance={1.8}
          maxDistance={4.5}
        />
      </Suspense>
    </Canvas>
  );
}
