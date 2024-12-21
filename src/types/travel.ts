export interface TravelLocation {
  city: string;
  country: string;
  coordinates: [number, number];
  date: string;
}

export interface TravelStats {
  totalFlights: number;
  totalCountries: number;
  totalCities: number;
  totalDistance: number;
}