"use client";

import { useEffect } from "react";

/** Marks <html data-scrolled> once the page has scrolled past `threshold` px (header styling). */
export function ScrollFlag({ threshold = 24 }: { threshold?: number }) {
  useEffect(() => {
    const root = document.documentElement;
    let queued = false;
    const update = () => {
      queued = false;
      if (window.scrollY > threshold) root.dataset.scrolled = "";
      else delete root.dataset.scrolled;
    };
    const onScroll = () => {
      if (!queued) {
        queued = true;
        requestAnimationFrame(update);
      }
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      delete root.dataset.scrolled;
    };
  }, [threshold]);
  return null;
}
