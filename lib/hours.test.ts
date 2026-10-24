import { describe, expect, it } from "vitest";
import {
  daySegments,
  emptySchedule,
  formatDayHours,
  fromDayHours,
  getOpenStatus,
  summarizeWeek,
  toDayHours,
  upcomingSpecials,
  type DayHours,
  type Schedule,
} from "./hours";
import { formatClock, zonedParts, zonedTimeToUtc } from "./time";

const open = (opens: string, closes: string): DayHours => ({ kind: "open", opens, closes });
const closed: DayHours = { kind: "closed" };
const open24: DayHours = { kind: "open24" };

function everyDay(hours: DayHours): Schedule {
  return { weekly: Array.from({ length: 7 }, () => hours), special: [] };
}

/** A real instant for a Central Time wall-clock reading, e.g. ct("2026-10-21", "14:30"). */
function ct(dateKey: string, time: string): Date {
  const [h, m] = time.split(":").map(Number);
  return zonedTimeToUtc(dateKey, h! * 60 + m!);
}

// 2026-10-18 is a Sunday; 2026-10-21 a Wednesday (Central Daylight Time).
describe("time zone handling", () => {
  it("reads the wall clock in Central Time, not UTC", () => {
    // 03:30 UTC on Thursday is still 10:30 PM Wednesday in Bowling Green.
    const p = zonedParts(new Date("2026-10-22T03:30:00Z"));
    expect(p.dateKey).toBe("2026-10-21");
    expect(p.weekday).toBe(3);
    expect(p.minutes).toBe(22 * 60 + 30);
  });

  it("round-trips wall time in summer (CDT) and winter (CST)", () => {
    expect(zonedTimeToUtc("2026-07-04", 9 * 60).toISOString()).toBe("2026-07-04T14:00:00.000Z");
    expect(zonedTimeToUtc("2026-12-25", 9 * 60).toISOString()).toBe("2026-12-25T15:00:00.000Z");
  });

  it("formats clock times like a person would say them", () => {
    expect(formatClock(5 * 60)).toBe("5 AM");
    expect(formatClock(23 * 60)).toBe("11 PM");
    expect(formatClock(17 * 60 + 30)).toBe("5:30 PM");
    expect(formatClock(0)).toBe("midnight");
    expect(formatClock(24 * 60)).toBe("midnight");
    expect(formatClock(12 * 60)).toBe("noon");
    expect(formatClock(26 * 60)).toBe("2 AM");
  });
});

