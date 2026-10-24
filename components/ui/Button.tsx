import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline" | "outline-light" | "inverse";
export type ButtonSize = "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  /** Pine fill. The main action on light backgrounds. */
  primary: "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-hover",
  /** Pine outline on light backgrounds. */
  outline: "border-2 border-primary text-primary hover:bg-accent-soft active:bg-accent-soft",
  /** White outline on dark sections. */
  "outline-light": "border-2 border-on-deep text-on-deep hover:bg-on-deep hover:text-primary",
  /** White fill on dark sections (a pine button would disappear there). */
  inverse: "bg-on-deep text-primary hover:bg-accent-soft active:bg-accent-soft",
};

const sizes: Record<ButtonSize, string> = {
  md: "min-h-12 px-5 text-base",
  lg: "min-h-14 px-6 text-[1.0625rem]",
};

/** Class names for a button-styled <a>, <Link> or <button>. */
export function buttonClass(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-bold leading-tight no-underline select-none disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
}
