import { TravelLocation, TravelStats } from '../types/travel';

export const travelData: TravelLocation[] = [
  {
    city: "New York",
    country: "USA",
    coordinates: [40.7128, -74.0060],
    date: "2023-01-15"
  },
  {
    city: "London",
    country: "UK",
    coordinates: [51.5074, -0.1278],
    date: "2023-03-20"
  },
  {
    city: "Dubai",
    country: "UAE",
    coordinates: [25.2048, 55.2708],
    date: "2023-04-15"
  },
  {
    city: "Tokyo",
    country: "Japan",
    coordinates: [35.6762, 139.6503],
    date: "2023-06-10"
  },
  {
    city: "Singapore",
    country: "Singapore",
    coordinates: [1.3521, 103.8198],
    date: "2023-07-25"
  },
  {
    city: "Sydney",
    country: "Australia",
    coordinates: [-33.8688, 151.2093],
    date: "2023-09-05"
  },
  {
    city: "Rio de Janeiro",
    country: "Brazil",
    coordinates: [-22.9068, -43.1729],
    date: "2023-10-20"
  }
];

export const travelStats: TravelStats = {
  totalFlights: 21,
  totalCountries: 12,
  totalCities: 18,
  totalDistance: 65000
};