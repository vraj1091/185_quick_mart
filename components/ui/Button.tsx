import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline" | "outline-light" | "inverse";
export type ButtonSize = "md" | "lg";
/** Force a visual state (the style guide uses this); real buttons leave it unset. */
export type ButtonState = "hover" | "active";

type VariantClasses = { rest: string; interactive: string; hover: string; active: string };

/*
 * Buttons feel physical, like a sign panel: filled buttons sit on a solid edge that
 * compresses when pressed. Every hover effect also applies on :focus-visible.
 */
const variants: Record<ButtonVariant, VariantClasses> = {
  /** Pine fill on a darker pine edge. The main action on light backgrounds. */
  primary: {
    rest: "bg-primary text-on-primary shadow-[0_3px_0_var(--color-primary-hover)]",
    interactive:
      "hover:bg-primary-hover hover:shadow-[0_3px_0_var(--color-deep-2)] focus-visible:bg-primary-hover focus-visible:shadow-[0_3px_0_var(--color-deep-2)] active:translate-y-[2px] active:shadow-[0_1px_0_var(--color-deep-2)]",
    hover: "bg-primary-hover text-on-primary shadow-[0_3px_0_var(--color-deep-2)]",
    active: "translate-y-[2px] bg-primary-hover text-on-primary shadow-[0_1px_0_var(--color-deep-2)]",
  },
  /** Pine outline; fills with the soft tint on hover. */
  outline: {
    rest: "border-2 border-primary text-primary",
    interactive: "hover:bg-accent-soft focus-visible:bg-accent-soft active:translate-y-px",
    hover: "border-2 border-primary bg-accent-soft text-primary",
    active: "translate-y-px border-2 border-primary bg-accent-soft text-primary",
  },
  /** White outline on dark sections. */
  "outline-light": {
    rest: "border-2 border-on-deep text-on-deep",
    interactive:
      "hover:bg-on-deep hover:text-primary focus-visible:bg-on-deep focus-visible:text-primary active:translate-y-px",
    hover: "border-2 border-on-deep bg-on-deep text-primary",
    active: "translate-y-px border-2 border-on-deep bg-on-deep text-primary",
  },
  /** White fill on a chrome edge, for dark sections (a pine button would disappear there). */
  inverse: {
    rest: "bg-on-deep text-primary shadow-[0_3px_0_var(--color-chrome)]",
    interactive:
      "hover:bg-accent-soft focus-visible:bg-accent-soft active:translate-y-[2px] active:shadow-[0_1px_0_var(--color-chrome)]",
    hover: "bg-accent-soft text-primary shadow-[0_3px_0_var(--color-chrome)]",
    active: "translate-y-[2px] bg-accent-soft text-primary shadow-[0_1px_0_var(--color-chrome)]",
  },
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
  state?: ButtonState,
): string {
  const v = variants[variant];
  return cn(
    "inline-flex items-center justify-center gap-2 rounded-sm font-bold leading-tight no-underline select-none disabled:cursor-not-allowed disabled:opacity-60",
    "transition-[background-color,color,box-shadow,transform] duration-150 ease-out [&_svg]:transition-transform [&_svg]:duration-150",
    state ? v[state] : cn(v.rest, v.interactive, "hover:[&_svg]:translate-x-[3px] focus-visible:[&_svg]:translate-x-[3px]"),
    state === "hover" && "[&_svg]:translate-x-[3px]",
    sizes[size],
    className,
  );
}
