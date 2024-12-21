import { latLongToVector3 } from './coordinates';
import * as THREE from 'three';

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