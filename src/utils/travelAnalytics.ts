import { TravelLocation } from '../types/travel';
import { isFlightSegment } from '../data/travelData';
import { calculateDistanceInKm } from './coordinates';

export interface FlightLeg {
  index: number;
  from: TravelLocation;
  to: TravelLocation;
  date: string;
  year: number;
  distanceKm: number;
  isGround: boolean;
}

export interface ExtendedTravelStats {
  totalFlights: number;
  totalCountries: number;
  totalCities: number;
  totalDistance: number;
  flightsPerYear: Record<number, number>;
  longestLeg: FlightLeg | null;
}

function legDistanceKm(from: TravelLocation, to: TravelLocation): number {
  return calculateDistanceInKm(
    from.coordinates[0],
    from.coordinates[1],
    to.coordinates[0],
    to.coordinates[1]
  );
}

export function buildFlightLegs(data: TravelLocation[]): FlightLeg[] {
  const legs: FlightLeg[] = [];
  for (let i = 0; i < data.length - 1; i++) {
    const from = data[i];
    const to = data[i + 1];
    const isGround = !isFlightSegment(from, to);
    if (isGround) continue;
    const distanceKm = legDistanceKm(from, to);
    if (distanceKm <= 0) continue;
    legs.push({
      index: i,
      from,
      to,
      date: to.date,
      year: Number(to.date.slice(0, 4)),
      distanceKm,
      isGround: false,
    });
  }
  return legs;
}

export function computeExtendedStats(data: TravelLocation[]): ExtendedTravelStats {
  const legs = buildFlightLegs(data);
  const flightsPerYear: Record<number, number> = {};
  let totalDistance = 0;
  let longestLeg: FlightLeg | null = null;

  for (const leg of legs) {
    flightsPerYear[leg.year] = (flightsPerYear[leg.year] ?? 0) + 1;
    totalDistance += leg.distanceKm;
    if (!longestLeg || leg.distanceKm > longestLeg.distanceKm) {
      longestLeg = leg;
    }
  }

  const uniqueCountries = new Set(data.map((l) => l.country));
  const uniqueCities = new Set(data.map((l) => l.city));

  return {
    totalFlights: legs.length,
    totalCountries: uniqueCountries.size,
    totalCities: uniqueCities.size,
    totalDistance: Math.round(totalDistance),
    flightsPerYear,
    longestLeg,
  };
}
