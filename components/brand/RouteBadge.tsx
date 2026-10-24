import { cn } from "@/lib/cn";

/**
 * Original "185" route plate: black border on a white plate with a thin white rim.
 * Deliberately not a copy of an official highway shield.
 */
export function RouteBadge({
  className,
  label = "185",
}: {
  className?: string;
  label?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center rounded-[0.22em] border-[0.11em] border-ink bg-surface px-[0.32em] pt-[0.12em] pb-[0.04em] font-sans leading-none font-extrabold text-ink tabular shadow-[0_0_0_0.09em_var(--color-on-primary)]",
        className,
      )}
    >
      {label}
    </span>
  );
}
