import { cn } from "@/lib/cn";

/**
 * Original "185" route plate. Light: white plate, ink border. Dark sections: inverted,
 * a pine plate with a white border. Deliberately not a copy of an official highway shield.
 */
export function RouteBadge({
  className,
  label = "185",
  tone = "light",
}: {
  className?: string;
  label?: string;
  tone?: "light" | "dark";
}) {
  return (
    <span
      aria-hidden="true"
      className={cn(
        "inline-flex items-center justify-center rounded-[0.22em] border-[0.11em] px-[0.32em] pt-[0.12em] pb-[0.04em] font-sans leading-none font-extrabold tabular",
        tone === "dark" ? "border-on-primary bg-primary text-on-primary" : "border-ink bg-surface text-ink",
        className,
      )}
    >
      {label}
    </span>
  );
}
