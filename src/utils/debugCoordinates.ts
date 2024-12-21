import { latLongToVector3 } from './coordinates';
import { TravelLocation } from '../types/travel';

export function debugCoordinates(locations: TravelLocation[]) {
  locations.forEach((location) => {
    const { city, coordinates } = location;
    const vector = latLongToVector3(coordinates[0], coordinates[1]);
    console.log(`City: ${city}, Coordinates: ${coordinates}, Vector: ${vector.toArray()}`);
  });
} 