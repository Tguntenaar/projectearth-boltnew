import { calculateDistanceInKm, latLongToVector3 } from './coordinates';
import * as THREE from 'three';

import { travelData } from '../data/travelData';

// Legacy helper uses a mirrored X axis; globeMath owns texture-aligned coordinates.
describe('latLongToVector3', () => {
  it('should convert latitude and longitude to a THREE.Vector3', () => {
    const vector = latLongToVector3(0, 0);
    expect(vector).toEqual(new THREE.Vector3(-1, 0, 0));

    const vector2 = latLongToVector3(90, 0);
    expect(vector2).toEqual(new THREE.Vector3(0, 1, 0));

    const vector3 = latLongToVector3(-90, 0);
    expect(vector3).toEqual(new THREE.Vector3(0, -1, 0));
  });
});

describe('calculateDistanceInKm', () => {
  it('should calculate the distance between two points on the Earth', () => {
    const amsterdam = travelData.find(
      (l) => l.city === 'Amsterdam',
    )!;
    const capetown = travelData.find(
      (l) => l.city === 'Cape Town',
    )!;
    const distance = calculateDistanceInKm(
      amsterdam.coordinates[0],
      amsterdam.coordinates[1],
      capetown.coordinates[0],
      capetown.coordinates[1],
    );
    expect(distance).toEqual(9685);
  });
});
