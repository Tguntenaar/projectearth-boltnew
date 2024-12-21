import * as THREE from 'three';
import { TravelLocation } from '../types/travel';
import { latLongToVector3 } from './coordinates';

export function calculateDistance(from: TravelLocation, to: TravelLocation): number {
  const start = latLongToVector3(from.coordinates[0], from.coordinates[1]);
  const end = latLongToVector3(to.coordinates[0], to.coordinates[1]);
  return start.distanceTo(end);
}