describe("getOpenStatus", () => {
  it("is null when no hours are published", () => {
    expect(getOpenStatus(emptySchedule(), ct("2026-10-21", "12:00"))).toBeNull();
    expect(getOpenStatus(null, ct("2026-10-21", "12:00"))).toBeNull();
  });

  it("handles normal hours", () => {
    const s = everyDay(open("05:00", "23:00"));
    expect(getOpenStatus(s, ct("2026-10-21", "12:00"))).toEqual({
      state: "open",
      headline: "Open now",
      detail: "until 11 PM",
    });
    expect(getOpenStatus(s, ct("2026-10-21", "04:30"))).toEqual({
      state: "closed",
      headline: "Closed",
      detail: "opens 5 AM",
    });
    // Late evening: the next opening is tomorrow morning, which reads naturally as "opens 5 AM".
    expect(getOpenStatus(s, ct("2026-10-21", "23:30"))).toEqual({
      state: "closed",
      headline: "Closed",
      detail: "opens 5 AM",
    });
  });

  it("treats the closing minute as closed", () => {
    const s = everyDay(open("05:00", "23:00"));
    expect(getOpenStatus(s, ct("2026-10-21", "23:00"))?.state).toBe("closed");
    expect(getOpenStatus(s, ct("2026-10-21", "22:59"))?.state).toBe("open");
    expect(getOpenStatus(s, ct("2026-10-21", "05:00"))?.state).toBe("open");
  });

  it("handles closing after midnight", () => {
    const s = everyDay(open("06:00", "02:00"));
    // 1 AM Thursday is still Wednesday's shift.
    expect(getOpenStatus(s, ct("2026-10-22", "01:00"))).toEqual({
      state: "open",
      headline: "Open now",
      detail: "until 2 AM",
    });
    expect(getOpenStatus(s, ct("2026-10-22", "03:00"))).toEqual({
      state: "closed",
      headline: "Closed",
      detail: "opens 6 AM",
    });
    expect(getOpenStatus(s, ct("2026-10-21", "22:00"))).toEqual({
      state: "open",
      headline: "Open now",
      detail: "until 2 AM",
    });
  });

  it("handles a midnight close stored as 24:00", () => {
    const s = everyDay(open("06:00", "24:00"));
    expect(getOpenStatus(s, ct("2026-10-21", "23:15"))).toEqual({
      state: "open",
      headline: "Open now",
      detail: "until midnight",
    });
  });

  it("handles open 24 hours", () => {
    expect(getOpenStatus(everyDay(open24), ct("2026-10-21", "03:00"))).toEqual({
      state: "open",
      headline: "Open 24 hours",
      detail: null,
    });
  });

  it("gives a closing time when a 24-hour day runs into a closed day", () => {
    const s = everyDay(open24);
    s.weekly[4] = closed; // Thursday closed
    expect(getOpenStatus(s, ct("2026-10-21", "20:00"))).toEqual({
      state: "open",
      headline: "Open now",
      detail: "until midnight",
    });
  });

  it("handles closed days and names the next open day", () => {
    const s = everyDay(open("07:00", "21:00"));
    s.weekly[0] = closed; // Sunday
    // Sunday noon -> opens Monday morning.
    expect(getOpenStatus(s, ct("2026-10-18", "12:00"))).toEqual({
      state: "closed",
      headline: "Closed",
      detail: "opens tomorrow 7 AM",
    });
    // Saturday 10 PM -> Sunday closed -> opens Monday.
    expect(getOpenStatus(s, ct("2026-10-17", "22:00"))).toEqual({
      state: "closed",
      headline: "Closed",
      detail: "opens Mon 7 AM",
    });
  });

  it("lets holiday hours override the weekly schedule", () => {
    const s = everyDay(open("05:00", "23:00"));
    s.special = [
      { date: "2026-11-26", label: "Thanksgiving", hours: open("08:00", "14:00") },
      { date: "2026-12-25", label: "Christmas", hours: closed },
    ];
    // Mid-afternoon after an early holiday close: say "tomorrow" so it isn't ambiguous.
    expect(getOpenStatus(s, ct("2026-11-26", "15:00"))).toEqual({
      state: "closed",
      headline: "Closed",
      detail: "opens tomorrow 5 AM",
    });
    expect(getOpenStatus(s, ct("2026-11-26", "09:00"))).toEqual({
      state: "open",
      headline: "Open now",
      detail: "until 2 PM",
    });
    expect(getOpenStatus(s, ct("2026-12-25", "12:00"))?.state).toBe("closed");
    // Christmas Eve evening: next opening skips the closed holiday.
    expect(getOpenStatus(s, ct("2026-12-24", "23:30"))).toEqual({
      state: "closed",
      headline: "Closed",
      detail: "opens Sat 5 AM",
    });
  });

  it("doesn't guess when today isn't set", () => {
    const s = emptySchedule();
    s.weekly[1] = open("05:00", "23:00"); // only Monday set
    expect(getOpenStatus(s, ct("2026-10-21", "12:00"))).toBeNull();
  });

  it("won't promise a next opening past an unknown day", () => {
    const s = emptySchedule();
    s.weekly[3] = closed; // Wednesday closed
    s.weekly[5] = open("05:00", "23:00"); // Friday open, Thursday unknown
    expect(getOpenStatus(s, ct("2026-10-21", "12:00"))).toEqual({
      state: "closed",
      headline: "Closed",
      detail: null,
    });
  });

  it("uses Central Time even when UTC is already the next day", () => {
    const s = everyDay(open("05:00", "23:00"));
    s.weekly[4] = closed; // Thursday
    // 2026-10-22T03:30Z is Wednesday 10:30 PM in Bowling Green: still open.
    expect(getOpenStatus(s, new Date("2026-10-22T03:30:00Z"))?.state).toBe("open");
  });
});

