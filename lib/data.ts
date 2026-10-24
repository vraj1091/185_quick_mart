import "server-only";
import { cache } from "react";
import { store } from "@/content/store";
import { db } from "./db";
import type { FuelSnapshot } from "./fuel";
import { emptySchedule, toDayHours, type Schedule } from "./hours";
import { utcMidnightToDateKey } from "./time";

/*
 * Public-site data. Every reader falls back to an empty, safe value if the database
 * is unreachable, so the site keeps working (showing "Call for price" / "Call for hours")
 * instead of an error page.
 */

export type SiteSettingsData = { noticeText: string | null; hotFoodOn: boolean; hiringOn: boolean };

export type DealData = { id: string; title: string; priceText: string; note: string | null };

const DEFAULT_SETTINGS: SiteSettingsData = { noticeText: null, hotFoodOn: true, hiringOn: false };

export const getFuelPrices = cache(async (): Promise<FuelSnapshot> => {
  const checkedAt = Date.now();
  try {
    const rows = await db.fuelPrice.findMany();
    const prices = store.fuel.grades.map((g) => {
      const row = rows.find((r) => r.grade === g.id);
      return {
        grade: g.id,
        price: row?.price != null ? Number(row.price) : null,
        updatedAt: row?.price != null ? row.updatedAt.toISOString() : null,
      };
    });
    return { rows: prices, checkedAt };
  } catch (err) {
    console.error("getFuelPrices failed:", err);
    return {
      rows: store.fuel.grades.map((g) => ({ grade: g.id, price: null, updatedAt: null })),
      checkedAt,
    };
  }
});

export const getSchedule = cache(async (): Promise<Schedule> => {
  try {
    const [weeklyRows, specialRows] = await Promise.all([
      db.storeHours.findMany(),
      db.specialHours.findMany({
        where: { date: { gte: new Date(Date.now() - 2 * 86_400_000) } },
        orderBy: { date: "asc" },
      }),
    ]);
    const schedule = emptySchedule();
    for (const row of weeklyRows) {
      if (row.dayOfWeek >= 0 && row.dayOfWeek <= 6) {
        schedule.weekly[row.dayOfWeek] = toDayHours(row.opensAt, row.closesAt);
      }
    }
    schedule.special = specialRows.map((s) => ({
      date: utcMidnightToDateKey(s.date),
      label: s.label,
      hours: toDayHours(s.opensAt, s.closesAt),
    }));
    return schedule;
  } catch (err) {
    console.error("getSchedule failed:", err);
    return emptySchedule();
  }
});

export const getSettings = cache(async (): Promise<SiteSettingsData> => {
  try {
    const row = await db.siteSettings.findUnique({ where: { id: 1 } });
    if (!row) return DEFAULT_SETTINGS;
    return {
      noticeText: row.noticeText?.trim() || null,
      hotFoodOn: row.hotFoodOn,
      hiringOn: row.hiringOn,
    };
  } catch (err) {
    console.error("getSettings failed:", err);
    return DEFAULT_SETTINGS;
  }
});

/** Active deals running today, up to four. */
export const getCurrentDeals = cache(async (): Promise<DealData[]> => {
  const now = new Date();
  try {
    const rows = await db.deal.findMany({
      where: {
        active: true,
        AND: [
          { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
          { OR: [{ endsAt: null }, { endsAt: { gt: now } }] },
        ],
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: 4,
    });
    return rows.map((d) => ({ id: d.id, title: d.title, priceText: d.priceText, note: d.note }));
  } catch (err) {
    console.error("getCurrentDeals failed:", err);
    return [];
  }
});
