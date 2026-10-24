"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/*
 * Quiet scroll reveals. Elements marked [data-reveal] that start below the fold fade in
 * and rise 12px once, when 15% visible. [data-reveal-stagger] staggers its children by
 * 50ms (first six only). Anything already on screen is left alone, so above-the-fold
 * content renders instantly; with reduced motion nothing is hidden at all.
 */
export function RevealObserver() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!("IntersectionObserver" in window)) return;

    const pending = new Map<Element, HTMLElement[]>();
    const reveal = (target: Element) => {
      for (const item of pending.get(target) ?? []) {
        item.classList.remove("reveal-pending");
        window.setTimeout(() => {
          item.classList.remove("reveal-item");
          item.style.removeProperty("transition-delay");
        }, 700);
      }
      pending.delete(target);
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            io.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15 },
    );

    const viewport = window.innerHeight;
    for (const el of document.querySelectorAll<HTMLElement>("[data-reveal]")) {
      const box = el.getBoundingClientRect();
      if (box.top < viewport && box.bottom > 0) continue; // already visible: never hide it
      const stagger = el.hasAttribute("data-reveal-stagger");
      const items = stagger ? (Array.from(el.children) as HTMLElement[]) : [el];
      items.forEach((item, i) => {
        item.classList.add("reveal-item", "reveal-pending");
        if (stagger && i < 6) item.style.transitionDelay = `${i * 50}ms`;
      });
      pending.set(el, items);
      io.observe(el);
    }

    return () => {
      io.disconnect();
      for (const items of pending.values()) {
        for (const item of items) item.classList.remove("reveal-item", "reveal-pending");
      }
    };
  }, [pathname]);

  return null;
}
