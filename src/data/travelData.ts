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

const isFlightLeg = (from: TravelLocation, to: TravelLocation): boolean =>
  to.travelMode !== 'ground';

export const travelData: TravelLocation[] = [
  { id: 1, city: "Hurghada", country: "Egypt", coordinates: [27.2579, 33.8116], date: "2022-03-04" },
  { id: 2, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2022-03-05" },
  { id: 3, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2022-08-20" },
  { id: 4, city: "Pula", country: "Croatia", coordinates: [44.8666, 13.8496], date: "2022-08-20" },
  { id: 5, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2022-08-27" },
  { id: 6, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2022-09-30" },
  { id: 7, city: "Cape Town", country: "South Africa", coordinates: [-33.9249, 18.4241], date: "2022-10-01" },
  { id: 8, city: "Addis Ababa", country: "Ethiopia", coordinates: [9.0054, 38.7636], date: "2023-01-02" },
  { id: 9, city: "Mombasa", country: "Kenya", coordinates: [-4.0435, 39.6682], date: "2023-01-03" },
  { id: 10, city: "Nairobi", country: "Kenya", coordinates: [-1.286389, 36.817223], date: "2023-02-01" },
  { id: 11, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2023-02-02" },
  { id: 12, city: "Milan", country: "Italy", coordinates: [45.4642, 9.1900], date: "2023-02-16" },
  { id: 13, city: "Copenhagen", country: "Denmark", coordinates: [55.6761, 12.5683], date: "2023-04-01" },
  { id: 14, city: "Prague", country: "Czech Republic", coordinates: [50.0755, 14.4378], date: "2023-06-07" },
  { id: 15, city: "Rome", country: "Italy", coordinates: [41.9028, 12.4964], date: "2023-08-26" },
  { id: 16, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2023-09-02" },
  { id: 17, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2023-09-07" },
  { id: 18, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2023-10-01" },
  { id: 19, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2023-10-01" },
  { id: 20, city: "London", country: "United Kingdom", coordinates: [51.5074, -0.1278], date: "2023-10-06" },
  { id: 21, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2023-10-07" },
  { id: 22, city: "Split", country: "Croatia", coordinates: [43.5081, 16.4402], date: "2023-10-08" },
  { id: 23, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2023-10-14" },
  { id: 24, city: "Cape Town", country: "South Africa", coordinates: [-33.9249, 18.4241], date: "2023-10-23" },
  { id: 25, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-01-17" },
  { id: 26, city: "London", country: "United Kingdom", coordinates: [51.5074, -0.1278], date: "2024-01-19" },
  { id: 27, city: "Dallas", country: "USA", coordinates: [32.7767, -96.7970], date: "2024-01-19" },
  { id: 28, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-01-19" },
  { id: 29, city: "London", country: "United Kingdom", coordinates: [51.5074, -0.1278], date: "2024-02-14" },
  { id: 30, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-02-15" },
  { id: 31, city: "Milan", country: "Italy", coordinates: [45.4642, 9.1900], date: "2024-02-16" },
  { id: 32, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-03-17" },
  { id: 33, city: "Seoul", country: "South Korea", coordinates: [37.5665, 126.9780], date: "2024-03-19" },
  { id: 34, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-03-25" },
  { id: 35, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-04-05" },
  { id: 36, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-04-27" },
  { id: 37, city: "Paris", country: "France", coordinates: [48.8566, 2.3522], date: "2024-05-04" },
  { id: 38, city: "Copenhagen", country: "Denmark", coordinates: [55.6761, 12.5683], date: "2024-06-08" },
  { id: 39, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-06-14" },
  { id: 40, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-06-15" },
  { id: 41, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-07-06" },
  { id: 42, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2024-07-07" },
  { id: 43, city: "San Diego", country: "USA", coordinates: [32.7157, -117.1611], date: "2024-07-08" },
  { id: 44, city: "Faro", country: "Portugal", coordinates: [37.0194, -7.9304], date: "2024-07-09" },
  { id: 45, city: "Jerez de la Frontera", country: "Spain", coordinates: [36.6850, -6.1261], date: "2024-07-17", travelMode: "ground" },
  { id: 46, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-07-19" },
  { id: 47, city: "Tokyo", country: "Japan", coordinates: [35.6762, 139.6503], date: "2024-07-27" },
  { id: 48, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2024-08-20" },
  { id: 49, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-09-01" },
  { id: 50, city: "Boston", country: "USA", coordinates: [42.3601, -71.0589], date: "2024-09-05" },
  { id: 51, city: "New York", country: "USA", coordinates: [40.7128, -74.0060], date: "2024-10-10" },
  { id: 52, city: "Boca Chica", country: "USA", coordinates: [25.4503, -97.6063], date: "2024-10-12" },
  { id: 53, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-11-02" },
  { id: 54, city: "Los Angeles", country: "USA", coordinates: [34.0522, -118.2437], date: "2024-11-03" },
  { id: 55, city: "Seoul", country: "South Korea", coordinates: [37.5665, 126.9780], date: "2024-11-04" },
  { id: 56, city: "Bangkok", country: "Thailand", coordinates: [13.7563, 100.5018], date: "2024-11-05" },
  { id: 57, city: "Seoul", country: "South Korea", coordinates: [37.5665, 126.9780], date: "2024-11-12" },
  { id: 58, city: "Seattle", country: "USA", coordinates: [47.6062, -122.3321], date: "2024-11-12" },
  { id: 59, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-11-12" },
  { id: 60, city: "Houston", country: "USA", coordinates: [29.7604, -95.3698], date: "2024-11-13" },
  { id: 61, city: "San José", country: "Costa Rica", coordinates: [9.9281, -84.0907], date: "2024-11-14" },
  { id: 62, city: "Houston", country: "USA", coordinates: [29.7604, -95.3698], date: "2024-11-23" },
  { id: 63, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2024-11-29" },
  { id: 64, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-01-02" },
  { id: 65, city: "Willemstad", country: "Curaçao", coordinates: [12.1091, -68.9316], date: "2025-01-02" },
  { id: 66, city: "Kralendijk", country: "Bonaire", coordinates: [12.1443, -68.2655], date: "2025-01-02" },
  { id: 67, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2025-01-11" },
  { id: 68, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-02-16" },
  { id: 69, city: "Milan", country: "Italy", coordinates: [45.4642, 9.1900], date: "2025-02-16" },
  { id: 70, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-02-23" },
  { id: 71, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-05-17" },
  { id: 72, city: "Split", country: "Croatia", coordinates: [43.5081, 16.4402], date: "2025-05-17" },
  { id: 73, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-05-26" },
  { id: 74, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-06-01" },
  { id: 75, city: "Valencia", country: "Spain", coordinates: [39.4699, -0.3763], date: "2025-06-01" },
  { id: 76, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-06-11" },
  { id: 77, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-06-28" },
  { id: 78, city: "Lisbon", country: "Portugal", coordinates: [38.7223, -9.1393], date: "2025-06-28" },
  { id: 79, city: "Ponta Delgada", country: "Portugal (Azores)", coordinates: [37.7412, -25.6756], date: "2025-06-28" },
  { id: 80, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-07-05" },
  { id: 81, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-07-13" },
  { id: 82, city: "Faro", country: "Portugal", coordinates: [37.0194, -7.9304], date: "2025-07-13" },
  { id: 83, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-07-21" },
  { id: 84, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-09-12" },
  { id: 85, city: "Dallas", country: "USA", coordinates: [32.7767, -96.7970], date: "2025-09-12" },
  { id: 86, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2025-09-12" },
  { id: 87, city: "Dallas", country: "USA", coordinates: [32.7767, -96.7970], date: "2025-09-20" },
  { id: 88, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-09-20" },
  { id: 89, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2026-01-10" },
  { id: 90, city: "Cape Town", country: "South Africa", coordinates: [-33.9249, 18.4241], date: "2026-01-10" },
  { id: 91, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2026-02-07" },
  { id: 92, city: "Chicago", country: "USA", coordinates: [41.8781, -87.6298], date: "2026-08-27" },
  { id: 93, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2026-08-27" },
];

export const calculateTravelStats = (data: TravelLocation[]): TravelStats => {
  let totalFlights = 0;
  let totalDistance = 0;

  for (let i = 1; i < data.length; i++) {
    const from = data[i - 1];
    const to = data[i];
    if (!isFlightLeg(from, to)) {
      continue;
    }
    totalFlights += 1;
    totalDistance += haversineDistance(from.coordinates, to.coordinates);
  }

  const uniqueCountries = new Set(data.map((location) => location.country));
  const totalCountries = uniqueCountries.size;

  const uniqueCities = new Set(data.map((location) => location.city));
  const totalCities = uniqueCities.size;

  return {
    totalFlights,
    totalCountries,
    totalCities,
    totalDistance: Math.round(totalDistance),
  };
};

export const travelStats: TravelStats = calculateTravelStats(travelData);

export const isFlightSegment = (from: TravelLocation, to: TravelLocation): boolean =>
  isFlightLeg(from, to);
