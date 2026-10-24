import { store, type FuelGradeId } from "@/content/store";
import { zonedParts } from "./time";

/** A price older than this is never shown. */
export const FUEL_STALE_AFTER_MS = 48 * 60 * 60 * 1000;

export type FuelPriceRow = {
  grade: FuelGradeId;
  /** Dollars per gallon, e.g. 2.799. null = not entered. */
  price: number | null;
  /** ISO timestamp of the last save. null = never saved. */
  updatedAt: string | null;
};

/** Tolerates a server clock that runs slightly behind the database's. */
const CLOCK_SKEW_MS = 5 * 60 * 1000;

/** Prices as read from the database, stamped with the time they were read. */
export type FuelSnapshot = { rows: FuelPriceRow[]; checkedAt: number };

/** Example board data for the internal style guide only. Never shown as real prices. */
export function exampleFuelSnapshot(hoursAgo: number): FuelSnapshot {
  const checkedAt = Date.now();
  const updatedAt = new Date(checkedAt - hoursAgo * 3_600_000).toISOString();
  return {
    checkedAt,
    rows: [
      { grade: "regular", price: 2.799, updatedAt },
      { grade: "premium", price: 3.499, updatedAt },
      { grade: "diesel", price: 3.299, updatedAt },
    ],
  };
}

export function isPriceFresh(row: FuelPriceRow, nowMs: number): boolean {
  if (row.price === null || row.updatedAt === null) return false;
  const age = nowMs - Date.parse(row.updatedAt);
  return age > -CLOCK_SKEW_MS && age < FUEL_STALE_AFTER_MS;
}

export type FuelBoardRow = { grade: FuelGradeId; label: string; price: number | null };

export type FuelBoardState =
  | { fresh: false }
  | { fresh: true; rows: FuelBoardRow[]; updatedAtMs: number; staleAtMs: number };

/**
 * What the price board may show right now. Uses the oldest timestamp among the prices
 * shown, so the whole board hides as soon as any shown price would be 48 hours old.
 */
export function fuelBoardState(prices: FuelPriceRow[], nowMs: number): FuelBoardState {
  const rows: FuelBoardRow[] = store.fuel.grades.map((g) => {
    const row = prices.find((p) => p.grade === g.id);
    const fresh = row ? isPriceFresh(row, nowMs) : false;
    return { grade: g.id, label: g.label, price: fresh && row ? row.price : null };
  });
  const shownTimes = store.fuel.grades
    .map((g) => prices.find((p) => p.grade === g.id))
    .filter((p): p is FuelPriceRow => !!p && isPriceFresh(p, nowMs))
    .map((p) => Date.parse(p.updatedAt!));
  if (shownTimes.length === 0) return { fresh: false };
  const updatedAtMs = Math.min(...shownTimes);
  return { fresh: true, rows, updatedAtMs, staleAtMs: updatedAtMs + FUEL_STALE_AFTER_MS };
}

/** 2.799 -> { main: "2.79", tenths: "9" }; 3.25 -> { main: "3.25", tenths: null }. */
export function splitPrice(price: number): { main: string; tenths: string | null } {
  const thousandths = Math.round(price * 1000);
  const cents = Math.floor(thousandths / 10);
  const tenth = thousandths % 10;
  return { main: (cents / 100).toFixed(2), tenths: tenth === 0 ? null : String(tenth) };
}

/** "$2.79 9/10" for plain text and screen readers. */
export function priceText(price: number): string {
  const { main, tenths } = splitPrice(price);
  return tenths ? `$${main} ${tenths}/10` : `$${main}`;
}

/** Spoken form: "2 dollars 79 and 9 tenths cents per gallon". */
export function priceSpoken(price: number): string {
  const { main, tenths } = splitPrice(price);
  const [dollars, cents] = main.split(".");
  return `${dollars} dollars ${Number(cents)}${tenths ? ` and ${tenths} tenths` : ""} cents per gallon`;
}

const clockFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: store.timeZone,
  hour: "numeric",
  minute: "2-digit",
});
const dateFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: store.timeZone,
  month: "short",
  day: "numeric",
});

/**
 * "7:12 AM today", "9:40 PM yesterday", or "Oct 24, 7:12 AM" when `nowMs` is unknown
 * (server render) or the date is older.
 */
export function formatUpdated(updatedAtMs: number, nowMs: number | null): string {
  const at = new Date(updatedAtMs);
  const clock = clockFmt.format(at);
  if (nowMs !== null) {
    const then = zonedParts(at).dateKey;
    const today = zonedParts(new Date(nowMs)).dateKey;
    const yesterday = zonedParts(new Date(nowMs - 24 * 60 * 60 * 1000)).dateKey;
    if (then === today) return `${clock} today`;
    if (then === yesterday) return `${clock} yesterday`;
  }
  return `${dateFmt.format(at)}, ${clock}`;
}
