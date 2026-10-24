import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline" | "outline-light" | "dark";
export type ButtonSize = "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-primary text-on-primary hover:bg-primary-hover active:bg-primary-hover",
  outline: "border-2 border-ink text-ink hover:bg-ink hover:text-on-deep",
  "outline-light": "border-2 border-on-deep/80 text-on-deep hover:bg-on-deep hover:text-ink",
  dark: "bg-deep text-on-deep hover:bg-deep-2",
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
