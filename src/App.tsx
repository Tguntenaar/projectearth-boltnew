import React, { Suspense, useRef, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars, Text } from "@react-three/drei";
import { Earth } from "./components/Earth";
import { FlightPath } from "./components/FlightPath";
import { TravelingLight } from "./components/TravelingLight";
import { Stats } from "./components/Stats";
import { SceneLighting } from "./components/SceneLighting";
import { useEarthRotation } from "./hooks/useEarthRotation";
import { travelData, travelStats } from "./data/travelData";
import { debugCoordinates } from "./utils/debugCoordinates";
import * as THREE from "three";

// Calculate total path length for scaling
// const totalDistance = travelData.slice(0, -1).reduce((acc, location, index) => {
//   return acc + calculateDistance(location, travelData[index + 1]);
// }, 0);

debugCoordinates(travelData);

export default function App() {
  const rotation = useEarthRotation(0.001);
  const [currentSegment, setCurrentSegment] = React.useState(0);
  const [segmentProgress, setSegmentProgress] = React.useState(0);
  const arrowGroupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (arrowGroupRef.current) {
      const xArrow = new THREE.ArrowHelper(
        new THREE.Vector3(1, 0, 0),
        new THREE.Vector3(0, 0, 0),
        1,
        0x0000ff
      );
      const yArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 1, 0),
        new THREE.Vector3(0, 0, 0),
        1,
        0xff0000
      );
      const zArrow = new THREE.ArrowHelper(
        new THREE.Vector3(0, 0, 1),
        new THREE.Vector3(0, 0, 0),
        1,
        0x00ff00
      );

      arrowGroupRef.current.add(xArrow, yArrow, zArrow);
    }
  }, []);

  React.useEffect(() => {
    let animationFrame: number;
    const speed = 0.011; // Base speed

    const animate = () => {
      setSegmentProgress((prev) => {
        const newProgress = prev + speed;

        if (newProgress >= 1) {
          // Move to next segment
          setCurrentSegment(
            (current) => (current + 1) % (travelData.length - 1)
          );
          return 0;
        }

        return newProgress;
      });

      animationFrame = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  const currentFrom = travelData[currentSegment];
  const currentTo = travelData[currentSegment + 1];

  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 2.5], fov: 45 }}>
        <Suspense fallback={null}>
          <SceneLighting />
          <Stars radius={300} depth={60} count={20000} factor={7} fade />
          <Earth rotation={rotation} />
          <group ref={arrowGroupRef} />`
          <Text position={[1.1, 0, 0]} fontSize={0.1} color="blue">
            X
          </Text>
          <Text position={[0, 1.1, 0]} fontSize={0.1} color="red">
            Y
          </Text>
          <Text position={[0, 0, 1.1]} fontSize={0.1} color="green">
            Z
          </Text>
          {travelData.slice(0, -1).map((location, index) => (
            <React.Fragment key={index}>
              <FlightPath
                from={travelData[currentSegment]}
                to={travelData[currentSegment + 1]}
                progress={segmentProgress}
                rotation={rotation}
              />
            </React.Fragment>
          ))}
          <TravelingLight
            from={currentFrom}
            to={currentTo}
            progress={segmentProgress}
            rotation={rotation}
          />
          <OrbitControls
            enableZoom={true}
            enablePan={true}
            enableRotate={true}
            zoomSpeed={0.6}
            panSpeed={0.5}
            rotateSpeed={0.4}
          />
        </Suspense>
      </Canvas>

      <Stats stats={travelStats} />
    </div>
  );
}
