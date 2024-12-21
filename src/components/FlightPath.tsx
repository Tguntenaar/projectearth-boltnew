import { useRef, useMemo } from 'react';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { TravelLocation } from '../types/travel';
import { latLongToVector3 } from '../utils/coordinates';

interface FlightPathProps {
  from: TravelLocation;
  to: TravelLocation;
  progress: number;
  rotation: number;
}

export function FlightPath({ from, to, progress, rotation }: FlightPathProps) {
  const curveRef = useRef<THREE.QuadraticBezierCurve3>();
  
  const points = useMemo(() => {
    const start = latLongToVector3(from.coordinates[0], from.coordinates[1]);
    const end = latLongToVector3(to.coordinates[0], to.coordinates[1]);
    
    const midPoint = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(1.5);
    
    curveRef.current = new THREE.QuadraticBezierCurve3(start, midPoint, end);
    return curveRef.current.getPoints(50);
  }, [from, to]);

  const rotatedPoints = points.map(point => {
    const rotated = point.clone();
    rotated.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
    return rotated;
  });

  return (
    <Line
      points={rotatedPoints}
      color="cyan"
      lineWidth={1}
      dashed={true}
      dashScale={50}
      dashSize={0.5}
      dashOffset={-progress * 2}
    />
  );
}