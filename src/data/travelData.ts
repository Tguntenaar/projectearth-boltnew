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
  { id: 3, city: "Pula", country: "Croatia", coordinates: [44.8666, 13.8496], date: "2022-08-20" },
  { id: 4, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2022-08-27" },
  { id: 5, city: "Cape Town", country: "South Africa", coordinates: [-33.9249, 18.4241], date: "2022-10-01" },
  { id: 6, city: "Addis Ababa", country: "Ethiopia", coordinates: [9.0054, 38.7636], date: "2023-01-02" },
  { id: 7, city: "Mombasa", country: "Kenya", coordinates: [-4.0435, 39.6682], date: "2023-01-03" },
  { id: 8, city: "Nairobi", country: "Kenya", coordinates: [-1.286389, 36.817223], date: "2023-02-01" },
  { id: 9, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2023-02-02" },
  { id: 10, city: "Milan", country: "Italy", coordinates: [45.4642, 9.19], date: "2023-02-16" },
  { id: 11, city: "Copenhagen", country: "Denmark", coordinates: [55.6761, 12.5683], date: "2023-04-01" },
  { id: 12, city: "Prague", country: "Czech Republic", coordinates: [50.0755, 14.4378], date: "2023-06-07" },
  { id: 13, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2023-08-25", travelMode: "ground" },
  { id: 14, city: "Rome", country: "Italy", coordinates: [41.9028, 12.4964], date: "2023-08-26" },
  { id: 15, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2023-09-02" },
  { id: 16, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2023-09-07" },
  { id: 17, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2023-10-01" },
  { id: 18, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2023-10-01" },
  { id: 19, city: "London", country: "United Kingdom", coordinates: [51.5074, -0.1278], date: "2023-10-06" },
  { id: 20, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2023-10-07" },
  { id: 21, city: "Split", country: "Croatia", coordinates: [43.5081, 16.4402], date: "2023-10-08" },
  { id: 22, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2023-10-14" },
  { id: 23, city: "Cape Town", country: "South Africa", coordinates: [-33.9249, 18.4241], date: "2023-10-23" },
  { id: 24, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-01-17" },
  { id: 25, city: "London", country: "United Kingdom", coordinates: [51.5074, -0.1278], date: "2024-01-19" },
  { id: 26, city: "Dallas", country: "USA", coordinates: [32.7767, -96.797], date: "2024-01-19" },
  { id: 27, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-01-19" },
  { id: 28, city: "London", country: "United Kingdom", coordinates: [51.5074, -0.1278], date: "2024-02-14" },
  { id: 29, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-02-15" },
  { id: 30, city: "Milan", country: "Italy", coordinates: [45.4642, 9.19], date: "2024-02-16" },
  { id: 31, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-03-17" },
  { id: 32, city: "Seoul", country: "South Korea", coordinates: [37.5665, 126.978], date: "2024-03-19" },
  { id: 33, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-03-25" },
  { id: 34, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-04-05" },
  { id: 35, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-04-27" },
  { id: 36, city: "Paris", country: "France", coordinates: [48.8566, 2.3522], date: "2024-05-04", travelMode: "ground" },
  { id: 37, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-06-06", travelMode: "ground" },
  { id: 38, city: "Copenhagen", country: "Denmark", coordinates: [55.6761, 12.5683], date: "2024-06-07" },
  { id: 39, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-06-09" },
  { id: 40, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-06-15" },
  { id: 41, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2024-06-22" },
  { id: 42, city: "San Diego", country: "USA", coordinates: [32.7157, -117.1611], date: "2024-06-26", travelMode: "ground" },
  { id: 43, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2024-07-05", travelMode: "ground" },
  { id: 44, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-07-06" },
  { id: 45, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-07-07" },
  { id: 46, city: "Faro", country: "Portugal", coordinates: [37.0194, -7.9304], date: "2024-07-09" },
  { id: 47, city: "Jerez de la Frontera", country: "Spain", coordinates: [36.685, -6.1261], date: "2024-07-17", travelMode: "ground" },
  { id: 48, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-07-19" },
  { id: 49, city: "Tokyo", country: "Japan", coordinates: [35.6762, 139.6503], date: "2024-07-27" },
  { id: 50, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2024-08-20" },
  { id: 51, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-09-01" },
  { id: 52, city: "Boston", country: "USA", coordinates: [42.3601, -71.0589], date: "2024-10-04" },
  { id: 53, city: "Newark", country: "USA", coordinates: [40.7357, -74.1724], date: "2024-10-07" },
  { id: 54, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-10-11" },
  { id: 55, city: "Boca Chica", country: "USA", coordinates: [25.4503, -97.6063], date: "2024-10-12", travelMode: "ground" },
  { id: 56, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-11-02", travelMode: "ground" },
  { id: 57, city: "Los Angeles", country: "USA", coordinates: [34.0522, -118.2437], date: "2024-11-03" },
  { id: 58, city: "Seoul", country: "South Korea", coordinates: [37.5665, 126.978], date: "2024-11-04" },
  { id: 59, city: "Bangkok", country: "Thailand", coordinates: [13.7563, 100.5018], date: "2024-11-05" },
  { id: 60, city: "Seoul", country: "South Korea", coordinates: [37.5665, 126.978], date: "2024-11-12" },
  { id: 61, city: "Seattle", country: "USA", coordinates: [47.6062, -122.3321], date: "2024-11-12" },
  { id: 62, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2024-11-12" },
  { id: 63, city: "Houston", country: "USA", coordinates: [29.7604, -95.3698], date: "2024-11-13" },
  { id: 64, city: "San José", country: "Costa Rica", coordinates: [9.9281, -84.0907], date: "2024-11-14" },
  { id: 65, city: "Houston", country: "USA", coordinates: [29.7604, -95.3698], date: "2024-11-23" },
  { id: 66, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2024-11-23" },
  { id: 67, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2024-12-01" },
  { id: 68, city: "Willemstad", country: "Curaçao", coordinates: [12.1091, -68.9316], date: "2025-01-02" },
  { id: 69, city: "Kralendijk", country: "Bonaire", coordinates: [12.1443, -68.2655], date: "2025-01-02" },
  { id: 70, city: "Atlanta", country: "USA", coordinates: [33.6407, -84.4277], date: "2025-01-11" },
  { id: 71, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2025-01-12" },
  { id: 72, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-02-02" },
  { id: 73, city: "Milan", country: "Italy", coordinates: [45.4642, 9.19], date: "2025-02-16" },
  { id: 74, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-02-23" },
  { id: 75, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2025-03-13" },
  { id: 76, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2025-04-16" },
  { id: 77, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2025-04-22" },
  { id: 78, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-04-29" },
  { id: 79, city: "Split", country: "Croatia", coordinates: [43.5081, 16.4402], date: "2025-05-17" },
  { id: 80, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-05-26" },
  { id: 81, city: "Valencia", country: "Spain", coordinates: [39.4699, -0.3763], date: "2025-06-01" },
  { id: 82, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-06-11" },
  { id: 83, city: "Lisbon", country: "Portugal", coordinates: [38.7223, -9.1393], date: "2025-06-28" },
  { id: 84, city: "Ponta Delgada", country: "Portugal (Azores)", coordinates: [37.7412, -25.6756], date: "2025-06-28" },
  { id: 85, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-07-05" },
  { id: 86, city: "Faro", country: "Portugal", coordinates: [37.0194, -7.9304], date: "2025-07-13" },
  { id: 87, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-07-21" },
  { id: 88, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2025-08-21" },
  { id: 89, city: "Newark", country: "USA", coordinates: [40.7357, -74.1724], date: "2025-09-10" },
  { id: 90, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2025-09-13" },
  { id: 91, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-09-21" },
  { id: 92, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2025-11-01" },
  { id: 93, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2025-11-23" },
  { id: 94, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2025-12-02" },
  { id: 95, city: "San Francisco", country: "USA", coordinates: [37.7749, -122.4194], date: "2025-12-17" },
  { id: 96, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2025-12-28" },
  { id: 97, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2025-12-29" },
  { id: 98, city: "Cape Town", country: "South Africa", coordinates: [-33.9249, 18.4241], date: "2026-01-10" },
  { id: 99, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2026-02-07" },
  { id: 100, city: "Nice", country: "France", coordinates: [43.7102, 7.262], date: "2026-03-13" },
  { id: 101, city: "Paris", country: "France", coordinates: [48.8566, 2.3522], date: "2026-03-22" },
  { id: 102, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2026-03-22" },
  { id: 103, city: "Oslo", country: "Norway", coordinates: [59.9139, 10.7522], date: "2026-03-27" },
  { id: 104, city: "Amsterdam", country: "Netherlands", coordinates: [52.3676, 4.9041], date: "2026-03-29" },
  { id: 105, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2026-06-16" },
  { id: 106, city: "Los Angeles", country: "USA", coordinates: [34.0522, -118.2437], date: "2026-08-15", travelMode: "ground" },
  { id: 107, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2026-08-16" },
  { id: 108, city: "Denver", country: "USA", coordinates: [39.7392, -104.9903], date: "2026-08-21" },
  { id: 109, city: "Billings", country: "USA", coordinates: [45.7833, -108.5007], date: "2026-08-21" },
  { id: 110, city: "Columbus", country: "USA", coordinates: [39.9612, -82.9988], date: "2026-08-26", travelMode: "ground" },
  { id: 111, city: "Chicago", country: "USA", coordinates: [41.8781, -87.6298], date: "2026-08-27" },
  { id: 112, city: "Austin", country: "USA", coordinates: [30.2672, -97.7431], date: "2026-08-28" },
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
    const legKm = haversineDistance(from.coordinates, to.coordinates);
    if (legKm <= 0) {
      continue;
    }
    totalFlights += 1;
    totalDistance += legKm;
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
