"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";
import { priceSpoken, splitPrice } from "@/lib/fuel";

const DIGITS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

/**
 * A fuel price in LED digits. The first time the board scrolls into view, each digit
 * rolls up from 0 to its value (500ms, staggered 40ms). The server renders the real
 * value, so without JS, with reduced motion, or if the board is already on screen at
 * load, the digits simply show the price; they never show a placeholder.
 */
export function LedPrice({ price, size }: { price: number; size: "md" | "lg" }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Decide for the whole board, so its rows either all roll or all stay put.
    const box = (el.closest("[data-odometer-group]") ?? el).getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return; // already on screen at load
    el.dataset.odometer = "armed";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        requestAnimationFrame(() => {
          el.dataset.odometer = "run";
        });
      },
      { threshold: 0.6 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const { main, tenths } = splitPrice(price);
  const chars = main.split("");
  const digitIndex = (pos: number) => chars.slice(0, pos).filter((c) => c !== ".").length;

  const digit = (value: string, index: number) => (
    <span className="odo-window" key={`d${index}`}>
      <span className="odo-strip" style={{ "--d": Number(value), "--i": index } as React.CSSProperties}>
        {DIGITS.map((n) => (
          <span key={n}>{n}</span>
        ))}
      </span>
    </span>
  );

  return (
    <span
      className={cn(
        "relative flex items-start font-mono leading-none font-semibold tabular",
        size === "lg" ? "text-[clamp(3rem,2.2rem+3.2vw,4.5rem)]" : "text-[clamp(2.5rem,2rem+2vw,3.5rem)]",
      )}
    >
      <span className="sr-only">{priceSpoken(price)}</span>
      <span ref={ref} aria-hidden="true" className="led-glow flex items-start">
        {chars.map((c, pos) => (c === "." ? <span key="dot">.</span> : digit(c, digitIndex(pos))))}
        {tenths ? (
          <span className="mt-[0.1em] ml-[0.08em] flex flex-col items-center text-[0.34em] leading-[1.1]">
            {digit(tenths, digitIndex(chars.length))}
            <span className="border-t-2 border-current px-[0.08em]">10</span>
          </span>
        ) : null}
      </span>
      <span aria-hidden="true" className="led-matrix" />
    </span>
  );
}
