import * as THREE from 'three';
import { TravelLocation } from '../types/travel';

export const SURFACE_RADIUS = 1.006;
/** Three's sphere UVs put Greenwich on +X and east towards -Z. */
export function surfacePoint(
  lat: number,
  lng: number,
  radius = 1,
): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(lat);
  const theta = THREE.MathUtils.degToRad(lng);
  return new THREE.Vector3(
    Math.cos(phi) * Math.cos(theta),
    Math.sin(phi),
    -Math.cos(phi) * Math.sin(theta),
  ).multiplyScalar(radius);
}
export function flightAltitudeForDistance(meters: number): number {
  return THREE.MathUtils.clamp((meters / 6371000) * 0.13, 0.012, 0.32);
}
export function easeFlight(t: number): number {
  t = THREE.MathUtils.clamp(t, 0, 1);
  return t * t * (3 - 2 * t);
}
/** An analytic great circle with a deterministic plane even for antipodal stops.
 * All runtime samplers write into caller-owned vectors. */
export class FlightCurve extends THREE.Curve<THREE.Vector3> {
  readonly start: THREE.Vector3;
  readonly along: THREE.Vector3;
  readonly angle: number;
  readonly altitude: number;
  constructor(
    from: TravelLocation,
    to: TravelLocation,
    ground = to.travelMode === 'ground',
  ) {
    super();
    this.start = surfacePoint(...from.coordinates);
    const end = surfacePoint(...to.coordinates);
    const dot = THREE.MathUtils.clamp(this.start.dot(end), -1, 1);
    this.along = end.clone().addScaledVector(this.start, -dot);
    this.angle = Math.atan2(this.along.length(), dot);
    if (this.along.lengthSq() < 1e-20) {
      const axis =
        Math.abs(this.start.y) < 0.9
          ? new THREE.Vector3(0, 1, 0)
          : new THREE.Vector3(1, 0, 0);
      this.along.crossVectors(axis, this.start);
    }
    this.along.normalize();
    this.altitude =
      ground || this.angle < 1e-8
        ? 0
        : flightAltitudeForDistance(this.angle * 6371000);
  }
  getPoint(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const a = this.angle * t;
    return target
      .copy(this.start)
      .multiplyScalar(Math.cos(a))
      .addScaledVector(this.along, Math.sin(a))
      .multiplyScalar(SURFACE_RADIUS + this.altitude * Math.sin(Math.PI * t));
  }
  getTangent(t: number, target = new THREE.Vector3()): THREE.Vector3 {
    const a = this.angle * t;
    const r = SURFACE_RADIUS + this.altitude * Math.sin(Math.PI * t);
    const dr = this.altitude * Math.PI * Math.cos(Math.PI * t);
    if (this.angle < 1e-8) return target.copy(this.along);
    return target
      .copy(this.start)
      .multiplyScalar(dr * Math.cos(a) - r * this.angle * Math.sin(a))
      .addScaledVector(
        this.along,
        dr * Math.sin(a) + r * this.angle * Math.cos(a),
      )
      .normalize();
  }
}
export function sampleGreatCircleArc(
  from: TravelLocation,
  to: TravelLocation,
  segments = 128,
) {
  return new FlightCurve(from, to).getPoints(segments);
}
export function getPointOnArc(
  from: TravelLocation,
  to: TravelLocation,
  t: number,
) {
  return new FlightCurve(from, to).getPoint(t);
}
export function getTangentOnArc(
  from: TravelLocation,
  to: TravelLocation,
  t: number,
) {
  return new FlightCurve(from, to).getTangent(t);
}
