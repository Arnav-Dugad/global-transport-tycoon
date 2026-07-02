// Vehicle catalog. Each model belongs to a transport mode and carries either
// passengers or freight. Higher tiers unlock via the tech tree.

export type Mode = 'road' | 'rail' | 'air' | 'sea';
export type CarryClass = 'pax' | 'freight';

export interface VehicleModel {
  id: string;
  name: string;
  mode: Mode;
  carries: CarryClass;
  capacity: number; // units
  speed: number; // km/h
  price: number; // purchase cost
  maintenancePerDay: number;
  fuelPerKm: number;
  reliability: number; // 0..1 base (higher = fewer breakdowns, slower wear)
  emoji: string;
  tech?: string; // required tech id to purchase (undefined = available from start)
}

export const VEHICLE_MODELS: VehicleModel[] = [
  // ---- ROAD (available from start) ----
  { id: 'van', name: 'Delivery Van', mode: 'road', carries: 'freight', capacity: 20, speed: 80, price: 28_000, maintenancePerDay: 40, fuelPerKm: 0.10, reliability: 0.9, emoji: '🚐' },
  { id: 'minibus', name: 'Minibus', mode: 'road', carries: 'pax', capacity: 24, speed: 85, price: 32_000, maintenancePerDay: 45, fuelPerKm: 0.11, reliability: 0.9, emoji: '🚌' },
  { id: 'truck', name: 'Cargo Truck', mode: 'road', carries: 'freight', capacity: 45, speed: 90, price: 68_000, maintenancePerDay: 80, fuelPerKm: 0.18, reliability: 0.88, emoji: '🚚', tech: 'road2' },
  { id: 'coach', name: 'Express Coach', mode: 'road', carries: 'pax', capacity: 55, speed: 100, price: 82_000, maintenancePerDay: 90, fuelPerKm: 0.20, reliability: 0.9, emoji: '🚍', tech: 'road2' },

  // ---- RAIL ----
  { id: 'freighttrain', name: 'Freight Train', mode: 'rail', carries: 'freight', capacity: 220, speed: 120, price: 380_000, maintenancePerDay: 260, fuelPerKm: 0.35, reliability: 0.93, emoji: '🚆', tech: 'rail' },
  { id: 'paxtrain', name: 'Passenger Train', mode: 'rail', carries: 'pax', capacity: 260, speed: 140, price: 420_000, maintenancePerDay: 280, fuelPerKm: 0.34, reliability: 0.93, emoji: '🚄', tech: 'rail' },
  { id: 'hsr', name: 'High-Speed Rail', mode: 'rail', carries: 'pax', capacity: 340, speed: 300, price: 1_150_000, maintenancePerDay: 620, fuelPerKm: 0.55, reliability: 0.95, emoji: '🚅', tech: 'rail2' },
  { id: 'heavyfreight', name: 'Heavy Freight', mode: 'rail', carries: 'freight', capacity: 480, speed: 110, price: 1_050_000, maintenancePerDay: 560, fuelPerKm: 0.62, reliability: 0.94, emoji: '🚂', tech: 'rail2' },

  // ---- AIR ----
  { id: 'turboprop', name: 'Turboprop', mode: 'air', carries: 'pax', capacity: 70, speed: 520, price: 900_000, maintenancePerDay: 620, fuelPerKm: 0.9, reliability: 0.9, emoji: '🛩️', tech: 'air' },
  { id: 'cargoplane', name: 'Cargo Plane', mode: 'air', carries: 'freight', capacity: 120, speed: 780, price: 1_800_000, maintenancePerDay: 1100, fuelPerKm: 1.6, reliability: 0.9, emoji: '✈️', tech: 'air' },
  { id: 'jetliner', name: 'Jetliner', mode: 'air', carries: 'pax', capacity: 260, speed: 900, price: 3_400_000, maintenancePerDay: 1900, fuelPerKm: 2.2, reliability: 0.92, emoji: '🛫', tech: 'air2' },
  { id: 'freighter747', name: 'Heavy Air Freighter', mode: 'air', carries: 'freight', capacity: 320, speed: 860, price: 4_200_000, maintenancePerDay: 2300, fuelPerKm: 2.8, reliability: 0.92, emoji: '🛬', tech: 'air2' },

  // ---- SEA ----
  { id: 'coaster', name: 'Coastal Freighter', mode: 'sea', carries: 'freight', capacity: 600, speed: 55, price: 1_400_000, maintenancePerDay: 700, fuelPerKm: 0.4, reliability: 0.95, emoji: '🚢', tech: 'sea' },
  { id: 'ferry', name: 'Passenger Ferry', mode: 'sea', carries: 'pax', capacity: 500, speed: 60, price: 1_250_000, maintenancePerDay: 650, fuelPerKm: 0.38, reliability: 0.95, emoji: '⛴️', tech: 'sea' },
  { id: 'containership', name: 'Container Ship', mode: 'sea', carries: 'freight', capacity: 1600, speed: 48, price: 4_800_000, maintenancePerDay: 2100, fuelPerKm: 0.7, reliability: 0.96, emoji: '🛳️', tech: 'sea2' },
];

export const MODEL_BY_ID: Record<string, VehicleModel> = Object.fromEntries(
  VEHICLE_MODELS.map((m) => [m.id, m]),
);

export const MODE_META: Record<Mode, { name: string; emoji: string; color: string }> = {
  road: { name: 'Road', emoji: '🛣️', color: '#ffcf5c' },
  rail: { name: 'Rail', emoji: '🛤️', color: '#5cc8ff' },
  air: { name: 'Air', emoji: '✈️', color: '#ff8fb0' },
  sea: { name: 'Sea', emoji: '🌊', color: '#38e8c6' },
};
