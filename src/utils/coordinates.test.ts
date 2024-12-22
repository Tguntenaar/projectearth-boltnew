import { calculateDistanceInKm, latLongToVector3 } from './coordinates';
import * as THREE from 'three';

import { travelData } from '../data/travelData';

// TODO fix
describe('latLongToVector3', () => {
  it('should convert latitude and longitude to a THREE.Vector3', () => {
    const vector = latLongToVector3(0, 0);
    expect(vector).toEqual(new THREE.Vector3(0, 1, 0)); // x -1 instead of y 1

    const vector2 = latLongToVector3(90, 0);
    expect(vector2).toEqual(new THREE.Vector3(0, 0, 1)); // y instead of z?

    const vector3 = latLongToVector3(-90, 0);
    expect(vector3).toEqual(new THREE.Vector3(0, 0, -1)); // y instead of z
  });
}); 



describe('calculateDistanceInKm', () => {
  it('should calculate the distance between two points on the Earth', () => {
    const amsterdam = travelData[0];
    const capetown = travelData[1];
    const distance = calculateDistanceInKm(amsterdam.coordinates[0], amsterdam.coordinates[1], capetown.coordinates[0], capetown.coordinates[1]);
    expect(distance).toEqual(9685);
  });
});