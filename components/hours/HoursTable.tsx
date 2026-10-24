"use client";

import { Phone } from "lucide-react";
import { store } from "@/content/store";
import { Sep } from "@/components/brand/Sep";
import { cn } from "@/lib/cn";
import { formatDayHours, hasWeeklyHours, type Schedule, type SpecialDay } from "@/lib/hours";
import { DISPLAY_DAY_ORDER, WEEKDAY_NAMES, formatDateKey, zonedParts } from "@/lib/time";
import { useNow } from "@/lib/use-now";

/**
 * Weekly hours with today highlighted, plus upcoming holiday hours.
 * `specials` is pre-filtered on the server; the browser drops any that have passed.
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
  const todayKey = now === null ? null : zonedParts(new Date(now)).dateKey;
  const todayWeekday = now === null ? null : zonedParts(new Date(now)).weekday;
  const upcoming = todayKey ? specials.filter((s) => s.date >= todayKey) : specials;
  const todaySpecial = todayKey ? upcoming.find((s) => s.date === todayKey) : undefined;

  return (
    <div className={className}>
      {hasWeeklyHours(schedule) ? (
        <table className="w-full border-collapse text-left">
          <caption className="sr-only">Store hours, Central Time</caption>
          <tbody>
            {DISPLAY_DAY_ORDER.map((day) => {
              const isToday = day === todayWeekday;
              const hours = isToday && todaySpecial ? todaySpecial.hours : (schedule.weekly[day] ?? null);
              return (
                <tr
                  key={day}
                  className={cn(
                    "border-b border-line",
                    isToday && "bg-surface shadow-[inset_4px_0_0_var(--color-primary)]",
                  )}
                >
                  <th scope="row" className={cn("py-2.5 pr-4 pl-3", isToday ? "font-extrabold" : "font-semibold")}>
                    {WEEKDAY_NAMES[day]}
                    {isToday ? <span className="eyebrow ml-2 text-[0.6875rem] text-accent">Today</span> : null}
                  </th>
                  <td className={cn("py-2.5 pr-3 text-right font-mono tabular", isToday && "font-bold")}>
                    {formatDayHours(hours)}
                    {isToday && todaySpecial ? (
                      <span className="block text-xs font-normal text-muted">{todaySpecial.label}</span>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      ) : (
        <div className="rounded-sm border border-line bg-surface p-5">
          <p className="text-lg font-bold">Call for hours</p>
          <p className="mt-1 text-muted">We’ll post our hours here soon. Until then, give us a call.</p>
          <a href={store.phone.href} className="link-store mt-3 inline-flex items-center gap-2">
            <Phone aria-hidden="true" strokeWidth={1.75} className="size-4" />
            <span className="font-mono tabular">{store.phone.display}</span>
          </a>
        </div>
      )}

      {upcoming.length > 0 ? (
        <div className="mt-6">
          <h3 className="eyebrow text-accent">Holiday hours</h3>
          <ul className="mt-2 divide-y divide-line border-y border-line">
            {upcoming.map((s) => (
              <li key={s.date} className="flex flex-wrap items-baseline justify-between gap-x-4 py-2.5">
                <span>
                  <span className="font-bold">{s.label}</span>{" "}
                  <span className="text-muted">
                    <Sep />
                    {formatDateKey(s.date)}
                  </span>
                </span>
                <span className="font-mono tabular">{formatDayHours(s.hours)}</span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <p className="mt-3 text-sm text-muted">All times Central.</p>
    </div>
  );
}
