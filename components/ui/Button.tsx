import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "outline" | "outline-light" | "dark";
export type ButtonSize = "md" | "lg";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-sign-red text-white hover:bg-ember active:bg-ember",
  outline: "border-2 border-asphalt text-asphalt hover:bg-asphalt hover:text-limestone",
  "outline-light": "border-2 border-limestone/80 text-limestone hover:bg-limestone hover:text-asphalt",
  dark: "bg-asphalt text-limestone hover:bg-asphalt-2",
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