describe("formatting and summaries", () => {
  it("formats a day's hours", () => {
    expect(formatDayHours(open("05:00", "23:00"))).toBe("5 AM – 11 PM");
    expect(formatDayHours(open("06:00", "02:00"))).toBe("6 AM – 2 AM");
    expect(formatDayHours(open("06:00", "24:00"))).toBe("6 AM – midnight");
    expect(formatDayHours(open24)).toBe("Open 24 hours");
    expect(formatDayHours(closed)).toBe("Closed");
    expect(formatDayHours(null)).toBe("Call for hours");
  });

  it("summarizes the week Monday-first, grouping matching days", () => {
    const s = everyDay(open("05:00", "23:00"));
    s.weekly[6] = open("06:00", "23:00");
    s.weekly[0] = open("06:00", "23:00");
    expect(summarizeWeek(s)).toEqual([
      { days: "Mon–Fri", hours: "5 AM – 11 PM" },
      { days: "Sat–Sun", hours: "6 AM – 11 PM" },
    ]);
    expect(summarizeWeek(everyDay(open24))).toEqual([{ days: "Every day", hours: "Open 24 hours" }]);
    expect(summarizeWeek(emptySchedule())).toEqual([]);
  });

  it("lists upcoming holiday hours in order and drops past ones", () => {
    const s = emptySchedule();
    s.special = [
      { date: "2026-12-25", label: "Christmas", hours: closed },
      { date: "2026-10-01", label: "Past", hours: closed },
      { date: "2026-11-26", label: "Thanksgiving", hours: open("08:00", "14:00") },
    ];
    expect(upcomingSpecials(s, ct("2026-10-21", "12:00"), 90).map((x) => x.label)).toEqual([
      "Thanksgiving",
      "Christmas",
    ]);
  });

  it("converts database columns both ways", () => {
    expect(toDayHours(null, null)).toEqual(closed);
    expect(toDayHours("00:00", "24:00")).toEqual(open24);
    expect(toDayHours("05:00", "23:00")).toEqual(open("05:00", "23:00"));
    expect(fromDayHours(open24)).toEqual({ opensAt: "00:00", closesAt: "24:00" });
    expect(fromDayHours(closed)).toEqual({ opensAt: null, closesAt: null });
  });
});

describe("hours timeline segments", () => {
  it("covers normal hours", () => {
    expect(daySegments(open("05:00", "23:00"), open("05:00", "23:00"))).toEqual([{ start: 300, end: 1380 }]);
  });

  it("runs to midnight for a shift that closes after midnight, and shows the tail the next morning", () => {
    expect(daySegments(open("06:00", "02:00"), closed)).toEqual([{ start: 360, end: 1440 }]);
    expect(daySegments(open("06:00", "02:00"), open("06:00", "02:00"))).toEqual([
      { start: 0, end: 120 },
      { start: 360, end: 1440 },
    ]);
  });

  it("fills the whole track when open 24 hours, and nothing when closed", () => {
    expect(daySegments(open24, open24)).toEqual([{ start: 0, end: 1440 }]);
    expect(daySegments(closed, open("05:00", "23:00"))).toEqual([]);
    expect(daySegments(closed, open("18:00", "03:00"))).toEqual([{ start: 0, end: 180 }]);
  });

  it("treats a 24:00 close as midnight with no tail", () => {
    expect(daySegments(open("06:00", "07:00"), open("06:00", "24:00"))).toEqual([{ start: 360, end: 420 }]);
  });

  it("is null when the day isn't set", () => {
    expect(daySegments(null, open("05:00", "23:00"))).toBeNull();
  });
});
