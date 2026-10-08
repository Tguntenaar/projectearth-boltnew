import * as THREE from 'three';
import { TravelLocation } from '../types/travel';
import { calculateDistance, latLongToVector3, scaleValue } from './coordinates';

const EARTH_RADIUS = 1;

/** Match the globe mesh spin applied in the scene. */
export function applyEarthSpin(
  point: THREE.Vector3,
  rotation: number,
  target?: THREE.Vector3
): THREE.Vector3 {
  const rotated = target ?? point.clone();
  if (target) {
    rotated.copy(point);
  }
  rotated.applyAxisAngle(new THREE.Vector3(0, -1, 0), rotation);
  rotated.x = -rotated.x;
  return rotated;
}

/** Position in the rotating globe group (X-flip only; parent group applies Y spin). */
export function geographicScenePosition(
  point: THREE.Vector3,
  target?: THREE.Vector3
): THREE.Vector3 {
  return applyEarthSpin(point, 0, target);
}

/** Z component after parent globe group rotation (camera looks down +Z). */
export function worldZAfterGlobeSpin(local: THREE.Vector3, rotation: number): number {
  const sx = -local.x;
  const sz = local.z;
  return -Math.sin(rotation) * sx + Math.cos(rotation) * sz;
}

export function surfacePoint(lat: number, lng: number, radius = EARTH_RADIUS): THREE.Vector3 {
  return latLongToVector3(lat, lng).multiplyScalar(radius);
}

/** Peak altitude above the unit sphere (e.g. 0.08 ≈ 8% radius). */
export function flightAltitudeForDistance(distanceMeters: number): number {
  return scaleValue(distanceMeters, 200_000, 12_000_000, 0.035, 0.14);
}

export function sampleGreatCircleArc(
  from: TravelLocation,
  to: TravelLocation,
  segments = 72
): THREE.Vector3[] {
  const start = latLongToVector3(from.coordinates[0], from.coordinates[1]).normalize();
  const end = latLongToVector3(to.coordinates[0], to.coordinates[1]).normalize();
  const distance = calculateDistance(
    from.coordinates[0],
    from.coordinates[1],
    to.coordinates[0],
    to.coordinates[1]
  );
  const peakAlt = flightAltitudeForDistance(distance);

  const omega = Math.acos(Math.min(1, Math.max(-1, start.dot(end))));
  const sinOmega = Math.sin(omega);

  const points: THREE.Vector3[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    let point: THREE.Vector3;
    if (sinOmega < 1e-5) {
      point = start.clone().lerp(end, t);
    } else {
      const a = Math.sin((1 - t) * omega) / sinOmega;
      const b = Math.sin(t * omega) / sinOmega;
      point = start.clone().multiplyScalar(a).add(end.clone().multiplyScalar(b));
    }
    const lift = peakAlt * Math.sin(Math.PI * t);
    point.normalize().multiplyScalar(EARTH_RADIUS + lift);
    points.push(point);
  }
  return points;
}

export function getPointOnArc(
  from: TravelLocation,
  to: TravelLocation,
  t: number
): THREE.Vector3 {
  const samples = sampleGreatCircleArc(from, to, 72);
  const clamped = Math.min(1, Math.max(0, t));
  const index = clamped * (samples.length - 1);
  const i0 = Math.floor(index);
  const i1 = Math.min(samples.length - 1, i0 + 1);
  const frac = index - i0;
  return samples[i0].clone().lerp(samples[i1], frac);
}

export function getTangentOnArc(
  from: TravelLocation,
  to: TravelLocation,
  t: number
): THREE.Vector3 {
  const epsilon = 0.002;
  const t0 = Math.max(0, t - epsilon);
  const t1 = Math.min(1, t + epsilon);
  const p0 = getPointOnArc(from, to, t0);
  const p1 = getPointOnArc(from, to, t1);
  return p1.sub(p0).normalize();
}

export function spinArcPoints(points: THREE.Vector3[], rotation: number): THREE.Vector3[] {
  return points.map((p) => applyEarthSpin(p, rotation));
}
