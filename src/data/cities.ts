// Curated real-world cities. Coordinates are [lng, lat].
// `pop` is metro population (millions). `coastal` gates sea ports.

export interface CityData {
  id: string;
  name: string;
  country: string;
  lng: number;
  lat: number;
  pop: number; // millions
  coastal: boolean;
}

export const CITIES: CityData[] = [
  // North America
  { id: 'nyc', name: 'New York', country: 'USA', lng: -74.006, lat: 40.7128, pop: 18.8, coastal: true },
  { id: 'lax', name: 'Los Angeles', country: 'USA', lng: -118.2437, lat: 34.0522, pop: 12.4, coastal: true },
  { id: 'chi', name: 'Chicago', country: 'USA', lng: -87.6298, lat: 41.8781, pop: 8.9, coastal: false },
  { id: 'hou', name: 'Houston', country: 'USA', lng: -95.3698, lat: 29.7604, pop: 7.1, coastal: true },
  { id: 'mia', name: 'Miami', country: 'USA', lng: -80.1918, lat: 25.7617, pop: 6.2, coastal: true },
  { id: 'sfo', name: 'San Francisco', country: 'USA', lng: -122.4194, lat: 37.7749, pop: 4.7, coastal: true },
  { id: 'sea', name: 'Seattle', country: 'USA', lng: -122.3321, lat: 47.6062, pop: 4.0, coastal: true },
  { id: 'den', name: 'Denver', country: 'USA', lng: -104.9903, lat: 39.7392, pop: 2.9, coastal: false },
  { id: 'atl', name: 'Atlanta', country: 'USA', lng: -84.388, lat: 33.749, pop: 6.1, coastal: false },
  { id: 'tor', name: 'Toronto', country: 'Canada', lng: -79.3832, lat: 43.6532, pop: 6.2, coastal: true },
  { id: 'van', name: 'Vancouver', country: 'Canada', lng: -123.1207, lat: 49.2827, pop: 2.6, coastal: true },
  { id: 'mex', name: 'Mexico City', country: 'Mexico', lng: -99.1332, lat: 19.4326, pop: 21.8, coastal: false },
  { id: 'gdl', name: 'Guadalajara', country: 'Mexico', lng: -103.3496, lat: 20.6597, pop: 5.3, coastal: false },

  // South America
  { id: 'sao', name: 'São Paulo', country: 'Brazil', lng: -46.6333, lat: -23.5505, pop: 22.4, coastal: false },
  { id: 'rio', name: 'Rio de Janeiro', country: 'Brazil', lng: -43.1729, lat: -22.9068, pop: 13.5, coastal: true },
  { id: 'bue', name: 'Buenos Aires', country: 'Argentina', lng: -58.3816, lat: -34.6037, pop: 15.4, coastal: true },
  { id: 'lim', name: 'Lima', country: 'Peru', lng: -77.0428, lat: -12.0464, pop: 10.9, coastal: true },
  { id: 'bog', name: 'Bogotá', country: 'Colombia', lng: -74.0721, lat: 4.711, pop: 11.3, coastal: false },
  { id: 'scl', name: 'Santiago', country: 'Chile', lng: -70.6693, lat: -33.4489, pop: 6.9, coastal: false },

  // Europe
  { id: 'lon', name: 'London', country: 'UK', lng: -0.1276, lat: 51.5072, pop: 14.8, coastal: true },
  { id: 'par', name: 'Paris', country: 'France', lng: 2.3522, lat: 48.8566, pop: 11.1, coastal: false },
  { id: 'mad', name: 'Madrid', country: 'Spain', lng: -3.7038, lat: 40.4168, pop: 6.7, coastal: false },
  { id: 'bcn', name: 'Barcelona', country: 'Spain', lng: 2.1734, lat: 41.3851, pop: 5.6, coastal: true },
  { id: 'ber', name: 'Berlin', country: 'Germany', lng: 13.405, lat: 52.52, pop: 6.1, coastal: false },
  { id: 'mun', name: 'Munich', country: 'Germany', lng: 11.582, lat: 48.1351, pop: 2.9, coastal: false },
  { id: 'ham', name: 'Hamburg', country: 'Germany', lng: 9.9937, lat: 53.5511, pop: 3.3, coastal: true },
  { id: 'rom', name: 'Rome', country: 'Italy', lng: 12.4964, lat: 41.9028, pop: 4.3, coastal: false },
  { id: 'mil', name: 'Milan', country: 'Italy', lng: 9.19, lat: 45.4642, pop: 5.2, coastal: false },
  { id: 'ams', name: 'Amsterdam', country: 'Netherlands', lng: 4.9041, lat: 52.3676, pop: 2.5, coastal: true },
  { id: 'bru', name: 'Brussels', country: 'Belgium', lng: 4.3517, lat: 50.8503, pop: 2.1, coastal: false },
  { id: 'zur', name: 'Zurich', country: 'Switzerland', lng: 8.5417, lat: 47.3769, pop: 1.4, coastal: false },
  { id: 'vie', name: 'Vienna', country: 'Austria', lng: 16.3738, lat: 48.2082, pop: 2.9, coastal: false },
  { id: 'war', name: 'Warsaw', country: 'Poland', lng: 21.0122, lat: 52.2297, pop: 3.1, coastal: false },
  { id: 'sto', name: 'Stockholm', country: 'Sweden', lng: 18.0686, lat: 59.3293, pop: 2.4, coastal: true },
  { id: 'cph', name: 'Copenhagen', country: 'Denmark', lng: 12.5683, lat: 55.6761, pop: 2.1, coastal: true },
  { id: 'osl', name: 'Oslo', country: 'Norway', lng: 10.7522, lat: 59.9139, pop: 1.6, coastal: true },
  { id: 'lis', name: 'Lisbon', country: 'Portugal', lng: -9.1393, lat: 38.7223, pop: 2.9, coastal: true },
  { id: 'ath', name: 'Athens', country: 'Greece', lng: 23.7275, lat: 37.9838, pop: 3.2, coastal: true },
  { id: 'ist', name: 'Istanbul', country: 'Turkey', lng: 28.9784, lat: 41.0082, pop: 15.8, coastal: true },
  { id: 'mos', name: 'Moscow', country: 'Russia', lng: 37.6173, lat: 55.7558, pop: 17.1, coastal: false },
  { id: 'spb', name: 'St Petersburg', country: 'Russia', lng: 30.3351, lat: 59.9343, pop: 5.5, coastal: true },
  { id: 'kyi', name: 'Kyiv', country: 'Ukraine', lng: 30.5234, lat: 50.4501, pop: 3.0, coastal: false },
  { id: 'dub', name: 'Dublin', country: 'Ireland', lng: -6.2603, lat: 53.3498, pop: 1.9, coastal: true },

  // Africa
  { id: 'cai', name: 'Cairo', country: 'Egypt', lng: 31.2357, lat: 30.0444, pop: 21.3, coastal: false },
  { id: 'lag', name: 'Lagos', country: 'Nigeria', lng: 3.3792, lat: 6.5244, pop: 15.9, coastal: true },
  { id: 'kin', name: 'Kinshasa', country: 'DR Congo', lng: 15.2663, lat: -4.4419, pop: 15.0, coastal: false },
  { id: 'jnb', name: 'Johannesburg', country: 'South Africa', lng: 28.0473, lat: -26.2041, pop: 9.6, coastal: false },
  { id: 'cpt', name: 'Cape Town', country: 'South Africa', lng: 18.4241, lat: -33.9249, pop: 4.8, coastal: true },
  { id: 'nbo', name: 'Nairobi', country: 'Kenya', lng: 36.8219, lat: -1.2921, pop: 5.1, coastal: false },
  { id: 'add', name: 'Addis Ababa', country: 'Ethiopia', lng: 38.7469, lat: 9.03, pop: 5.2, coastal: false },
  { id: 'cas', name: 'Casablanca', country: 'Morocco', lng: -7.5898, lat: 33.5731, pop: 4.4, coastal: true },
  { id: 'acc', name: 'Accra', country: 'Ghana', lng: -0.187, lat: 5.6037, pop: 4.5, coastal: true },
  { id: 'dar', name: 'Dar es Salaam', country: 'Tanzania', lng: 39.2083, lat: -6.7924, pop: 6.7, coastal: true },

  // Middle East
  { id: 'dxb', name: 'Dubai', country: 'UAE', lng: 55.2708, lat: 25.2048, pop: 3.5, coastal: true },
  { id: 'ruh', name: 'Riyadh', country: 'Saudi Arabia', lng: 46.6753, lat: 24.7136, pop: 7.7, coastal: false },
  { id: 'thr', name: 'Tehran', country: 'Iran', lng: 51.389, lat: 35.6892, pop: 9.5, coastal: false },
  { id: 'bgw', name: 'Baghdad', country: 'Iraq', lng: 44.3661, lat: 33.3152, pop: 7.5, coastal: false },
  { id: 'tlv', name: 'Tel Aviv', country: 'Israel', lng: 34.7818, lat: 32.0853, pop: 4.0, coastal: true },

  // South Asia
  { id: 'del', name: 'Delhi', country: 'India', lng: 77.209, lat: 28.6139, pop: 32.9, coastal: false },
  { id: 'mum', name: 'Mumbai', country: 'India', lng: 72.8777, lat: 19.076, pop: 21.3, coastal: true },
  { id: 'blr', name: 'Bangalore', country: 'India', lng: 77.5946, lat: 12.9716, pop: 13.6, coastal: false },
  { id: 'kol', name: 'Kolkata', country: 'India', lng: 88.3639, lat: 22.5726, pop: 15.1, coastal: true },
  { id: 'maa', name: 'Chennai', country: 'India', lng: 80.2707, lat: 13.0827, pop: 11.5, coastal: true },
  { id: 'hyd', name: 'Hyderabad', country: 'India', lng: 78.4867, lat: 17.385, pop: 10.5, coastal: false },
  { id: 'khi', name: 'Karachi', country: 'Pakistan', lng: 67.0011, lat: 24.8607, pop: 16.8, coastal: true },
  { id: 'lhe', name: 'Lahore', country: 'Pakistan', lng: 74.3587, lat: 31.5204, pop: 13.5, coastal: false },
  { id: 'dac', name: 'Dhaka', country: 'Bangladesh', lng: 90.4125, lat: 23.8103, pop: 22.5, coastal: false },
  { id: 'cmb', name: 'Colombo', country: 'Sri Lanka', lng: 79.8612, lat: 6.9271, pop: 5.6, coastal: true },

  // East & Southeast Asia
  { id: 'tyo', name: 'Tokyo', country: 'Japan', lng: 139.6503, lat: 35.6762, pop: 37.4, coastal: true },
  { id: 'osa', name: 'Osaka', country: 'Japan', lng: 135.5023, lat: 34.6937, pop: 19.0, coastal: true },
  { id: 'sel', name: 'Seoul', country: 'South Korea', lng: 126.978, lat: 37.5665, pop: 25.6, coastal: false },
  { id: 'bjs', name: 'Beijing', country: 'China', lng: 116.4074, lat: 39.9042, pop: 21.5, coastal: false },
  { id: 'sha', name: 'Shanghai', country: 'China', lng: 121.4737, lat: 31.2304, pop: 28.5, coastal: true },
  { id: 'can', name: 'Guangzhou', country: 'China', lng: 113.2644, lat: 23.1291, pop: 14.5, coastal: true },
  { id: 'szx', name: 'Shenzhen', country: 'China', lng: 114.0579, lat: 22.5431, pop: 17.6, coastal: true },
  { id: 'ckg', name: 'Chongqing', country: 'China', lng: 106.5516, lat: 29.563, pop: 16.9, coastal: false },
  { id: 'hkg', name: 'Hong Kong', country: 'China', lng: 114.1694, lat: 22.3193, pop: 7.5, coastal: true },
  { id: 'tpe', name: 'Taipei', country: 'Taiwan', lng: 121.5654, lat: 25.033, pop: 7.0, coastal: true },
  { id: 'bkk', name: 'Bangkok', country: 'Thailand', lng: 100.5018, lat: 13.7563, pop: 10.7, coastal: true },
  { id: 'sgn', name: 'Ho Chi Minh City', country: 'Vietnam', lng: 106.6297, lat: 10.8231, pop: 9.3, coastal: true },
  { id: 'han', name: 'Hanoi', country: 'Vietnam', lng: 105.8342, lat: 21.0278, pop: 8.1, coastal: false },
  { id: 'sin', name: 'Singapore', country: 'Singapore', lng: 103.8198, lat: 1.3521, pop: 6.0, coastal: true },
  { id: 'kul', name: 'Kuala Lumpur', country: 'Malaysia', lng: 101.6869, lat: 3.139, pop: 8.4, coastal: false },
  { id: 'jkt', name: 'Jakarta', country: 'Indonesia', lng: 106.8456, lat: -6.2088, pop: 33.4, coastal: true },
  { id: 'mnl', name: 'Manila', country: 'Philippines', lng: 120.9842, lat: 14.5995, pop: 24.3, coastal: true },

  // Oceania
  { id: 'syd', name: 'Sydney', country: 'Australia', lng: 151.2093, lat: -33.8688, pop: 5.3, coastal: true },
  { id: 'mel', name: 'Melbourne', country: 'Australia', lng: 144.9631, lat: -37.8136, pop: 5.1, coastal: true },
  { id: 'bne', name: 'Brisbane', country: 'Australia', lng: 153.0251, lat: -27.4698, pop: 2.6, coastal: true },
  { id: 'per', name: 'Perth', country: 'Australia', lng: 115.8605, lat: -31.9505, pop: 2.1, coastal: true },
  { id: 'akl', name: 'Auckland', country: 'New Zealand', lng: 174.7633, lat: -36.8485, pop: 1.7, coastal: true },
];

export const CITY_BY_ID: Record<string, CityData> = Object.fromEntries(
  CITIES.map((c) => [c.id, c]),
);
