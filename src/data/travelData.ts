import { TravelLocation, TravelStats } from '../types/travel';

// Helper function to calculate distance between two coordinates (Haversine formula)
const haversineDistance = (coords1: [number, number], coords2: [number, number]): number => {
  const toRadians = (deg: number): number => (deg * Math.PI) / 180;
  const [lat1, lon1] = coords1;
  const [lat2, lon2] = coords2;

  const R = 6371; // Earth's radius in km
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
};

export const travelData: TravelLocation[] = [
  { id: 1, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2022-09-30" },
  { id: 2, city: "Cape Town", country: "South Africa", coordinates: [-33.9249, 18.4241], date: "2022-10-01" },
  { id: 3, city: "Nairobi", country: "Kenya", coordinates: [-1.286389, 36.817223], date: "2023-01-01" },
  { id: 4, city: "Milan", country: "Italy", coordinates: [45.4642, 9.1900], date: "2023-02-16" },
  { id: 5, city: "Copenhagen", country: "Denmark", coordinates: [55.6761, 12.5683], date: "2023-04-01" },
  { id: 6, city: "Prague", country: "Czech Republic", coordinates: [50.0755, 14.4378], date: "2023-06-07" },
  { id: 7, city: "Rome", country: "Italy", coordinates: [41.9028, 12.4964], date: "2023-08-26" },
  { id: 8, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2023-09-07" },
  { id: 9, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2023-10-01" },
  { id: 10, city: "Split", country: "Croatia", coordinates: [43.5081, 16.4402], date: "2023-10-08" },
  { id: 11, city: "Cape Town", country: "South Africa", coordinates: [-33.9249, 18.4241], date: "2023-11-03" },
  { id: 12, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-01-01" },
  { id: 13, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-01-19" },
  { id: 14, city: "Milan", country: "Italy", coordinates: [45.4642, 9.1900], date: "2024-02-16" },
  { id: 15, city: "Seoul", country: "South Korea", coordinates: [37.5665, 126.9780], date: "2024-03-19" },
  { id: 16, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-04-05" },
  { id: 17, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-04-27" },
  { id: 18, city: "Paris", country: "France", coordinates: [48.8566, 2.3522], date: "2024-05-04" },
  { id: 19, city: "Copenhagen", country: "Denmark", coordinates: [55.6761, 12.5683], date: "2024-06-08" },
  { id: 20, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2024-06-22" },
  { id: 21, city: "San Diego", country: "USA", coordinates: [32.7157, -117.1611], date: "2024-06-27" },
  { id: 22, city: "Faro", country: "Portugal", coordinates: [37.0194, -7.9304], date: "2024-07-09" },
  { id: 23, city: "Jerez de la Frontera", country: "Spain", coordinates: [36.6850, -6.1261], date: "2024-07-17" },
  { id: 24, city: "Tokyo", country: "Japan", coordinates: [35.6762, 139.6503], date: "2024-07-27" },
  { id: 25, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2024-08-20" },
  { id: 26, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-09-01" },
  { id: 27, city: "Boston", country: "USA", coordinates: [42.3601, -71.0589], date: "2024-09-05" },
  { id: 28, city: "New York", country: "USA", coordinates: [40.7128, -74.0060], date: "2024-10-10" },
  { id: 29, city: "Boca Chica", country: "USA", coordinates: [25.4503, -97.6063], date: "2024-10-12" },
  { id: 30, city: "Bangkok", country: "Thailand", coordinates: [13.7563, 100.5018], date: "2024-11-05" },
  { id: 31, city: "San Jose", country: "USA", coordinates: [37.3382, -121.8863], date: "2024-11-14" },
  { id: 32, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2024-11-29" },
  { id: 33, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-11-08" },
];

export const calculateTravelStats = (data: TravelLocation[]): TravelStats => {
  const totalFlights = data.length - 1;

  const uniqueCountries = new Set(data.map((location) => location.country));
  const totalCountries = uniqueCountries.size;

  const uniqueCities = new Set(data.map((location) => location.city));
  const totalCities = uniqueCities.size;

  let totalDistance = 0;
  for (let i = 1; i < data.length; i++) {
    totalDistance += haversineDistance(
      data[i - 1].coordinates,
      data[i].coordinates
    );
  }

  return {
    totalFlights,
    totalCountries,
    totalCities,
    totalDistance: Math.round(totalDistance),
  };
};

export const travelStats: TravelStats = calculateTravelStats(travelData);
