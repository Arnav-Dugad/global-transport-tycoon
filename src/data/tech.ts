// Research / tech tree. Nodes unlock vehicle models and transport modes.
// Cost is in research points (RP), earned passively + from deliveries.

import type { Mode } from './vehicles';

export interface TechNode {
  id: string;
  name: string;
  description: string;
  cost: number; // research points
  requires: string[]; // prerequisite tech ids
  unlocksMode?: Mode; // enables building routes of this mode
  emoji: string;
}

export const TECH_TREE: TechNode[] = [
  {
    id: 'road2', name: 'Heavy Road Vehicles',
    description: 'Unlock Cargo Trucks and Express Coaches — bigger road capacity.',
    cost: 40, requires: [], emoji: '🚚',
  },
  {
    id: 'rail', name: 'Railways',
    description: 'Unlock the Rail network: freight & passenger trains.',
    cost: 120, requires: ['road2'], unlocksMode: 'rail', emoji: '🛤️',
  },
  {
    id: 'rail2', name: 'High-Speed Rail',
    description: 'Unlock High-Speed Rail and Heavy Freight trains.',
    cost: 320, requires: ['rail'], emoji: '🚅',
  },
  {
    id: 'air', name: 'Aviation',
    description: 'Unlock Airports and aircraft: turboprops & cargo planes.',
    cost: 260, requires: ['road2'], unlocksMode: 'air', emoji: '✈️',
  },
  {
    id: 'air2', name: 'Jet Age',
    description: 'Unlock Jetliners and Heavy Air Freighters — long-haul at scale.',
    cost: 600, requires: ['air'], emoji: '🛫',
  },
  {
    id: 'sea', name: 'Maritime Shipping',
    description: 'Unlock Ports and ships: coastal freighters & ferries.',
    cost: 300, requires: ['road2'], unlocksMode: 'sea', emoji: '🚢',
  },
  {
    id: 'sea2', name: 'Container Logistics',
    description: 'Unlock giant Container Ships — massive freight capacity.',
    cost: 700, requires: ['sea'], emoji: '🛳️',
  },
  {
    id: 'logistics', name: 'Smart Logistics',
    description: '+15% delivery income and slower cargo saturation across all routes.',
    cost: 480, requires: ['rail', 'air'], emoji: '🧠',
  },
  {
    id: 'maintenance', name: 'Advanced Maintenance',
    description: '-25% vehicle maintenance & wear; fewer breakdowns.',
    cost: 420, requires: ['road2'], emoji: '🔧',
  },
];

export const TECH_BY_ID: Record<string, TechNode> = Object.fromEntries(
  TECH_TREE.map((t) => [t.id, t]),
);
