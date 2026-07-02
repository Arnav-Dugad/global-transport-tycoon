// Display formatting helpers.

export function formatMoney(n: number): string {
  const sign = n < 0 ? '-' : '';
  const a = Math.abs(n);
  if (a >= 1_000_000_000) return `${sign}$${(a / 1_000_000_000).toFixed(2)}B`;
  if (a >= 1_000_000) return `${sign}$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `${sign}$${(a / 1000).toFixed(1)}K`;
  return `${sign}$${Math.round(a).toLocaleString('en-US')}`;
}

export function formatMoneyFull(n: number): string {
  const sign = n < 0 ? '-' : '';
  return `${sign}$${Math.round(Math.abs(n)).toLocaleString('en-US')}`;
}

export function formatNumber(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 10_000) return `${(n / 1000).toFixed(0)}K`;
  return Math.round(n).toLocaleString('en-US');
}

const MONTHS = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
];

// Game calendar: 30-day months, 12 months/year, starting Year 1.
export interface GameDate {
  year: number;
  month: number; // 1-12
  day: number; // 1-30
  hour: number; // 0-23
  minute: number; // 0-59
}

export function minutesToDate(totalMinutes: number): GameDate {
  const minute = Math.floor(totalMinutes % 60);
  const totalHours = Math.floor(totalMinutes / 60);
  const hour = totalHours % 24;
  const totalDays = Math.floor(totalHours / 24);
  const day = (totalDays % 30) + 1;
  const totalMonths = Math.floor(totalDays / 30);
  const month = (totalMonths % 12) + 1;
  const year = Math.floor(totalMonths / 12) + 1;
  return { year, month, day, hour, minute };
}

export function formatDate(totalMinutes: number): string {
  const d = minutesToDate(totalMinutes);
  return `${MONTHS[d.month - 1]} ${d.day}, Yr ${d.year}`;
}

export function formatClock(totalMinutes: number): string {
  const d = minutesToDate(totalMinutes);
  return `${String(d.hour).padStart(2, '0')}:${String(d.minute).padStart(2, '0')}`;
}

/** 0..1 daylight factor (1 = noon, 0 = midnight) for day/night map tint. */
export function daylight(totalMinutes: number): number {
  const d = minutesToDate(totalMinutes);
  const h = d.hour + d.minute / 60;
  // cosine peaking at noon, min at midnight
  return 0.5 - 0.5 * Math.cos((h / 24) * Math.PI * 2);
}
