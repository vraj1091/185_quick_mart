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
  bg: "#FFFFFF",
  /** Cards, raised light surfaces (separated by `line` borders, not shadows) */
  surface: "#FFFFFF",
  /** Mist: every other section, so long pages have rhythm */
  surfaceAlt: "#F2F7F3",
  /** Main text: near-black with a green undertone */
  ink: "#14201A",
  /** Secondary text: moss gray */
  muted: "#4F5D54",
  /** Borders, dividers: soft sage */
  line: "#D5E3D9",
  /** Pine: buttons, active nav, key links */
  primary: "#14532D",
  /** Darker pine: hover/pressed for primary */
  primaryHover: "#0E3B20",
  /** Text and icons on primary */
  onPrimary: "#FFFFFF",
  /** Fern: eyebrow labels, tagline, small highlights */
  accent: "#1F7A45",
  /** Bright fern: large text and graphics only (3.4:1 on white, too light for small text) */
  accentBright: "#2F9E5A",
  /** Very light tint for tags and chips */
  accentSoft: "#E3F0E7",
  /** Dark pine: footer, lottery panel, fuel board header */
  deep: "#0E3B20",
  /** Darkest surface: fuel board body */
  deep2: "#0B2416",
  /** Contour texture lines and borders inside dark sections */
  deep3: "#0A2A17",
  /** Main text on dark sections */
  onDeep: "#FFFFFF",
  /** Secondary text on dark sections */
  onDeepMuted: "#A7C4B0",
  /** Fuel price digits only (soft glow) */
  led: "#4ADE80",
  /** Sign-cabinet frame on the fuel board (decorative) */
  chrome: "#C9D2CD",
  /** The real store sign red. Logo wordmark only. */
  brandRed: "#B4232C",
  /** Form errors only */
  error: "#9F1D24",
} as const;

export type ThemeToken = keyof typeof palette;

/** surfaceAlt -> --surface-alt, deep2 -> --deep-2 */
export function cssVarName(token: string): string {
  return `--${token.replace(/([A-Z])/g, "-$1").replace(/(\d+)/g, "-$1").toLowerCase()}`;
}

/** The wordmark color, following USE_BRAND_RED_IN_LOGO. */
export const logoColor = USE_BRAND_RED_IN_LOGO ? palette.brandRed : palette.primary;

/** A theme color with transparency, for shadows and the share image. */
export function withAlpha(hex: string, alpha: number): string {
  const h = hex.replace("#", "");
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

/** Green-tinted elevation (never gray-blue), from the darkest pine. */
export const shadows = {
  sm: `0 1px 2px ${withAlpha(palette.deep3, 0.06)}`,
  md: `0 1px 2px ${withAlpha(palette.deep3, 0.06)}, 0 10px 24px -12px ${withAlpha(palette.deep3, 0.22)}`,
  lift: `0 2px 4px ${withAlpha(palette.deep3, 0.08)}, 0 18px 36px -16px ${withAlpha(palette.deep3, 0.3)}`,
} as const;

/** CSS variables for <html style>. */
export const themeStyle: Record<string, string> = {
  ...Object.fromEntries(Object.entries(palette).map(([k, v]) => [cssVarName(k), v])),
  "--logo": logoColor,
  "--theme-shadow-sm": shadows.sm,
  "--theme-shadow-md": shadows.md,
  "--theme-shadow-lift": shadows.lift,
};

/** Browser UI color (address bar on phones). */
export const browserThemeColor = palette.primary;

/** What each token is for (shown in /styleguide). */
export const tokenNotes: Record<ThemeToken, string> = {
  bg: "Page background",
  surface: "Cards, raised light surfaces",
  surfaceAlt: "Alternating light section background",
  ink: "Main text",
  muted: "Secondary text; form field borders",
  line: "Borders and dividers (decorative; form fields use muted for 3:1)",
  primary: "Buttons, active nav, key links",
  primaryHover: "Hover/pressed for primary",
  onPrimary: "Text and icons on primary",
  accent: "Eyebrow labels, tagline, small highlights",
  accentBright: "Large text and graphics only: the hero ampersand, road-line dashes",
  accentSoft: "Very light tint for tags and chips",
  deep: "Dark sections: footer, food band, lottery panel, fuel board header, notice strip",
  deep2: "Darkest surface: fuel board body",
  deep3: "Contour texture lines, borders and plates inside dark sections",
  onDeep: "Main text on dark sections",
  onDeepMuted: "Secondary text on dark sections",
  led: "Fuel price digits only",
  chrome: "Sign-cabinet frame on the fuel board (decorative)",
  brandRed: "Real sign red, logo wordmark only",
  error: "Form errors only",
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
