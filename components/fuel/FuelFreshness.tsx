"use client";

import { useLayoutEffect, useRef } from "react";

/**
 * Hides fuel prices (via the data-stale attribute and CSS) once they pass `staleAt`,
 * even if the page was cached or left open in a tab.
 */
export function FuelFreshness({ staleAt, children }: { staleAt: number; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const check = () => {
      if (Date.now() >= staleAt) el.setAttribute("data-stale", "");
      else el.removeAttribute("data-stale");
    };
    check();
    const timer = setInterval(check, 60_000);
    document.addEventListener("visibilitychange", check);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", check);
    };
  }, [staleAt]);

  return (
    <div ref={ref} data-stale-at={staleAt} suppressHydrationWarning>
      {children}
    </div>
  );
}
