import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import * as THREE from 'three';
import { Earth } from '../Earth';
import { SceneLighting } from '../SceneLighting';
import { travelData, isFlightSegment } from '../../data/travelData';
import { FlightArc } from './FlightArc';
import { TravelingAircraft } from './TravelingAircraft';
import { PlaceMarkers } from './PlaceMarkers';
import { AirportPulses } from './AirportPulses';
import { colorForDate } from '../../utils/yearColors';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import { CameraRig, CameraView } from './CameraRig';
import { CameraFollow } from './CameraFollow';
import { AircraftChase } from './AircraftChase';
import { FlightCurve } from '../../utils/globeMath';
import { PlaybackMotion } from '../../hooks/useTravelPlayback';
interface GlobeSceneProps {
  cameraView: CameraView;
  activeSegment: number;
  motion: React.MutableRefObject<PlaybackMotion>;
  isPlaying: boolean;
  onLegSelect: (index: number) => void;
  highlightedPlaceId: number | null;
  pinnedPlaceId: number | null;
  onPlaceHover: (id: number | null) => void;
  onPlaceSelect: (id: number | null) => void;
  yearFilter: number | null;
  routeView: 'current' | 'year' | 'all';
}
function GlobeContents({
  cameraView,
  activeSegment,
  motion,
  isPlaying,
  onLegSelect,
  highlightedPlaceId,
  pinnedPlaceId,
  onPlaceHover,
  onPlaceSelect,
  yearFilter,
  routeView,
  reducedMotion,
}: GlobeSceneProps & { reducedMotion: boolean }) {
  const globe = useRef<THREE.Group>(null);
  const { camera, size } = useThree();
  useEffect(() => {
    // Fit the globe horizontally on portrait screens, retaining orbit and zoom.
    camera.position
      .set(2.6, 1.7, -0.9)
      .multiplyScalar(Math.max(1, (0.95 * size.height) / size.width));
    camera.lookAt(0, 0, 0);
  }, [camera, size.width, size.height]);
  const interacting = useRef(false);
  const segments = useMemo(
    () =>
      travelData
        .slice(0, -1)
        .map((from, index) => ({ from, to: travelData[index + 1], index }))
        .filter(
          ({ from, to }) =>
            isFlightSegment(from, to) || to.travelMode === 'ground',
        ),
    [],
  );
  const activeFrom = travelData[activeSegment];
  const activeTo = travelData[activeSegment + 1];
  const followCurve = useMemo(
    () => new FlightCurve(activeFrom, activeTo),
    [activeFrom, activeTo],
  );
  const showAircraft = isFlightSegment(activeFrom, activeTo);
  const yearMatch =
    routeView !== 'year' || Number(activeTo.date.slice(0, 4)) === yearFilter;
  useFrame((_, delta) => {
    if (
      globe.current &&
      isPlaying &&
      !reducedMotion &&
      !interacting.current &&
      cameraView !== 'earth' &&
      cameraView !== 'aircraft'
    )
      globe.current.rotation.y += Math.min(delta, 0.05) * 0.021;
  });
  return (
    <>
      <CameraRig
        view={cameraView}
        reducedMotion={reducedMotion}
        isPlaying={isPlaying}
      />
      {cameraView === 'aircraft' && (
        <AircraftChase curve={followCurve} motion={motion} globe={globe} />
      )}
      <CameraFollow
        curve={followCurve}
        motion={motion}
        globe={globe}
        interacting={interacting}
        enabled={
          cameraView === 'earth' &&
          routeView === 'current' &&
          isPlaying &&
          !reducedMotion
        }
      />
      <SceneLighting />
      <Stars radius={280} depth={50} count={3000} factor={3} fade speed={0} />
      <group name="earth-system" ref={globe}>
        <Earth />
        {segments.map(({ index, from, to }) => (
          <FlightArc
            key={index}
            from={from}
            to={to}
            isActive={index === activeSegment}
            completed={index < activeSegment}
            visible={
              routeView === 'current'
                ? index === activeSegment
                : routeView === 'all' ||
                  Number(to.date.slice(0, 4)) === yearFilter
            }
            overview={routeView !== 'current'}
            reducedMotion={reducedMotion}
            isPlaying={isPlaying}
            onClick={() => onLegSelect(index)}
          />
        ))}
        <PlaceMarkers
          places={travelData}
          highlightedId={highlightedPlaceId}
          pinnedId={pinnedPlaceId}
          onHover={onPlaceHover}
          onSelect={onPlaceSelect}
        />
        {showAircraft && yearMatch && (
          <>
            <TravelingAircraft
              from={activeFrom}
              to={activeTo}
              motion={motion}
              reducedMotion={reducedMotion}
              color={colorForDate(activeTo.date)}
            />
            <AirportPulses
              from={activeFrom}
              to={activeTo}
              motion={motion}
              reducedMotion={reducedMotion}
              color={colorForDate(activeTo.date)}
            />
          </>
        )}
      </group>
      {cameraView === 'earth' && (
        <OrbitControls
          enableZoom
          enablePan={false}
          enableRotate
          enableDamping={!reducedMotion}
          zoomSpeed={0.55}
          rotateSpeed={0.45}
          minDistance={1.8}
          maxDistance={Math.max(4.5, (4.5 * size.height) / size.width)}
          onStart={() => {
            interacting.current = true;
          }}
          onEnd={() => {
            interacting.current = false;
          }}
        />
      )}
    </>
  );
}
export function GlobeScene(props: GlobeSceneProps) {
  // Playback autoplays regardless of the OS setting, so reduced motion only
  // applies while paused: the whole scene animates whenever it is playing.
  const reducedMotion = useReducedMotion() && !props.isPlaying;
  return (
    <Canvas
      camera={{ position: [2.6, 1.7, -0.9], fov: 42, near: 0.01 }}
      dpr={[1, 1.5]}
      className="touch-none"
    >
      <Suspense fallback={null}>
        <GlobeContents {...props} reducedMotion={reducedMotion} />
      </Suspense>
    </Canvas>
  );
}
