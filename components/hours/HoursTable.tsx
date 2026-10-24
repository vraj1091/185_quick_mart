"use client";

import { Phone } from "lucide-react";
import { Sep } from "@/components/brand/Sep";
import { store } from "@/content/store";
import { cn } from "@/lib/cn";
import {
  daySegments,
  formatDayHours,
  getOpenStatus,
  hasWeeklyHours,
  type DayHours,
  type Schedule,
  type SpecialDay,
} from "@/lib/hours";
import {
  DISPLAY_DAY_ORDER,
  MINUTES_PER_DAY,
  WEEKDAY_NAMES,
  WEEKDAY_SHORT,
  formatDateKey,
  zonedParts,
} from "@/lib/time";
import { useNow } from "@/lib/use-now";

const pct = (minutes: number) => `${(minutes / MINUTES_PER_DAY) * 100}%`;

type Row = {
  day: number;
  hours: DayHours | null;
  previous: DayHours | null;
  special: SpecialDay | null;
};

/** Rows Monday to Sunday; today's row uses holiday hours when there are some. */
function weekRows(
  schedule: Schedule,
  todayWeekday: number | null,
  todaySpecial: SpecialDay | undefined,
): Row[] {
  return DISPLAY_DAY_ORDER.map((day) => {
    const isToday = day === todayWeekday;
    const prev = (day + 6) % 7;
    return {
      day,
      hours: isToday && todaySpecial ? todaySpecial.hours : (schedule.weekly[day] ?? null),
      previous: schedule.weekly[prev] ?? null,
      special: isToday && todaySpecial ? todaySpecial : null,
    };
  });
}

/** A 24-hour track with the open spans filled, plus an optional "now" marker. Decorative. */
function Track({
  hours,
  previous,
  nowMinutes,
  tone = "light",
}: {
  hours: DayHours | null;
  previous: DayHours | null;
  nowMinutes: number | null;
  tone?: "light" | "dark";
}) {
  const segments = daySegments(hours, previous) ?? [];
  return (
    <span
      aria-hidden="true"
      className={cn("relative block h-2 rounded-xs", tone === "dark" ? "bg-on-deep/15" : "bg-line")}
    >
      {segments.map((s) => (
        <span
          key={s.start}
          className={cn(
            "absolute inset-y-0 rounded-xs",
            tone === "dark" ? "bg-accent-bright" : "bg-primary",
          )}
          style={{ left: pct(s.start), width: pct(s.end - s.start) }}
        />
      ))}
      {nowMinutes !== null ? (
        <span
          className={cn(
            "absolute -top-1 h-4 w-[3px] -translate-x-1/2 rounded-xs ring-2",
            tone === "dark" ? "bg-on-deep ring-deep" : "bg-ink ring-surface",
          )}
          style={{ left: pct(nowMinutes) }}
        />
      ) : null}
    </span>
  );
}

/**
 * Weekly hours as a visual timeline, with today highlighted and a marker at the current
 * Central Time when the store is open. `specials` is pre-filtered on the server; the
 * browser drops any that have passed. Shows "Call for hours" when none are set.
 */
