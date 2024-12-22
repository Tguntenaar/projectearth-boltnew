import React from "react";
import { TravelStats } from "../types/travel";
import {
  Plane,
  Globe2,
  Map,
  CalendarDays,
  MapPinned,
  MapPin,
  Loader2,
} from "lucide-react";
import { travelData } from "../data/travelData";
import { calculateDistanceInKm } from "../utils/coordinates";

interface StatsProps {
  stats: TravelStats;
  currentSegment: number;
}

export function Stats({ stats, currentSegment }: StatsProps) {
  const traveledSoFar = travelData
    .slice(0, currentSegment + 1)
    .reduce((acc, location, i) => {
      return (
        acc +
        calculateDistanceInKm(
          travelData[i].coordinates[0],
          travelData[i].coordinates[1],
          travelData[i + 1].coordinates[0],
          travelData[i + 1].coordinates[1]
        )
      );
    }, 0);

  return (
    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-lg p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Travel Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <MapPinned className="w-5 h-5" />
          <div>
            <p className="text-sm">From</p>
            <p className="text-lg font-bold">
              {travelData[currentSegment].city}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5" />
          <div>
            <p className="text-sm">To</p>
            <p className="text-lg font-bold">
              {travelData[currentSegment + 1].city}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Loader2 className="w-5 h-5 animate-spin-slow" />
          <div>
            <p className="text-sm">Traveled</p>
            <p className="text-lg font-bold">{Math.round(traveledSoFar)} km</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          <div>
            <p className="text-sm">Date</p>
            <p className="text-lg font-bold">
              {travelData[currentSegment + 1].date}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Plane className="w-5 h-5" />
          <div>
            <p className="text-sm">Flights</p>
            <p className="text-lg font-bold">{stats.totalFlights}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Globe2 className="w-5 h-5" />
          <div>
            <p className="text-sm">Countries</p>
            <p className="text-lg font-bold">{stats.totalCountries}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Map className="w-5 h-5" />
          <div>
            <p className="text-sm">Cities</p>
            <p className="text-lg font-bold">{stats.totalCities}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-5 h-5 flex items-center justify-center">✈️</span>
          <div>
            <p className="text-sm">Distance</p>
            <p className="text-lg font-bold">
              {Math.round(stats.totalDistance).toLocaleString()} km
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
