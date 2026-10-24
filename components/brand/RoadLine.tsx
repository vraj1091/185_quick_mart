import { cn } from "@/lib/cn";

/**
 * Highway center line (28px dashes, 20px gaps) used as a section divider. Bright fern
 * on light sections, faded on dark ones (via --road-color). Decorative.
 */
export function RoadDivider({ className }: { className?: string }) {
  return <div aria-hidden="true" className={cn("road-line w-full", className)} />;
}
