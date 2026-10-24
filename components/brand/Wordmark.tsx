import { store } from "@/content/store";
import { cn } from "@/lib/cn";
import { RouteBadge } from "./RouteBadge";
import { Sep } from "./Sep";

/**
 * "[185] QUICK MART": the route plate stands in for the number, followed by the sign
 * lettering. On light backgrounds the lettering uses the logo color (brand red or pine,
 * see USE_BRAND_RED_IN_LOGO in lib/theme.ts); on dark sections it is white.
 * Decorative; wrap it in a link or heading that carries the real name.
 */
export function Lockup({ className, tone = "light" }: { className?: string; tone?: "light" | "dark" }) {
  return (
    <span className={cn("inline-flex items-center gap-[0.4em] whitespace-nowrap", className)}>
      <RouteBadge tone={tone} className="text-[0.92em]" />
      <span
        aria-hidden="true"
        className={cn(
          "type-display text-[1em] tracking-[-0.005em]",
          tone === "dark" ? "text-on-deep" : "sign-letters",
        )}
      >
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
