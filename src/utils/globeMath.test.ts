import * as THREE from 'three';
import {
  FlightCurve,
  SURFACE_RADIUS,
  easeFlight,
  flightAltitudeForDistance,
  surfacePoint,
} from './globeMath';
import { TravelLocation } from '../types/travel';
const stop = (
  coordinates: [number, number],
  travelMode?: 'ground',
): TravelLocation => ({
  id: 0,
  city: '',
  country: '',
  date: '2026-01-01',
  coordinates,
  travelMode,
});

describe('great-circle flight geometry', () => {
  test('matches Earth sphere texture UV convention', () => {
    expect(
      surfacePoint(0, 0).distanceTo(new THREE.Vector3(1, 0, 0)),
    ).toBeLessThan(1e-10);
    expect(
      surfacePoint(0, 90).distanceTo(new THREE.Vector3(0, 0, -1)),
    ).toBeLessThan(1e-10);
    expect(surfacePoint(90, 0).y).toBeCloseTo(1);
  });
  test.each([
    [
      [52, 5],
      [40, -74],
    ],
    [
      [70, 170],
      [72, -175],
    ],
    [
      [85, 0],
      [85, 180],
    ],
    [
      [0, 0],
      [0, 180],
    ],
    [
      [0, 0],
      [0, 179.999999],
    ],
    [
      [52, 5],
      [52, 5],
    ],
    [
      [0, 0],
      [0, 0.001],
    ],
  ] as [number[], number[]][])(
    'stable frames and surface clearance: %j → %j',
    (a, b) => {
      const from = stop(a as [number, number]);
      const to = stop(b as [number, number]);
      const curve = new FlightCurve(from, to);
      expect(
        curve
          .getPoint(0)
          .distanceTo(surfacePoint(...from.coordinates, SURFACE_RADIUS)),
      ).toBeLessThan(1e-8);
      expect(
        curve
          .getPoint(1)
          .distanceTo(surfacePoint(...to.coordinates, SURFACE_RADIUS)),
      ).toBeLessThan(1e-8);
      const previous = new THREE.Vector3();
      for (let i = 0; i <= 200; i++) {
        const p = curve.getPoint(i / 200);
        const tangent = curve.getTangent(i / 200);
        const right = new THREE.Vector3().crossVectors(p, tangent).normalize();
        expect(p.length()).toBeGreaterThanOrEqual(SURFACE_RADIUS - 1e-10);
        expect(tangent.length()).toBeCloseTo(1);
        expect(right.length()).toBeCloseTo(1);
        if (i > 0) expect(right.dot(previous)).toBeGreaterThan(0.99);
        previous.copy(right);
        if (i > 0 && i < 200 && curve.angle > 1e-8) {
          const numerical = curve
            .getPoint(i / 200 + 1e-5)
            .sub(curve.getPoint(i / 200 - 1e-5))
            .normalize();
          expect(numerical.dot(tangent)).toBeGreaterThan(0.99999);
        }
      }
    },
  );
  test('ground routes stay on surface and short flights stay lower', () => {
    const curve = new FlightCurve(stop([52, 5]), stop([48, 2], 'ground'));
    for (let i = 0; i <= 20; i++)
      expect(curve.getPoint(i / 20).length()).toBeCloseTo(SURFACE_RADIUS);
    expect(flightAltitudeForDistance(100000)).toBeLessThan(
      flightAltitudeForDistance(9000000),
    );
  });
  test('easing has stationary endpoints and is monotonic', () => {
    expect(easeFlight(0)).toBe(0);
    expect(easeFlight(1)).toBe(1);
    expect(easeFlight(0.0001) / 0.0001).toBeLessThan(0.001);
    expect((1 - easeFlight(0.9999)) / 0.0001).toBeLessThan(0.001);
    for (let i = 1; i <= 100; i++)
      expect(easeFlight(i / 100)).toBeGreaterThan(easeFlight((i - 1) / 100));
  });
});
