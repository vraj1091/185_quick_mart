"use client";

import { cn } from "@/lib/cn";
import { getOpenStatus, type Schedule } from "@/lib/hours";
import { useNow } from "@/lib/use-now";

/**
 * Live open/closed status, computed in Central Time in the browser.
 * Open: soft green tint with a fern dot. Closed: mist with muted text.
 * The server renders an empty frame of the same height so nothing shifts.
 */
export function OpenNowPill({ schedule, className }: { schedule: Schedule; className?: string }) {
  const now = useNow();
  const frame =
    "inline-flex h-10 items-center gap-2 rounded-md border px-3 text-[0.9375rem] leading-none";

  if (now === null) {
    return <span aria-hidden="true" className={cn(frame, "w-60 max-w-full border-line bg-surface-alt", className)} />;
  }

  const status = getOpenStatus(schedule, new Date(now));
  if (!status) return null;

  const open = status.state === "open";

  return (
    <p
      className={cn(
        frame,
        open ? "border-accent/25 bg-accent-soft text-primary" : "border-line bg-surface-alt text-muted",
        className,
      )}
    >
      <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-full", open ? "bg-accent" : "bg-muted")} />
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
