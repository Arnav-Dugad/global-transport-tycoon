// Cargo & passenger types. `basePrice` is $ per unit per 100 km delivered
// to a city that DEMANDS the cargo (tuned in balance.ts multipliers).

export type CargoCategory = 'pax' | 'freight';

export interface CargoDef {
  id: string;
  name: string;
  emoji: string;
  category: CargoCategory;
  basePrice: number; // $ per unit per 100km
  color: string;
  perishable?: boolean; // value decays with transit time
}

export const CARGO: CargoDef[] = [
  { id: 'passengers', name: 'Passengers', emoji: '🧑', category: 'pax', basePrice: 3.2, color: '#5ff0d4' },
  { id: 'mail', name: 'Mail', emoji: '✉️', category: 'freight', basePrice: 4.0, color: '#c6b3ff' },
  { id: 'food', name: 'Food', emoji: '🍎', category: 'freight', basePrice: 2.6, color: '#7ee081', perishable: true },
  { id: 'goods', name: 'Goods', emoji: '📦', category: 'freight', basePrice: 3.4, color: '#ffcf5c' },
  { id: 'machinery', name: 'Machinery', emoji: '⚙️', category: 'freight', basePrice: 5.2, color: '#9fb3c8' },
  { id: 'oil', name: 'Oil', emoji: '🛢️', category: 'freight', basePrice: 4.6, color: '#4a4a55' },
  { id: 'ore', name: 'Ore', emoji: '⛏️', category: 'freight', basePrice: 2.2, color: '#c98b5a' },
  { id: 'electronics', name: 'Electronics', emoji: '💻', category: 'freight', basePrice: 7.0, color: '#5cc8ff' },
];

export const CARGO_BY_ID: Record<string, CargoDef> = Object.fromEntries(
  CARGO.map((c) => [c.id, c]),
);

export const FREIGHT_TYPES = CARGO.filter((c) => c.category === 'freight').map((c) => c.id);
export const PAX_TYPES = CARGO.filter((c) => c.category === 'pax').map((c) => c.id);

// Resource cargo that only some cities produce (passengers/mail are universal).
export const RESOURCE_TYPES = ['food', 'goods', 'machinery', 'oil', 'ore', 'electronics'];
