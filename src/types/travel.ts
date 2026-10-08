export interface TravelLocation {
  id: number;
  city: string;
  country: string;
  coordinates: [number, number];
  date: string;
  /** When set to `ground`, the leg from the previous location is not drawn as a flight arc. */
  travelMode?: 'flight' | 'ground';
}

export interface TravelStats {
  totalFlights: number;
  totalCountries: number;
  totalCities: number;
  totalDistance: number;
}