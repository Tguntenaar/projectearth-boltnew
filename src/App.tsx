import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars } from '@react-three/drei';
import { Earth } from './components/Earth';
import { FlightPath } from './components/FlightPath';
import { TravelingLight } from './components/TravelingLight';
import { Stats } from './components/Stats';
import { SceneLighting } from './components/SceneLighting';
import { useEarthRotation } from './hooks/useEarthRotation';
import { calculateDistance } from './utils/distance';
import { travelData, travelStats } from './data/travelData';

// Calculate total path length for scaling
const totalDistance = travelData.slice(0, -1).reduce((acc, location, index) => {
  return acc + calculateDistance(location, travelData[index + 1]);
}, 0);

export default function App() {
  const rotation = useEarthRotation(0.001);
  const [currentSegment, setCurrentSegment] = React.useState(0);
  const [segmentProgress, setSegmentProgress] = React.useState(0);

  React.useEffect(() => {
    let animationFrame: number;
    const speed = 0.001; // Base speed
    
    const animate = () => {
      setSegmentProgress(prev => {
        const newProgress = prev + speed;
        
        if (newProgress >= 1) {
          // Move to next segment
          setCurrentSegment(current => (current + 1) % (travelData.length - 1));
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
          
          {travelData.slice(0, -1).map((location, index) => (
            <React.Fragment key={index}>
              <FlightPath
                from={location}
                to={travelData[index + 1]}
                progress={index === currentSegment ? segmentProgress : 0}
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