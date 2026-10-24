"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import { Sep } from "@/components/brand/Sep";
import type { MenuCategory } from "@/content/menu";
import { cn } from "@/lib/cn";

/*
 * The hot food menu as "menu boards", like the boards above the counter.
 * Desktop: four boards in a row. Tablet: two columns. Phone: a tab bar with one board
 * at a time. Which board shows on a phone is pure CSS (so the server HTML is already
 * right and nothing shifts); the tab semantics switch on once the browser confirms a
 * phone-sized screen.
 */

const PHONE_QUERY = "(max-width: 639.98px)";

function subscribe(onChange: () => void) {
  const mq = window.matchMedia(PHONE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

function useIsPhone(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(PHONE_QUERY).matches,
    () => false,
  );
}

export function MenuBoards({ categories, className }: { categories: MenuCategory[]; className?: string }) {
  const isPhone = useIsPhone();
  const [active, setActive] = useState(0);
  const [switched, setSwitched] = useState(false);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (index: number, focus = false) => {
    const next = (index + categories.length) % categories.length;
    setActive(next);
    setSwitched(true);
    if (focus) tabs.current[next]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent, index: number) => {
    const moves: Record<string, number> = {
      ArrowRight: index + 1,
      ArrowLeft: index - 1,
      Home: 0,
      End: categories.length - 1,
    };
    const target = moves[e.key];
    if (target === undefined) return;
    e.preventDefault();
    select(target, true);
  };

  return (
    <div className={className}>
      {/* Phone only: tab bar. Scrolls sideways if it ever gets too wide. */}
      <div className="-mx-4 overflow-x-auto px-4 pb-1 sm:hidden">
        <div role="tablist" aria-label="Menu" className="flex w-max min-w-full gap-2">
          {categories.map((c, i) => (
            <button
              key={c.id}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`menu-tab-${c.id}`}
              aria-selected={i === active}
              aria-controls={`menu-panel-${c.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={cn(
                "min-h-11 flex-1 rounded-sm px-4 text-[0.9375rem] font-bold whitespace-nowrap transition-colors duration-150",
                i === active ? "bg-primary text-on-primary" : "bg-accent-soft text-primary",
              )}
            >
              {c.tabLabel}
            </button>
          ))}
        </div>
      </div>

      <div data-reveal data-reveal-stagger className="mt-4 grid items-start gap-4 sm:mt-0 sm:grid-cols-2 sm:gap-5 lg:grid-cols-4">
        {categories.map((c, i) => (
          <article
            key={c.id}
            id={`menu-panel-${c.id}`}
            role={isPhone ? "tabpanel" : undefined}
            aria-labelledby={isPhone ? `menu-tab-${c.id}` : `menu-title-${c.id}`}
            tabIndex={isPhone ? 0 : undefined}
            className={cn(
              "overflow-hidden rounded-sm border border-line bg-surface shadow-sm",
              i !== active && "max-sm:hidden",
              switched && i === active && "menu-fade-in",
            )}
          >
            <header className="on-dark bg-deep px-4 pt-3.5 pb-3 text-on-deep">
              {c.eyebrow ? (
                <p className="eyebrow mb-1 text-[0.6875rem] text-on-deep-muted">{c.eyebrow}</p>
              ) : null}
              <h3 id={`menu-title-${c.id}`} className="type-display text-[1.25rem] tracking-[0.01em]">
                {c.title}
              </h3>
            </header>
            <div className="px-4 pb-2">
              {c.groups.map((g, gi) => (
                <div key={g.title ?? gi} className="pt-4 first:pt-3">
                  {g.title ? (
                    <h4 className="font-mono text-[0.75rem] font-semibold tracking-wider text-accent uppercase">
                      {g.title}
                    </h4>
                  ) : null}
                  {g.inline ? (
                    <p className="py-2.5 font-semibold text-ink">
                      {g.items.map((item, ii) => (
                        <span key={item.name}>
                          {ii > 0 ? <Sep /> : null}
                          {item.name}
                        </span>
                      ))}
                    </p>
                  ) : (
                    <ul className="divide-y divide-line">
                      {g.items.map((item) => (
                        <li key={item.name} className="py-2.5">
                          <span className="block leading-snug font-semibold text-ink">{item.name}</span>
                          {item.note ? (
                            <span className="mt-0.5 block text-[0.9375rem] leading-snug text-muted">
                              {item.note}
                            </span>
                          ) : null}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
