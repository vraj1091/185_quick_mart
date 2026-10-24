import { store } from "@/content/store";
import { cn } from "@/lib/cn";
import { RouteBadge } from "./RouteBadge";
import { Sep } from "./Sep";

/**
 * "[185] QUICK MART": the route plate stands in for the number, followed by the sign
 * lettering. Decorative; wrap it in a link or heading that carries the real name.
 */
export function Lockup({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-[0.4em] whitespace-nowrap", className)}>
      <RouteBadge className="text-[0.92em]" />
      <span aria-hidden="true" className="type-display sign-letters text-[1em] tracking-[-0.005em]">
        Quick Mart
      </span>
      <span className="sr-only">{store.name}</span>
    </span>
  );
}

/** "Quick · Clean · Kind" from the wall above the counter. */
export function Tagline({ className }: { className?: string }) {
  const [a, b, c] = store.tagline;
  return (
    <p className={cn("eyebrow tracking-[0.18em]", className)}>
      {a}
      <Sep />
      {b}
      <Sep />
      {c}
    </p>
  );
}
