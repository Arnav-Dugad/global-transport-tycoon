// Canvas-drawn top-down vehicle sprites (no image assets → stays free & light).
// Each sprite points "up" (north); the map layer rotates it to the travel bearing.

import maplibregl from 'maplibre-gl';
import type { Mode, CarryClass } from '../data/vehicles';

const SIZE = 48; // device px (rendered at pixelRatio 2 ⇒ ~24px on screen)

export function spriteKey(mode: Mode, carries: CarryClass): string {
  return `veh-${mode}-${carries}`;
}

const MODE_COLOR: Record<Mode, string> = {
  road: '#ffcf5c',
  rail: '#5cc8ff',
  air: '#ff9ebb',
  sea: '#38e8c6',
};

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, Math.min(255, ((n >> 16) & 255) + amt));
  const g = Math.max(0, Math.min(255, ((n >> 8) & 255) + amt));
  const b = Math.max(0, Math.min(255, (n & 255) + amt));
  return `rgb(${r},${g},${b})`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

type Draw = (ctx: CanvasRenderingContext2D, color: string, accent: string) => void;

const DRAW: Record<Mode, Draw> = {
  road: (ctx, color, accent) => {
    // Truck/bus: rounded body with a cab band at the nose (top).
    ctx.fillStyle = color;
    roundRect(ctx, 16, 8, 16, 32, 5);
    ctx.fill();
    ctx.fillStyle = accent;
    roundRect(ctx, 17, 10, 14, 8, 3);
    ctx.fill();
    ctx.fillStyle = 'rgba(10,14,23,0.35)';
    ctx.fillRect(18, 22, 12, 2);
    ctx.fillRect(18, 28, 12, 2);
  },
  rail: (ctx, color, accent) => {
    // Train: long body with a pointed nose (top).
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(24, 5);
    ctx.lineTo(31, 13);
    ctx.lineTo(31, 42);
    ctx.arcTo(31, 44, 29, 44, 2);
    ctx.lineTo(19, 44);
    ctx.arcTo(17, 44, 17, 42, 2);
    ctx.lineTo(17, 13);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = accent;
    roundRect(ctx, 19, 14, 10, 6, 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(10,14,23,0.3)';
    ctx.fillRect(19, 26, 10, 2);
    ctx.fillRect(19, 34, 10, 2);
  },
  air: (ctx, color, accent) => {
    // Plane: fuselage + swept wings + tail.
    ctx.fillStyle = color;
    // fuselage
    roundRect(ctx, 22, 6, 4, 34, 2);
    ctx.fill();
    // nose
    ctx.beginPath();
    ctx.moveTo(24, 4);
    ctx.lineTo(26.5, 9);
    ctx.lineTo(21.5, 9);
    ctx.closePath();
    ctx.fill();
    // wings
    ctx.beginPath();
    ctx.moveTo(24, 18);
    ctx.lineTo(42, 26);
    ctx.lineTo(42, 29);
    ctx.lineTo(24, 24);
    ctx.lineTo(6, 29);
    ctx.lineTo(6, 26);
    ctx.closePath();
    ctx.fill();
    // tail
    ctx.beginPath();
    ctx.moveTo(24, 36);
    ctx.lineTo(31, 41);
    ctx.lineTo(31, 43);
    ctx.lineTo(24, 41);
    ctx.lineTo(17, 43);
    ctx.lineTo(17, 41);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.fillRect(23, 12, 2, 6);
  },
  sea: (ctx, color, accent) => {
    // Ship: pointed bow (top), flat stern, deck house.
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(24, 5);
    ctx.lineTo(31, 18);
    ctx.lineTo(31, 40);
    ctx.lineTo(17, 40);
    ctx.lineTo(17, 18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = accent;
    roundRect(ctx, 20, 22, 8, 12, 2);
    ctx.fill();
    ctx.fillStyle = 'rgba(10,14,23,0.35)';
    ctx.fillRect(21, 25, 6, 2);
    ctx.fillRect(21, 30, 6, 2);
  },
};

function buildSprite(mode: Mode, carries: CarryClass): { width: number; height: number; data: Uint8Array } | null {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  const base = MODE_COLOR[mode];
  const color = carries === 'pax' ? shade(base, 25) : base;
  const accent = carries === 'pax' ? '#0a0e17' : shade(base, -60);

  // soft dark outline for contrast against the map
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.55)';
  ctx.shadowBlur = 3;
  DRAW[mode](ctx, color, accent);
  ctx.restore();

  const img = ctx.getImageData(0, 0, SIZE, SIZE);
  return { width: SIZE, height: SIZE, data: new Uint8Array(img.data.buffer) };
}

/** Register all vehicle sprites with the map (call once, after style load). */
export function registerVehicleSprites(map: maplibregl.Map): void {
  const modes: Mode[] = ['road', 'rail', 'air', 'sea'];
  const classes: CarryClass[] = ['freight', 'pax'];
  for (const mode of modes) {
    for (const carries of classes) {
      const key = spriteKey(mode, carries);
      if (map.hasImage(key)) continue;
      const sprite = buildSprite(mode, carries);
      if (sprite) map.addImage(key, sprite, { pixelRatio: 2 });
    }
  }
}
