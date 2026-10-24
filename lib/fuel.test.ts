import { describe, expect, it } from "vitest";
import {
  FUEL_STALE_AFTER_MS,
  formatUpdated,
  fuelBoardState,
  isPriceFresh,
  priceText,
  splitPrice,
  type FuelPriceRow,
} from "./fuel";

const NOW = Date.parse("2026-10-21T17:00:00Z"); // noon in Bowling Green
const hoursAgo = (h: number) => new Date(NOW - h * 3_600_000).toISOString();

const rows = (updatedAt: string | null, regular: number | null = 2.799): FuelPriceRow[] => [
  { grade: "regular", price: regular, updatedAt },
  { grade: "premium", price: 3.499, updatedAt },
  { grade: "diesel", price: 3.299, updatedAt },
];

describe("stale price rule", () => {
  it("shows prices younger than 48 hours", () => {
    expect(isPriceFresh(rows(hoursAgo(47.9))[0]!, NOW)).toBe(true);
  });

  it("never shows a price 48 hours old or older", () => {
    expect(isPriceFresh(rows(new Date(NOW - FUEL_STALE_AFTER_MS).toISOString())[0]!, NOW)).toBe(false);
    expect(isPriceFresh(rows(hoursAgo(72))[0]!, NOW)).toBe(false);
  });

  it("never shows an empty price", () => {
    expect(isPriceFresh({ grade: "regular", price: null, updatedAt: hoursAgo(1) }, NOW)).toBe(false);
    expect(isPriceFresh({ grade: "regular", price: 2.5, updatedAt: null }, NOW)).toBe(false);
  });

  it("hides the whole board when everything is stale", () => {
    expect(fuelBoardState(rows(hoursAgo(49)), NOW)).toEqual({ fresh: false });
    expect(fuelBoardState([], NOW)).toEqual({ fresh: false });
  });

  it("schedules the board to hide 48 hours after the oldest shown price", () => {
    const prices = rows(hoursAgo(2));
    prices[2] = { grade: "diesel", price: 3.299, updatedAt: hoursAgo(10) };
    const state = fuelBoardState(prices, NOW);
    expect(state.fresh).toBe(true);
    if (state.fresh) {
      expect(state.updatedAtMs).toBe(Date.parse(hoursAgo(10)));
      expect(state.staleAtMs).toBe(Date.parse(hoursAgo(10)) + FUEL_STALE_AFTER_MS);
      expect(state.rows.map((r) => r.price)).toEqual([2.799, 3.499, 3.299]);
    }
  });

  it("shows only the grades that have a price", () => {
    const state = fuelBoardState(rows(hoursAgo(1), null), NOW);
    expect(state.fresh && state.rows.map((r) => r.price)).toEqual([null, 3.499, 3.299]);
  });
});

describe("price display", () => {
  it("splits off the tenth of a cent like a fuel sign", () => {
    expect(splitPrice(2.799)).toEqual({ main: "2.79", tenths: "9" });
    expect(splitPrice(3.25)).toEqual({ main: "3.25", tenths: null });
    expect(splitPrice(3)).toEqual({ main: "3.00", tenths: null });
    expect(splitPrice(2.989)).toEqual({ main: "2.98", tenths: "9" });
    expect(priceText(2.799)).toBe("$2.79 9/10");
  });

  it("says today/yesterday in Central Time", () => {
    expect(formatUpdated(Date.parse("2026-10-21T12:12:00Z"), NOW)).toBe("7:12 AM today");
    expect(formatUpdated(Date.parse("2026-10-21T02:40:00Z"), NOW)).toBe("9:40 PM yesterday");
    expect(formatUpdated(Date.parse("2026-10-21T12:12:00Z"), null)).toBe("Oct 21, 7:12 AM");
  });
});
