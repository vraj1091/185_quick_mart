/**
 * THE theme file. Every color on the site comes from here. Nothing else in the
 * codebase may contain a color value.
 *
 * - Pages and components use these through Tailwind classes (`bg-surface`,
 *   `text-muted`, `border-line`, ...), which point at CSS variables set on <html>.
 * - The share image, icons and browser theme color read the hex values directly.
 *
 * Changing the site's colors is a one-file edit: change the values below.
 */

/** true: the "QUICK MART" wordmark uses the real sign red. false: it uses `primary`. */
export const USE_BRAND_RED_IN_LOGO = true;

export const palette = {
  /** Page background */
  bg: "#F3EEE4",
  /** Cards, raised light surfaces */
  surface: "#FBF9F4",
  /** Alternating light section background */
  surfaceAlt: "#FBF9F4",
  /** Main text */
  ink: "#1E2023",
  /** Secondary text */
  muted: "#5A5E63",
  /** Borders, dividers */
  line: "#D9D3C7",
  /** Buttons, active nav, key links */
  primary: "#B4232C",
  /** Hover/pressed for primary */
  primaryHover: "#8E1B22",
  /** Text and icons on primary */
  onPrimary: "#FFFFFF",
  /** Eyebrow labels, tagline, small highlights */
  accent: "#B4232C",
  /** Very light tint for tags and chips */
  accentSoft: "#FBF9F4",
  /** Dark sections: footer, fuel board, lottery panel */
  deep: "#1E2023",
  /** Raised surfaces inside dark sections */
  deep2: "#2B2E32",
  /** Main text on dark sections */
  onDeep: "#F3EEE4",
  /** Secondary text on dark sections */
  onDeepMuted: "#B3B0AA",
  /** Fuel price digits only */
  led: "#2FD06A",
  /** The real store sign red. Logo wordmark only. */
  brandRed: "#B4232C",
  /** Form errors only */
  danger: "#B4232C",
  /** Legacy (removed in the retheme): deal tags and the $5,000 badge */
  legacyHighlight: "#F2C230",
  /** Legacy (removed in the retheme): fuel grade dots */
  legacyFuelDot: "#0B6B3A",
} as const;

export type ThemeToken = keyof typeof palette;

/** surfaceAlt -> --surface-alt, deep2 -> --deep-2 */
export function cssVarName(token: string): string {
  return `--${token.replace(/([A-Z])/g, "-$1").replace(/(\d+)/g, "-$1").toLowerCase()}`;
}

/** The wordmark color, following USE_BRAND_RED_IN_LOGO. */
export const logoColor = USE_BRAND_RED_IN_LOGO ? palette.brandRed : palette.primary;

/** CSS variables for <html style>. */
export const themeStyle: Record<string, string> = {
  ...Object.fromEntries(Object.entries(palette).map(([k, v]) => [cssVarName(k), v])),
  "--logo": logoColor,
};

/** Browser UI color (address bar on phones). */
export const browserThemeColor = palette.deep;

/** A theme color with transparency, for places that can't use CSS variables (share image). */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** What each token is for (shown in /styleguide). */
export const tokenNotes: Record<ThemeToken, string> = {
  bg: "Page background",
  surface: "Cards, raised light surfaces",
  surfaceAlt: "Alternating light section background",
  ink: "Main text",
  muted: "Secondary text; form field borders",
  line: "Borders and dividers (decorative)",
  primary: "Buttons, active nav, key links",
  primaryHover: "Hover/pressed for primary",
  onPrimary: "Text and icons on primary",
  accent: "Eyebrow labels, tagline, small highlights",
  accentSoft: "Very light tint for tags and chips",
  deep: "Dark sections: footer, fuel board header, lottery panel",
  deep2: "Raised surfaces inside dark sections",
  onDeep: "Main text on dark sections",
  onDeepMuted: "Secondary text on dark sections",
  led: "Fuel price digits only",
  brandRed: "Real sign red, logo wordmark only",
  danger: "Form errors only",
  legacyHighlight: "Legacy: deal tags and $5,000 badge",
  legacyFuelDot: "Legacy: fuel grade dots",
};

/** WCAG contrast ratio between two hex colors, e.g. contrastRatio("#000", "#fff") = 21. */
export function contrastRatio(a: string, b: string): number {
  const lum = (hex: string) => {
    const h = hex.replace("#", "");
    const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
    const [r, g, bl] = [0, 2, 4].map((i) => {
      const c = parseInt(full.slice(i, i + 2), 16) / 255;
      return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r! + 0.7152 * g! + 0.0722 * bl!;
  };
  const [hi, lo] = [lum(a), lum(b)].sort((x, y) => y - x);
  return (hi! + 0.05) / (lo! + 0.05);
}
