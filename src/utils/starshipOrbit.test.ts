import * as THREE from 'three';
import {
  sampleStarshipOrbit,
  openingStarshipPhase,
  STARSHIP_ORBIT_RADIUS,
  STARSHIP_ORBIT_SPEED,
} from './starshipOrbit';

describe('Starship orbit', () => {
  test('flies eastward with constant radius and nose along velocity for a full revolution', () => {
    const position = new THREE.Vector3();
    const radial = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    for (let i = 0; i <= 360; i++) {
      const phase = (i * Math.PI) / 180;
      sampleStarshipOrbit(phase, position, radial, tangent);
      const original = new THREE.Vector3(3, 0, 0).applyAxisAngle(
        new THREE.Vector3(0, 1, 0),
        phase,
      );
      expect(position.distanceTo(original)).toBeLessThan(1e-10);
      expect(position.length()).toBeCloseTo(STARSHIP_ORBIT_RADIUS);
      expect(position.y).toBe(0);
      // Geographic east increases longitude in the Earth texture coordinate system.
      const longitude = Math.atan2(-position.z, position.x);
      expect(Math.sin(longitude)).toBeCloseTo(Math.sin(phase));
      expect(Math.cos(longitude)).toBeCloseTo(Math.cos(phase));
      expect(radial.dot(tangent)).toBeCloseTo(0);
      const next = new THREE.Vector3();
      sampleStarshipOrbit(
        phase + 0.0001,
        next,
        new THREE.Vector3(),
        new THREE.Vector3(),
      );
      expect(next.sub(position).normalize().dot(tangent)).toBeGreaterThan(
        0.99999,
      );
    }
    expect(STARSHIP_ORBIT_SPEED / 60).toBeCloseTo(0.003);
  });

  test('co-orbiting camera offsets keep Earth behind Starship for the entire orbit', () => {
    const position = new THREE.Vector3();
    const radial = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const camera = new THREE.PerspectiveCamera(42, 390 / 844, 0.01, 1000);
    const normal = new THREE.Vector3(0, 1, 0);
    const basis = new THREE.Matrix4();
    for (let i = 0; i < 360; i += 5) {
      sampleStarshipOrbit((i * Math.PI) / 180, position, radial, tangent);
      basis.makeBasis(new THREE.Vector3().crossVectors(tangent, radial), tangent, radial);
      expect(
        new THREE.Vector3(0, 1, 0).applyMatrix4(basis).dot(tangent),
      ).toBeCloseTo(1);
      camera.position
        .copy(position)
        .addScaledVector(radial, 3.7)
        .addScaledVector(tangent, 0.75)
        .addScaledVector(normal, 0.3);
      camera.lookAt(position.clone().multiplyScalar(0.3));
      camera.updateMatrixWorld();
      expect(camera.position.length()).toBeGreaterThan(
        camera.position.distanceTo(position),
      );
      const screen = position.clone().project(camera);
      expect(Math.abs(screen.x)).toBeLessThan(0.9);
      expect(Math.abs(screen.y)).toBeLessThan(0.9);
    }
  });
});

describe('opening flyby', () => {
  test.each([
    [1280, 800],
    [390, 844],
    [768, 1024],
  ])('enters the landing view within two seconds at %ix%i', (width, height) => {
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.01, 1000);
    camera.position
      .set(2.6, 1.7, -0.9)
      .multiplyScalar(Math.max(1, (0.95 * height) / width));
    camera.lookAt(0, 0, 0);
    camera.updateMatrixWorld();
    const start = openingStarshipPhase(camera);
    const position = new THREE.Vector3();
    const radial = new THREE.Vector3();
    const tangent = new THREE.Vector3();
    const screenPositions: number[] = [];
    for (const seconds of [0.5, 1, 2]) {
      sampleStarshipOrbit(
        start + seconds * STARSHIP_ORBIT_SPEED,
        position,
        radial,
        tangent,
      );
      const screen = position.clone().project(camera);
      expect(screen.x).toBeGreaterThan(-1);
      expect(screen.x).toBeLessThan(1);
      expect(Math.abs(screen.y)).toBeLessThan(0.8);
      const ray = new THREE.Ray(
        camera.position.clone(),
        position.clone().sub(camera.position).normalize(),
      );
      const hit = ray.intersectSphere(
        new THREE.Sphere(new THREE.Vector3(), 1),
        new THREE.Vector3(),
      );
      expect(
        hit === null ||
          camera.position.distanceTo(hit) >
            camera.position.distanceTo(position),
      ).toBe(true);
      screenPositions.push(screen.x);
    }
    expect(screenPositions[0] - screenPositions[2]).toBeGreaterThan(0.2);
  });
});
