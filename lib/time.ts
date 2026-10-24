/**
 * Time-zone helpers. Everything about the store runs on Central Time
 * (America/Chicago), never the server's or the visitor's local clock.
 */
import { STORE_TIME_ZONE } from "@/content/store";

export const MINUTES_PER_DAY = 1440;

export type ZonedParts = {
  /** Calendar date in the zone, "YYYY-MM-DD". */
  dateKey: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  /** 0 = Sunday. */
  weekday: number;
  /** Minutes since local midnight. */
  minutes: number;
};

const formatters = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string): Intl.DateTimeFormat {
  let fmt = formatters.get(timeZone);
  if (!fmt) {
    fmt = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
    formatters.set(timeZone, fmt);
  }
  return fmt;
}

export function zonedParts(date: Date, timeZone: string = STORE_TIME_ZONE): ZonedParts {
  const parts: Record<string, string> = {};
  for (const p of partsFormatter(timeZone).formatToParts(date)) parts[p.type] = p.value;
  const year = Number(parts.year);
  const month = Number(parts.month);
  const day = Number(parts.day);
  const hour = Number(parts.hour) % 24;
  const minute = Number(parts.minute);
  const second = Number(parts.second);
  const dateKey = `${parts.year}-${parts.month}-${parts.day}`;
  return {
    dateKey,
    year,
    month,
    day,
    hour,
    minute,
    second,
    weekday: weekdayOfKey(dateKey),
    minutes: hour * 60 + minute,
  };
}

function parseKey(dateKey: string): [number, number, number] {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(dateKey);
  if (!match) throw new Error(`Invalid date key: ${dateKey}`);
  return [Number(match[1]), Number(match[2]), Number(match[3])];
}

export function isDateKey(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [y, m, d] = parseKey(value);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
}

export function addDaysToKey(dateKey: string, days: number): string {
  const [y, m, d] = parseKey(dateKey);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export function weekdayOfKey(dateKey: string): number {
  const [y, m, d] = parseKey(dateKey);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** Calendar date stored in the database as midnight UTC (SpecialHours.date). */
export function dateKeyToUtcMidnight(dateKey: string): Date {
  const [y, m, d] = parseKey(dateKey);
  return new Date(Date.UTC(y, m - 1, d));
}

export function utcMidnightToDateKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** The real instant when the store's wall clock shows `minutes` past midnight on `dateKey`. */
export function zonedTimeToUtc(
  dateKey: string,
  minutes: number,
  timeZone: string = STORE_TIME_ZONE,
): Date {
  const [y, m, d] = parseKey(dateKey);
  const wallAsUtc = Date.UTC(y, m - 1, d, 0, minutes);
  let guess = wallAsUtc;
  for (let i = 0; i < 3; i++) {
    const p = zonedParts(new Date(guess), timeZone);
    const shownAsUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute, p.second);
    const next = wallAsUtc - (shownAsUtc - guess);
    if (next === guess) break;
    guess = next;
  }
  return new Date(guess);
}

/** "5 AM", "5:30 PM", "noon", "midnight". Accepts minutes past any midnight. */
export function formatClock(minutes: number): string {
  const m = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY;
  if (m === 0) return "midnight";
  if (m === 720) return "noon";
  const hour = Math.floor(m / 60);
  const minute = m % 60;
  const suffix = hour < 12 ? "AM" : "PM";
  const h12 = hour % 12 || 12;
  return minute === 0 ? `${h12} ${suffix}` : `${h12}:${String(minute).padStart(2, "0")} ${suffix}`;
}

export const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
] as const;

export const WEEKDAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"] as const;

/** Monday-first display order (0 = Sunday). */
export const DISPLAY_DAY_ORDER = [1, 2, 3, 4, 5, 6, 0] as const;

/** "Thu, Nov 26" for a date key. */
export function formatDateKey(dateKey: string): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(dateKeyToUtcMidnight(dateKey));
}
