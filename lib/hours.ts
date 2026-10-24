/**
 * Store hours: open/closed status, labels, and summaries, all in Central Time.
 *
 * Supports normal hours, closing after midnight, open 24 hours, closed days, and
 * special/holiday hours that override the weekly schedule. Days the owner hasn't
 * filled in are `null` (unknown); the UI never guesses about them.
 */
import {
  DISPLAY_DAY_ORDER,
  MINUTES_PER_DAY,
  WEEKDAY_SHORT,
  addDaysToKey,
  formatClock,
  weekdayOfKey,
  zonedParts,
} from "./time";

export type DayHours =
  | { kind: "closed" }
  | { kind: "open24" }
  /** "HH:MM". `closes` may be "24:00", or earlier than `opens` to mean after midnight. */
  | { kind: "open"; opens: string; closes: string };

export type SpecialDay = { date: string; label: string; hours: DayHours };

export type Schedule = {
  /** Index 0 = Sunday. `null` = not set. */
  weekly: (DayHours | null)[];
  special: SpecialDay[];
};

export type OpenStatus =
  | { state: "open"; headline: string; detail: string | null }
  | { state: "closed"; headline: string; detail: string | null };

type Interval = { start: number; end: number };

export function parseTime(value: string): number | null {
  const match = /^(\d{1,2}):(\d{2})$/.exec(value);
  if (!match) return null;
  const hour = Number(match[1]);
  const minute = Number(match[2]);
  if (hour > 24 || minute > 59 || (hour === 24 && minute !== 0)) return null;
  return hour * 60 + minute;
}

/** Database columns -> DayHours. Both null = closed. */
export function toDayHours(opensAt: string | null, closesAt: string | null): DayHours {
  if (!opensAt || !closesAt) return { kind: "closed" };
  if (opensAt === "00:00" && (closesAt === "24:00" || closesAt === "00:00")) {
    return { kind: "open24" };
  }
  return { kind: "open", opens: opensAt, closes: closesAt };
}

/** DayHours -> database columns. */
export function fromDayHours(hours: DayHours): { opensAt: string | null; closesAt: string | null } {
  switch (hours.kind) {
    case "closed":
      return { opensAt: null, closesAt: null };
    case "open24":
      return { opensAt: "00:00", closesAt: "24:00" };
    case "open":
      return { opensAt: hours.opens, closesAt: hours.closes };
  }
}

export function emptySchedule(): Schedule {
  return { weekly: [null, null, null, null, null, null, null], special: [] };
}

/** True when the owner has published at least one day of weekly hours. */
export function hasWeeklyHours(schedule: Schedule | null | undefined): schedule is Schedule {
  return !!schedule && schedule.weekly.some((day) => day !== null);
}

export function hoursOn(
  schedule: Schedule,
  dateKey: string,
): { hours: DayHours | null; special: SpecialDay | null } {
  const special = schedule.special.find((s) => s.date === dateKey) ?? null;
  if (special) return { hours: special.hours, special };
  return { hours: schedule.weekly[weekdayOfKey(dateKey)] ?? null, special: null };
}

function dayInterval(hours: DayHours, dayOffset: number): Interval | null {
  const base = dayOffset * MINUTES_PER_DAY;
  if (hours.kind === "closed") return null;
  if (hours.kind === "open24") return { start: base, end: base + MINUTES_PER_DAY };
  const opens = parseTime(hours.opens);
  const closes = parseTime(hours.closes);
  if (opens === null || closes === null) return null;
  const end = closes <= opens ? closes + MINUTES_PER_DAY : closes;
  return { start: base + opens, end: base + end };
}

function mergeIntervals(intervals: Interval[]): Interval[] {
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  const merged: Interval[] = [];
  for (const iv of sorted) {
    const last = merged[merged.length - 1];
    if (last && iv.start <= last.end) last.end = Math.max(last.end, iv.end);
    else merged.push({ ...iv });
  }
  return merged;
}

