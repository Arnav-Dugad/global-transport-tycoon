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

  // ---- More North America ----
  { id: 'bos', name: 'Boston', country: 'USA', lng: -71.0589, lat: 42.3601, pop: 4.9, coastal: true },
  { id: 'phi', name: 'Philadelphia', country: 'USA', lng: -75.1652, lat: 39.9526, pop: 6.2, coastal: false },
  { id: 'dca', name: 'Washington', country: 'USA', lng: -77.0369, lat: 38.9072, pop: 6.4, coastal: false },
  { id: 'dal', name: 'Dallas', country: 'USA', lng: -96.797, lat: 32.7767, pop: 7.6, coastal: false },
  { id: 'phx', name: 'Phoenix', country: 'USA', lng: -112.074, lat: 33.4484, pop: 4.9, coastal: false },
  { id: 'lsv', name: 'Las Vegas', country: 'USA', lng: -115.1398, lat: 36.1699, pop: 2.3, coastal: false },
  { id: 'msp', name: 'Minneapolis', country: 'USA', lng: -93.265, lat: 44.9778, pop: 3.7, coastal: false },
  { id: 'det', name: 'Detroit', country: 'USA', lng: -83.0458, lat: 42.3314, pop: 4.3, coastal: false },
  { id: 'orl', name: 'Orlando', country: 'USA', lng: -81.3792, lat: 28.5383, pop: 2.7, coastal: false },
  { id: 'mtl', name: 'Montreal', country: 'Canada', lng: -73.5673, lat: 45.5017, pop: 4.3, coastal: true },
  { id: 'cgy', name: 'Calgary', country: 'Canada', lng: -114.0719, lat: 51.0447, pop: 1.6, coastal: false },
  { id: 'ott', name: 'Ottawa', country: 'Canada', lng: -75.6972, lat: 45.4215, pop: 1.4, coastal: false },
  { id: 'mty', name: 'Monterrey', country: 'Mexico', lng: -100.3161, lat: 25.6866, pop: 5.3, coastal: false },
  { id: 'tij', name: 'Tijuana', country: 'Mexico', lng: -117.0382, lat: 32.5149, pop: 2.2, coastal: true },
  { id: 'pty', name: 'Panama City', country: 'Panama', lng: -79.5199, lat: 8.9824, pop: 1.9, coastal: true },
  { id: 'hav', name: 'Havana', country: 'Cuba', lng: -82.3666, lat: 23.1136, pop: 2.1, coastal: true },
  { id: 'gua', name: 'Guatemala City', country: 'Guatemala', lng: -90.5069, lat: 14.6349, pop: 3.0, coastal: false },
  { id: 'sjo', name: 'San José', country: 'Costa Rica', lng: -84.0907, lat: 9.9281, pop: 2.2, coastal: false },
  { id: 'sdo', name: 'Santo Domingo', country: 'Dominican Rep.', lng: -69.9312, lat: 18.4861, pop: 3.5, coastal: true },

  // ---- More South America ----
  { id: 'bsb', name: 'Brasília', country: 'Brazil', lng: -47.8823, lat: -15.7942, pop: 4.8, coastal: false },
  { id: 'ftz', name: 'Fortaleza', country: 'Brazil', lng: -38.5267, lat: -3.7319, pop: 4.1, coastal: true },
  { id: 'poa', name: 'Porto Alegre', country: 'Brazil', lng: -51.2177, lat: -30.0346, pop: 4.3, coastal: false },
  { id: 'cwb', name: 'Curitiba', country: 'Brazil', lng: -49.2733, lat: -25.4284, pop: 3.7, coastal: false },
  { id: 'ssa', name: 'Salvador', country: 'Brazil', lng: -38.5014, lat: -12.9714, pop: 3.9, coastal: true },
  { id: 'mvd', name: 'Montevideo', country: 'Uruguay', lng: -56.1645, lat: -34.9011, pop: 1.9, coastal: true },
  { id: 'asu', name: 'Asunción', country: 'Paraguay', lng: -57.5759, lat: -25.2637, pop: 3.2, coastal: false },
  { id: 'lpb', name: 'La Paz', country: 'Bolivia', lng: -68.1193, lat: -16.4897, pop: 2.3, coastal: false },
  { id: 'uio', name: 'Quito', country: 'Ecuador', lng: -78.4678, lat: -0.1807, pop: 2.8, coastal: false },
  { id: 'gye', name: 'Guayaquil', country: 'Ecuador', lng: -79.8891, lat: -2.1709, pop: 3.1, coastal: true },
  { id: 'ccs', name: 'Caracas', country: 'Venezuela', lng: -66.9036, lat: 10.4806, pop: 2.9, coastal: false },
  { id: 'mde', name: 'Medellín', country: 'Colombia', lng: -75.5636, lat: 6.2518, pop: 4.0, coastal: false },
  { id: 'clo', name: 'Cali', country: 'Colombia', lng: -76.5225, lat: 3.4516, pop: 2.8, coastal: false },

  // ---- More Europe ----
  { id: 'man', name: 'Manchester', country: 'UK', lng: -2.2426, lat: 53.4808, pop: 2.8, coastal: false },
  { id: 'gla', name: 'Glasgow', country: 'UK', lng: -4.2518, lat: 55.8642, pop: 1.7, coastal: true },
  { id: 'lyo', name: 'Lyon', country: 'France', lng: 4.8357, lat: 45.764, pop: 2.3, coastal: false },
  { id: 'mrs', name: 'Marseille', country: 'France', lng: 5.3698, lat: 43.2965, pop: 1.9, coastal: true },
  { id: 'fra', name: 'Frankfurt', country: 'Germany', lng: 8.6821, lat: 50.1109, pop: 2.9, coastal: false },
  { id: 'cgn', name: 'Cologne', country: 'Germany', lng: 6.9603, lat: 50.9375, pop: 3.6, coastal: false },
  { id: 'stu', name: 'Stuttgart', country: 'Germany', lng: 9.1829, lat: 48.7758, pop: 2.8, coastal: false },
  { id: 'nap', name: 'Naples', country: 'Italy', lng: 14.2681, lat: 40.8518, pop: 3.1, coastal: true },
  { id: 'trn', name: 'Turin', country: 'Italy', lng: 7.6869, lat: 45.0703, pop: 2.2, coastal: false },
  { id: 'vlc', name: 'Valencia', country: 'Spain', lng: -0.3763, lat: 39.4699, pop: 2.5, coastal: true },
  { id: 'svq', name: 'Seville', country: 'Spain', lng: -5.9845, lat: 37.3891, pop: 1.9, coastal: false },
  { id: 'opo', name: 'Porto', country: 'Portugal', lng: -8.6109, lat: 41.1496, pop: 1.7, coastal: true },
  { id: 'rtm', name: 'Rotterdam', country: 'Netherlands', lng: 4.4777, lat: 51.9244, pop: 2.7, coastal: true },
  { id: 'hel', name: 'Helsinki', country: 'Finland', lng: 24.9384, lat: 60.1699, pop: 1.5, coastal: true },
  { id: 'rix', name: 'Riga', country: 'Latvia', lng: 24.1052, lat: 56.9496, pop: 1.0, coastal: true },
  { id: 'prg', name: 'Prague', country: 'Czechia', lng: 14.4378, lat: 50.0755, pop: 2.7, coastal: false },
  { id: 'bud', name: 'Budapest', country: 'Hungary', lng: 19.0402, lat: 47.4979, pop: 3.0, coastal: false },
  { id: 'buh', name: 'Bucharest', country: 'Romania', lng: 26.1025, lat: 44.4268, pop: 2.2, coastal: false },
  { id: 'sof', name: 'Sofia', country: 'Bulgaria', lng: 23.3219, lat: 42.6977, pop: 1.4, coastal: false },
  { id: 'beg', name: 'Belgrade', country: 'Serbia', lng: 20.4489, lat: 44.7866, pop: 1.7, coastal: false },
  { id: 'krk', name: 'Kraków', country: 'Poland', lng: 19.945, lat: 50.0647, pop: 1.8, coastal: false },
  { id: 'gdn', name: 'Gdańsk', country: 'Poland', lng: 18.6466, lat: 54.352, pop: 1.5, coastal: true },
  { id: 'lwo', name: 'Lviv', country: 'Ukraine', lng: 24.0297, lat: 49.8397, pop: 1.0, coastal: false },
  { id: 'msq', name: 'Minsk', country: 'Belarus', lng: 27.5615, lat: 53.9045, pop: 2.0, coastal: false },

  // ---- More Middle East & Africa ----
  { id: 'doh', name: 'Doha', country: 'Qatar', lng: 51.531, lat: 25.2854, pop: 2.4, coastal: true },
  { id: 'auh', name: 'Abu Dhabi', country: 'UAE', lng: 54.3773, lat: 24.4539, pop: 1.5, coastal: true },
  { id: 'kwi', name: 'Kuwait City', country: 'Kuwait', lng: 47.9774, lat: 29.3759, pop: 3.1, coastal: true },
  { id: 'amm', name: 'Amman', country: 'Jordan', lng: 35.9106, lat: 31.9539, pop: 4.0, coastal: false },
  { id: 'bey', name: 'Beirut', country: 'Lebanon', lng: 35.5018, lat: 33.8938, pop: 2.4, coastal: true },
  { id: 'jed', name: 'Jeddah', country: 'Saudi Arabia', lng: 39.1925, lat: 21.4858, pop: 4.7, coastal: true },
  { id: 'ank', name: 'Ankara', country: 'Turkey', lng: 32.8597, lat: 39.9334, pop: 5.7, coastal: false },
  { id: 'izm', name: 'İzmir', country: 'Turkey', lng: 27.1428, lat: 38.4237, pop: 3.0, coastal: true },
  { id: 'alx', name: 'Alexandria', country: 'Egypt', lng: 29.9187, lat: 31.2001, pop: 5.4, coastal: true },
  { id: 'tun', name: 'Tunis', country: 'Tunisia', lng: 10.1815, lat: 36.8065, pop: 2.7, coastal: true },
  { id: 'alg', name: 'Algiers', country: 'Algeria', lng: 3.0588, lat: 36.7538, pop: 3.4, coastal: true },
  { id: 'abj', name: 'Abidjan', country: 'Ivory Coast', lng: -4.0083, lat: 5.36, pop: 5.6, coastal: true },
  { id: 'dkr', name: 'Dakar', country: 'Senegal', lng: -17.4677, lat: 14.7167, pop: 3.4, coastal: true },
  { id: 'lad', name: 'Luanda', country: 'Angola', lng: 13.2343, lat: -8.8383, pop: 8.3, coastal: true },
  { id: 'abv', name: 'Abuja', country: 'Nigeria', lng: 7.3986, lat: 9.0765, pop: 3.6, coastal: false },
  { id: 'dbn', name: 'Durban', country: 'South Africa', lng: 31.0218, lat: -29.8587, pop: 3.7, coastal: true },
  { id: 'kla', name: 'Kampala', country: 'Uganda', lng: 32.5825, lat: 0.3476, pop: 3.5, coastal: false },

  // ---- More South Asia ----
  { id: 'amd', name: 'Ahmedabad', country: 'India', lng: 72.5714, lat: 23.0225, pop: 8.4, coastal: false },
  { id: 'pnq', name: 'Pune', country: 'India', lng: 73.8567, lat: 18.5204, pop: 7.4, coastal: false },
  { id: 'jai', name: 'Jaipur', country: 'India', lng: 75.7873, lat: 26.9124, pop: 4.1, coastal: false },
  { id: 'lko', name: 'Lucknow', country: 'India', lng: 80.9462, lat: 26.8467, pop: 3.7, coastal: false },
  { id: 'isb', name: 'Islamabad', country: 'Pakistan', lng: 73.0479, lat: 33.6844, pop: 3.5, coastal: false },
  { id: 'ctg', name: 'Chittagong', country: 'Bangladesh', lng: 91.7832, lat: 22.3569, pop: 5.2, coastal: true },
  { id: 'ktm', name: 'Kathmandu', country: 'Nepal', lng: 85.324, lat: 27.7172, pop: 1.5, coastal: false },
  { id: 'kbl', name: 'Kabul', country: 'Afghanistan', lng: 69.2075, lat: 34.5553, pop: 4.6, coastal: false },

  // ---- More East & Southeast Asia ----
  { id: 'ngo', name: 'Nagoya', country: 'Japan', lng: 136.9066, lat: 35.1815, pop: 9.5, coastal: true },
  { id: 'fuk', name: 'Fukuoka', country: 'Japan', lng: 130.4017, lat: 33.5904, pop: 5.5, coastal: true },
  { id: 'spk', name: 'Sapporo', country: 'Japan', lng: 141.3545, lat: 43.0618, pop: 2.6, coastal: false },
  { id: 'pus', name: 'Busan', country: 'South Korea', lng: 129.0756, lat: 35.1796, pop: 3.6, coastal: true },
  { id: 'ctu', name: 'Chengdu', country: 'China', lng: 104.0665, lat: 30.5728, pop: 16.3, coastal: false },
  { id: 'wuh', name: 'Wuhan', country: 'China', lng: 114.3055, lat: 30.5928, pop: 11.0, coastal: false },
  { id: 'sia', name: "Xi'an", country: 'China', lng: 108.9402, lat: 34.3416, pop: 12.9, coastal: false },
  { id: 'hgh', name: 'Hangzhou', country: 'China', lng: 120.1551, lat: 30.2741, pop: 11.9, coastal: true },
  { id: 'nkg', name: 'Nanjing', country: 'China', lng: 118.7969, lat: 32.0603, pop: 9.3, coastal: false },
  { id: 'tsn', name: 'Tianjin', country: 'China', lng: 117.1901, lat: 39.1256, pop: 13.9, coastal: true },
  { id: 'tao', name: 'Qingdao', country: 'China', lng: 120.3826, lat: 36.0671, pop: 9.0, coastal: true },
  { id: 'kmg', name: 'Kunming', country: 'China', lng: 102.8329, lat: 24.8801, pop: 7.2, coastal: false },
  { id: 'sub', name: 'Surabaya', country: 'Indonesia', lng: 112.7521, lat: -7.2575, pop: 9.5, coastal: true },
  { id: 'bdo', name: 'Bandung', country: 'Indonesia', lng: 107.6098, lat: -6.9175, pop: 8.5, coastal: false },
  { id: 'mdn', name: 'Medan', country: 'Indonesia', lng: 98.6722, lat: 3.5952, pop: 4.7, coastal: true },
  { id: 'dps', name: 'Denpasar', country: 'Indonesia', lng: 115.2126, lat: -8.6705, pop: 1.2, coastal: true },
  { id: 'ceb', name: 'Cebu', country: 'Philippines', lng: 123.8854, lat: 10.3157, pop: 3.0, coastal: true },
  { id: 'dvo', name: 'Davao', country: 'Philippines', lng: 125.6128, lat: 7.1907, pop: 2.5, coastal: true },
  { id: 'pnh', name: 'Phnom Penh', country: 'Cambodia', lng: 104.9282, lat: 11.5564, pop: 2.3, coastal: false },
  { id: 'rgn', name: 'Yangon', country: 'Myanmar', lng: 96.1951, lat: 16.8409, pop: 5.4, coastal: true },

  // ---- Central Asia & Caucasus ----
  { id: 'ala', name: 'Almaty', country: 'Kazakhstan', lng: 76.8512, lat: 43.222, pop: 2.0, coastal: false },
  { id: 'tas', name: 'Tashkent', country: 'Uzbekistan', lng: 69.2401, lat: 41.2995, pop: 2.9, coastal: false },
  { id: 'gyd', name: 'Baku', country: 'Azerbaijan', lng: 49.8671, lat: 40.4093, pop: 2.4, coastal: true },
  { id: 'tbs', name: 'Tbilisi', country: 'Georgia', lng: 44.8271, lat: 41.7151, pop: 1.2, coastal: false },

  // ---- More Oceania ----
  { id: 'adl', name: 'Adelaide', country: 'Australia', lng: 138.6007, lat: -34.9285, pop: 1.4, coastal: true },
  { id: 'cbr', name: 'Canberra', country: 'Australia', lng: 149.13, lat: -35.2809, pop: 0.5, coastal: false },
  { id: 'wlg', name: 'Wellington', country: 'New Zealand', lng: 174.7762, lat: -41.2865, pop: 0.4, coastal: true },
  { id: 'suv', name: 'Suva', country: 'Fiji', lng: 178.4419, lat: -18.1416, pop: 0.2, coastal: true },
];

export const CITY_BY_ID: Record<string, CityData> = Object.fromEntries(
  CITIES.map((c) => [c.id, c]),
);