export function HoursTable({
  schedule,
  specials,
  className,
}: {
  schedule: Schedule;
  specials: SpecialDay[];
  className?: string;
}) {
  const now = useNow();
  const zoned = now === null ? null : zonedParts(new Date(now));
  const upcoming = zoned ? specials.filter((s) => s.date >= zoned.dateKey) : specials;
  const todaySpecial = zoned ? upcoming.find((s) => s.date === zoned.dateKey) : undefined;
  const openNow = now !== null && getOpenStatus(schedule, new Date(now))?.state === "open";

  return (
    <div className={className}>
      {hasWeeklyHours(schedule) ? (
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Store hours, Central Time</caption>
          <thead aria-hidden="true">
            <tr>
              <td />
              <td className="hidden pb-1 sm:table-cell">
                <span className="text-muted relative block h-4 font-mono text-[0.6875rem]">
                  <span className="absolute left-0">12a</span>
                  <span className="absolute left-1/4 -translate-x-1/2">6a</span>
                  <span className="absolute left-1/2 -translate-x-1/2">noon</span>
                  <span className="absolute left-3/4 -translate-x-1/2">6p</span>
                </span>
              </td>
              <td />
            </tr>
          </thead>
          <tbody>
            {weekRows(schedule, zoned?.weekday ?? null, todaySpecial).map((row) => {
              const isToday = row.day === zoned?.weekday;
              return (
                <tr
                  key={row.day}
                  className={cn("border-line border-b", isToday && "bg-accent-soft")}
                >
                  <th
                    scope="row"
                    className={cn(
                      "py-2.5 pr-3 pl-3 whitespace-nowrap",
                      isToday ? "font-extrabold" : "font-semibold",
                    )}
                  >
                    {WEEKDAY_NAMES[row.day]}
                    {isToday ? (
                      <span className="eyebrow bg-primary text-on-primary ml-2 rounded-xs px-1.5 pt-0.5 text-[0.625rem]">
                        Today
                      </span>
                    ) : null}
                  </th>
                  <td className="w-full min-w-20 py-2.5 pr-3 sm:pr-4">
                    <Track
                      hours={row.hours}
                      previous={row.previous}
                      nowMinutes={isToday && openNow && zoned ? zoned.minutes : null}
                    />
                  </td>
                  <td
                    className={cn(
                      "tabular py-2.5 pr-3 text-right font-mono whitespace-nowrap",
                      isToday && "font-bold",
                    )}
                  >
                    {formatDayHours(row.hours)}
                    {row.special ? (
                      <span className="text-muted block text-xs font-normal">
                        {row.special.label}
                      </span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="border-line bg-surface rounded-sm border p-5">
          <p className="text-lg font-bold">Call for hours</p>
          <p className="text-muted mt-1">
            We’ll post our hours here soon. Until then, give us a call.
          </p>
          <a href={store.phone.href} className="link-store mt-3 inline-flex items-center gap-2">
            <Phone aria-hidden="true" strokeWidth={1.75} className="size-4" />
            <span className="tabular font-mono">{store.phone.display}</span>
          </a>
        </div>
      )}

      {upcoming.length > 0 ? (
        <div className="mt-6">
          <h3 className="eyebrow text-accent">Holiday hours</h3>
          <ul className="divide-line border-line mt-2 divide-y border-y">
            {upcoming.map((s) => (
              <li
                key={s.date}
                className="flex flex-wrap items-baseline justify-between gap-x-4 py-2.5"
              >
                <span>
                  <span className="font-bold">{s.label}</span>
                  <span className="text-muted">
                    <Sep />
                    {formatDateKey(s.date)}
                  </span>
                </span>
                <span className="tabular font-mono">{formatDayHours(s.hours)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="text-muted mt-3 text-sm">All times Central.</p>
    </div>
  );
}

/** Compact week of timeline tracks for the dark footer. Renders nothing without hours. */
export function HoursTimelineCompact({
  schedule,
  className,
}: {
  schedule: Schedule;
  className?: string;
}) {
  const now = useNow();
  if (!hasWeeklyHours(schedule)) return null;
  const zoned = now === null ? null : zonedParts(new Date(now));
  const openNow = now !== null && getOpenStatus(schedule, new Date(now))?.state === "open";
  return (
    <ul aria-hidden="true" className={cn("space-y-1.5", className)}>
      {weekRows(schedule, zoned?.weekday ?? null, undefined).map((row) => {
        const isToday = row.day === zoned?.weekday;
        return (
          <li key={row.day} className="grid grid-cols-[2.25rem_1fr] items-center gap-2">
            <span
              className={cn(
                "font-mono text-[0.6875rem] uppercase",
                isToday ? "text-on-deep font-bold" : "text-on-deep-muted",
              )}
            >
              {WEEKDAY_SHORT[row.day]}
            </span>
            <Track
              tone="dark"
              hours={row.hours}
              previous={row.previous}
              nowMinutes={isToday && openNow && zoned ? zoned.minutes : null}
            />
          </li>
        );
      })}
    </ul>
  );
}