/**
 * Open/closed status at `now`, in Central Time.
 * Returns null when it can't be known (no hours published, or today isn't set).
 */
export function getOpenStatus(schedule: Schedule | null, now: Date): OpenStatus | null {
  if (!hasWeeklyHours(schedule)) return null;
  const z = zonedParts(now);
  if (hoursOn(schedule, z.dateKey).hours === null) return null;

  const intervals: Interval[] = [];
  let firstUnknownDay: number | null = null;
  for (let offset = -1; offset <= 7; offset++) {
    const { hours } = hoursOn(schedule, addDaysToKey(z.dateKey, offset));
    if (hours === null) {
      if (offset > 0 && firstUnknownDay === null) firstUnknownDay = offset;
      continue;
    }
    const iv = dayInterval(hours, offset);
    if (iv) intervals.push(iv);
  }

  const merged = mergeIntervals(intervals);
  const nowMin = z.minutes;
  const current = merged.find((iv) => iv.start <= nowMin && nowMin < iv.end);

  if (current) {
    if (current.end - nowMin >= MINUTES_PER_DAY) {
      return { state: "open", headline: "Open 24 hours", detail: null };
    }
    return { state: "open", headline: "Open now", detail: `until ${formatClock(current.end)}` };
  }

  const next = merged.find((iv) => iv.start > nowMin);
  if (!next || (firstUnknownDay !== null && next.start >= firstUnknownDay * MINUTES_PER_DAY)) {
    return { state: "closed", headline: "Closed", detail: null };
  }

  const dayOffset = Math.floor(next.start / MINUTES_PER_DAY);
  const time = formatClock(next.start);
  let detail: string;
  if (dayOffset === 0) detail = `opens ${time}`;
  else if (dayOffset === 1) detail = nowMin >= 18 * 60 ? `opens ${time}` : `opens tomorrow ${time}`;
  else detail = `opens ${WEEKDAY_SHORT[weekdayOfKey(addDaysToKey(z.dateKey, dayOffset))]} ${time}`;
  return { state: "closed", headline: "Closed", detail };
}

/** "5 AM – 11 PM", "Open 24 hours", "Closed". */
export function formatDayHours(hours: DayHours | null): string {
  if (hours === null) return "Call for hours";
  if (hours.kind === "closed") return "Closed";
  if (hours.kind === "open24") return "Open 24 hours";
  const opens = parseTime(hours.opens);
  const closes = parseTime(hours.closes);
  if (opens === null || closes === null) return "Call for hours";
  return `${formatClock(opens)} – ${formatClock(closes)}`;
}

/** Groups consecutive days with the same hours, Monday first: [{ days: "Mon–Fri", hours: "5 AM – 11 PM" }]. */
export function summarizeWeek(schedule: Schedule | null): { days: string; hours: string }[] {
  if (!hasWeeklyHours(schedule)) return [];
  const rows = DISPLAY_DAY_ORDER.map((d) => ({
    day: WEEKDAY_SHORT[d],
    hours: formatDayHours(schedule.weekly[d] ?? null),
  }));
  if (rows.every((r) => r.hours === rows[0]!.hours)) {
    return [{ days: "Every day", hours: rows[0]!.hours }];
  }
  const groups: { first: string; last: string; hours: string }[] = [];
  for (const row of rows) {
    const last = groups[groups.length - 1];
    if (last && last.hours === row.hours) last.last = row.day;
    else groups.push({ first: row.day, last: row.day, hours: row.hours });
  }
  return groups.map((g) => ({
    days: g.first === g.last ? g.first : `${g.first}–${g.last}`,
    hours: g.hours,
  }));
}

/** Special hours from today through `days` ahead, soonest first. */
export function upcomingSpecials(schedule: Schedule | null, now: Date, days = 45): SpecialDay[] {
  if (!schedule) return [];
  const today = zonedParts(now).dateKey;
  const until = addDaysToKey(today, days);
  return schedule.special
    .filter((s) => s.date >= today && s.date <= until)
    .sort((a, b) => a.date.localeCompare(b.date));
}
