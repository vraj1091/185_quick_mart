"use client";

import { cn } from "@/lib/cn";
import { getOpenStatus, type Schedule } from "@/lib/hours";
import { useNow } from "@/lib/use-now";

/**
 * Live open/closed tag, computed in Central Time in the browser. Styled after the
 * OPEN sign in the front window. The server renders an empty frame of the same
 * height so nothing shifts when the real status appears.
 */
export function OpenNowPill({ schedule, className }: { schedule: Schedule; className?: string }) {
  const now = useNow();
  const frame =
    "inline-flex h-11 items-stretch overflow-hidden rounded-sm border-2 text-[0.9375rem] leading-none";

  if (now === null) {
    return <span aria-hidden="true" className={cn(frame, "w-64 max-w-full border-line bg-surface", className)} />;
  }

  const status = getOpenStatus(schedule, new Date(now));
  if (!status) return null;

  const open = status.state === "open";
  const label = open ? (status.headline === "Open 24 hours" ? "Open" : "Open now") : "Closed";
  const detail = status.headline === "Open 24 hours" ? "24 hours" : status.detail;

  return (
    <p className={cn(frame, open ? "border-accent" : "border-ink", className)}>
      <span
        className={cn(
          "eyebrow flex items-center px-3 pt-0.5",
          open ? "bg-primary text-on-primary" : "bg-deep text-on-deep",
        )}
      >
        {label}
      </span>
      {detail ? (
        <span className="flex items-center bg-surface px-3 pt-0.5 font-bold text-ink">
          <span className="sr-only">, </span>
          {detail}
        </span>
      ) : null}
    </p>
  );
}
