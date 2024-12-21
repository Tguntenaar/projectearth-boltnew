import { useMemo } from 'react';
import * as THREE from 'three';
import { TravelLocation } from '../types/travel';
import { latLongToVector3 } from '../utils/coordinates';

export function useAnimatedPath(from: TravelLocation, to: TravelLocation, progress: number, rotation: number) {
  const curve = useMemo(() => {
    const start = latLongToVector3(from.coordinates[0], from.coordinates[1]);
    const end = latLongToVector3(to.coordinates[0], to.coordinates[1]);
    
    const midPoint = new THREE.Vector3()
      .addVectors(start, end)
      .multiplyScalar(0.5)
      .normalize()
      .multiplyScalar(1.5);
    
    return new THREE.QuadraticBezierCurve3(start, midPoint, end);
  }, [from, to]);

  const position = curve.getPoint(progress);
  position.applyAxisAngle(new THREE.Vector3(0, 1, 0), rotation);
  position.multiplyScalar(1.05); // Slightly above Earth's surface

  return position;
}