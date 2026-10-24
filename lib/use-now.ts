"use client";

import { useSyncExternalStore } from "react";

/*
 * The current time, for components that depend on the clock (open/closed status,
 * "updated today"). Returns null during server rendering and hydration, so the
 * server HTML never disagrees with the browser; the real value arrives right after.
 */

const TICK_MS = 30_000;
const listeners = new Set<() => void>();
let timer: ReturnType<typeof setInterval> | null = null;

function notify() {
  for (const listener of listeners) listener();
}

function onVisibility() {
  if (document.visibilityState === "visible") notify();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (listeners.size === 1) {
    timer = setInterval(notify, TICK_MS);
    document.addEventListener("visibilitychange", onVisibility);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      if (timer) clearInterval(timer);
      timer = null;
      document.removeEventListener("visibilitychange", onVisibility);
    }
  };
}

const getSnapshot = () => Math.floor(Date.now() / TICK_MS) * TICK_MS;
const getServerSnapshot = () => null;

export function useNow(): number | null {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
