import React from 'react';
import { TravelStats } from '../types/travel';
import { Plane, Globe2, Map } from 'lucide-react';

interface StatsProps {
  stats: TravelStats;
}

export function Stats({ stats }: StatsProps) {
  return (
    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md rounded-lg p-4 text-white">
      <h2 className="text-xl font-bold mb-4">Travel Statistics</h2>
      <div className="grid grid-cols-2 gap-4">
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
            <p className="text-lg font-bold">{Math.round(stats.totalDistance).toLocaleString()} km</p>
          </div>
        </div>
      </div>
    </div>
  );
}