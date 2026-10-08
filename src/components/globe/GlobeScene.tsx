import { Suspense, lazy, useMemo, useRef, useState, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import type { OrbitControls as OrbitControlsImpl } from 'three-stdlib';
import * as THREE from 'three';
import { Earth } from '../Earth';
import { SceneLighting } from '../SceneLighting';
import { travelData, isFlightSegment } from '../../data/travelData';
import { FlightArc } from './FlightArc';
import { TravelingAircraft } from './TravelingAircraft';
import { PlaceMarkers } from './PlaceMarkers';
import { colorForDate } from '../../utils/yearColors';
import { getPointOnArc } from '../../utils/globeMath';
import { CameraFollow } from './CameraFollow';

const Moon = lazy(() => import('../Moon').then((m) => ({ default: m.Moon })));

interface GlobeSceneProps {
  activeSegment: number;
  progress: number;
  isPlaying: boolean;
  onLegSelect: (index: number) => void;
  highlightedPlaceId: number | null;
  pinnedPlaceId: number | null;
  onPlaceHover: (id: number | null, screen?: { x: number; y: number }) => void;
  onPlaceSelect: (id: number | null) => void;
  yearFilter: number | null;
  onUserInteracting: (interacting: boolean) => void;
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
  onUserInteracting,
}: GlobeSceneProps) {
  const controlsRef = useRef<OrbitControlsImpl | null>(null);
  const [hoveredLeg, setHoveredLeg] = useState<number | null>(null);
  const [autoFollow, setAutoFollow] = useState(true);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout>>();

  const scheduleResumeFollow = useCallback(() => {
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
    resumeTimerRef.current = setTimeout(() => {
      setAutoFollow(true);
      onUserInteracting(false);
    }, 2500);
  }, [onUserInteracting]);

  const handleControlStart = useCallback(() => {
    setAutoFollow(false);
    onUserInteracting(true);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  }, [onUserInteracting]);

  const handleControlEnd = useCallback(() => {
    scheduleResumeFollow();
  }, [scheduleResumeFollow]);

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

  const focusPoint = useMemo(() => {
    if (!showAircraft) return new THREE.Vector3(0, 0, 1);
    return getPointOnArc(activeFrom, activeTo, progress).clone();
  }, [activeFrom, activeTo, progress, showAircraft]);

  return (
    <div className="absolute inset-4 sm:inset-5 lg:inset-6 xl:inset-8 min-h-0">
      <Canvas
        camera={{ position: [0, 0, 3.35], fov: 32 }}
        dpr={[1, 1.5]}
        className="h-full w-full touch-none rounded-2xl"
        gl={{ antialias: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        }}
      >
        <Suspense fallback={null}>
          <group scale={0.92}>
          <SceneLighting />
          <Stars radius={240} depth={40} count={5000} factor={3.5} fade speed={0.3} />
          <Earth rotation={0} />
          <Suspense fallback={null}>
            <Moon rotation={0} position={[7, 0.4, 0]} />
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
              color={colorForDate(activeTo.date)}
            />
          )}
          </group>

          <OrbitControls
            ref={controlsRef}
            enableZoom
            enablePan={false}
            enableRotate
            enableDamping
            dampingFactor={0.06}
            rotateSpeed={0.65}
            zoomSpeed={0.5}
            minDistance={2.6}
            maxDistance={4.5}
            onStart={handleControlStart}
            onEnd={handleControlEnd}
          />

          <CameraFollow
            focusPoint={focusPoint}
            enabled={autoFollow}
            controlsRef={controlsRef}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}
