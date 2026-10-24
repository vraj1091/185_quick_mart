"use client";

import { cn } from "@/lib/cn";
import { getOpenStatus, type Schedule } from "@/lib/hours";
import { useNow } from "@/lib/use-now";

/**
 * Live open/closed status, computed in Central Time in the browser.
 * Open: soft green tint with a fern dot. Closed: mist with muted text.
 * The server renders an empty frame of the same size so nothing shifts.
 *
 * `stacked` (the info rail) shows the pill with the headline only and the detail
 * ("until 11 PM") on the line below. `fallback` shows when today's hours aren't set.
 */
export function OpenNowPill({
  schedule,
  className,
  stacked = false,
  fallback = null,
}: {
  schedule: Schedule;
  className?: string;
  stacked?: boolean;
  fallback?: React.ReactNode;
}) {
  const now = useNow();
  const frame = "inline-flex h-10 items-center gap-2 rounded-md border px-3 text-[0.9375rem] leading-none";

  if (now === null) {
    return stacked ? (
      <span aria-hidden="true" className={cn("block", className)}>
        <span className={cn(frame, "w-32 border-line bg-surface-alt")} />
        <span className="mt-1.5 block h-5" />
      </span>
    ) : (
      <span aria-hidden="true" className={cn(frame, "w-60 max-w-full border-line bg-surface-alt", className)} />
    );
  }

  const status = getOpenStatus(schedule, new Date(now));
  if (!status) return <>{fallback}</>;

  const open = status.state === "open";
  const pill = cn(frame, open ? "border-accent/25 bg-accent-soft text-primary" : "border-line bg-surface-alt text-muted");
  const dot = <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", open ? "bg-accent" : "bg-muted")} />;

  if (stacked) {
    return (
      <p className={className}>
        <span className={pill}>
          {dot}
          <span className="pt-0.5 font-bold">{status.headline}</span>
        </span>
        <span className="mt-1.5 block h-5 text-[0.9375rem] text-muted">
          {status.detail ? (
            <>
              <span className="sr-only">, </span>
              {status.detail}
            </>
          ) : null}
        </span>
      </p>
    );
  }

  return (
    <p className={cn(pill, className)}>
      {dot}
      <span className="pt-0.5 font-bold">{status.headline}</span>
      {status.detail ? (
        <>
          <span aria-hidden="true" className="pt-0.5">
            ·
          </span>
          <span className="sr-only">, </span>
          <span className="pt-0.5">{status.detail}</span>
        </>
      ) : null}
    </p>
  );
}
