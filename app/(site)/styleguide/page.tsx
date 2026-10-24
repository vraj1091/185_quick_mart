import { Navigation, Phone } from "lucide-react";
import type { Metadata } from "next";
import { AisleCard } from "@/components/aisles/AisleCard";
import { RoadDivider } from "@/components/brand/RoadLine";
import { RouteBadge } from "@/components/brand/RouteBadge";
import { CaptionStrip, ShelfEdge } from "@/components/brand/ShelfEdge";
import { Lockup, Tagline } from "@/components/brand/Wordmark";
import { DealTag } from "@/components/deals/DealTag";
import { FuelBoard } from "@/components/fuel/FuelBoard";
import { InfoRail } from "@/components/home/InfoRail";
import { HoursTable, HoursTimelineCompact } from "@/components/hours/HoursTable";
import { OpenNowPill } from "@/components/hours/OpenNowPill";
import { buttonClass, type ButtonState, type ButtonVariant } from "@/components/ui/Button";
import { fieldClass } from "@/components/ui/fields";
import { getAisle } from "@/content/aisles";
import { cn } from "@/lib/cn";
import { exampleFuelSnapshot, type FuelSnapshot } from "@/lib/fuel";
import type { DayHours, Schedule } from "@/lib/hours";
import {
  USE_BRAND_RED_IN_LOGO,
  contrastRatio,
  cssVarName,
  palette,
  shadows,
  tokenNotes,
  type ThemeToken,
} from "@/lib/theme";

// Hidden internal page: every color token and component. Not linked, not indexed.
export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

/** Text/background pairs used on the site, with the WCAG AA minimum each must meet. */
const pairs: { fg: ThemeToken; bg: ThemeToken; use: string; min: number }[] = [
  { fg: "ink", bg: "bg", use: "Body text", min: 4.5 },
  { fg: "ink", bg: "surfaceAlt", use: "Body text on alternate sections", min: 4.5 },
  { fg: "muted", bg: "bg", use: "Secondary text", min: 4.5 },
  { fg: "muted", bg: "surfaceAlt", use: "Secondary text on alternate sections", min: 4.5 },
  { fg: "muted", bg: "surface", use: "Form field borders (UI component)", min: 3 },
  { fg: "primary", bg: "bg", use: "Links, outline buttons", min: 4.5 },
  { fg: "primary", bg: "surfaceAlt", use: "Links on alternate sections", min: 4.5 },
  { fg: "onPrimary", bg: "primary", use: "Button text", min: 4.5 },
  { fg: "onPrimary", bg: "primaryHover", use: "Button text, hovered", min: 4.5 },
  { fg: "accent", bg: "bg", use: "Eyebrow labels, tagline", min: 4.5 },
  { fg: "accent", bg: "surfaceAlt", use: "Eyebrows on alternate sections", min: 4.5 },
  { fg: "accentBright", bg: "bg", use: "Hero ampersand (large text only)", min: 3 },
  { fg: "primary", bg: "accentSoft", use: "Chips, open-now pill, aisle numbers", min: 4.5 },
  { fg: "onDeep", bg: "deep", use: "Text on dark sections", min: 4.5 },
  { fg: "onDeep", bg: "deep2", use: "Text on the fuel board", min: 4.5 },
  { fg: "onDeepMuted", bg: "deep", use: "Secondary text and eyebrows on dark sections", min: 4.5 },
  { fg: "onDeepMuted", bg: "deep2", use: "Fuel board labels", min: 4.5 },
  { fg: "onDeepMuted", bg: "deep3", use: "\"Updated\" stamp plate", min: 4.5 },
  { fg: "led", bg: "deep2", use: "Fuel price digits (large)", min: 3 },
  { fg: "primary", bg: "onDeep", use: "Inverse (white) buttons on dark", min: 4.5 },
  { fg: "brandRed", bg: "bg", use: "Logo wordmark, red version (large)", min: 3 },
  { fg: "primary", bg: "bg", use: "Logo wordmark, green version (large)", min: 3 },
  { fg: "error", bg: "bg", use: "Form error text", min: 4.5 },
];

const varOf = (t: ThemeToken) => `var(${cssVarName(t)})`;

const buttonStates: { label: string; state?: ButtonState; extra?: string; disabled?: boolean }[] = [
  { label: "Rest" },
  { label: "Hover", state: "hover" },
  { label: "Pressed", state: "active" },
  { label: "Keyboard focus", extra: "[outline:2px_solid_var(--focus-ring)] [outline-offset:2px]" },
  { label: "Disabled", disabled: true },
];

function ButtonRow({ variant, icon }: { variant: ButtonVariant; icon?: boolean }) {
  return (
    <div className="flex flex-wrap items-end gap-4">
      {buttonStates.map((s) => (
        <div key={s.label} className="space-y-2">
          <p className="font-mono text-xs opacity-80">{s.label}</p>
          <button type="button" disabled={s.disabled} className={buttonClass(variant, "md", s.extra, s.state)}>
            {icon ? <Navigation aria-hidden="true" strokeWidth={1.75} className="size-5" /> : null}
            {variant}
          </button>
        </div>
      ))}
    </div>
  );
}

export default function StyleguidePage() {
  // Example data for previews only. Never real prices or hours.
  const freshPrices = exampleFuelSnapshot(1);
  const stalePrices = exampleFuelSnapshot(49);
  const notSet: FuelSnapshot = {
    checkedAt: freshPrices.checkedAt,
    rows: freshPrices.rows.map((r) => ({ ...r, price: null, updatedAt: null })),
  };
  const everyDay = (h: DayHours): Schedule => ({ weekly: Array.from({ length: 7 }, () => h), special: [] });
  const openSchedule = everyDay({ kind: "open24" });
  const closedSchedule = everyDay({ kind: "closed" });
  const exampleWeek: Schedule = {
    weekly: [
      { kind: "open", opens: "07:00", closes: "22:00" },
      ...Array.from({ length: 5 }, () => ({ kind: "open" as const, opens: "05:00", closes: "23:00" })),
      { kind: "open", opens: "06:00", closes: "01:00" },
    ],
    special: [],
  };

  return (
    <div className="space-y-16 pb-16">
      <header className="container-store pt-12">
        <p className="eyebrow road-under text-accent">Internal</p>
        <h1 className="type-display type-h1 mt-3">Style guide</h1>
        <p className="measure mt-3 text-muted">
          Every color comes from <code className="font-mono">lib/theme.ts</code>. Example data on
          this page is for previews only. Logo color: {USE_BRAND_RED_IN_LOGO ? "brand red" : "primary green"}{" "}
          (<code className="font-mono">USE_BRAND_RED_IN_LOGO = {String(USE_BRAND_RED_IN_LOGO)}</code>).
        </p>
      </header>

      <section className="container-store space-y-5">
        <h2 className="type-display type-h3">Color tokens</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(Object.keys(palette) as ThemeToken[]).map((token) => (
            <li key={token} className="overflow-hidden rounded-sm border border-line bg-surface">
              <div className="h-16 border-b border-line" style={{ background: varOf(token) }} />
              <div className="p-3 text-sm">
                <p className="font-bold">{cssVarName(token)}</p>
                <p className="font-mono">{palette[token]}</p>
                <p className="text-muted">{tokenNotes[token]}</p>
                <p className="mt-1 font-mono text-xs text-muted">
                  vs white {contrastRatio(palette[token], palette.bg).toFixed(2)}:1 · vs deep{" "}
                  {contrastRatio(palette[token], palette.deep).toFixed(2)}:1
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-store space-y-5">
        <h2 className="type-display type-h3">Contrast checks (WCAG AA)</h2>
        <div className="overflow-x-auto rounded-sm border border-line">
          <table className="w-full border-collapse bg-surface text-left text-sm">
            <thead className="bg-surface-alt">
              <tr>
                <th className="p-3">Sample</th>
                <th className="p-3">Text / background</th>
                <th className="p-3">Used for</th>
                <th className="p-3 text-right">Ratio</th>
                <th className="p-3">AA</th>
              </tr>
            </thead>
            <tbody>
              {pairs.map((p) => {
                const ratio = contrastRatio(palette[p.fg], palette[p.bg]);
                const pass = ratio >= p.min;
                return (
                  <tr key={`${p.fg}-${p.bg}-${p.use}`} className="border-t border-line">
                    <td className="p-3">
                      <span
                        className="inline-block rounded-xs px-2 py-1 font-bold"
                        style={{ color: varOf(p.fg), background: varOf(p.bg) }}
                      >
                        Aa 185
                      </span>
                    </td>
                    <td className="p-3 font-mono text-xs">
                      {cssVarName(p.fg)} on {cssVarName(p.bg)}
                    </td>
                    <td className="p-3">{p.use}</td>
                    <td className="p-3 text-right font-mono tabular">{ratio.toFixed(2)}:1</td>
                    <td className={cn("p-3 font-bold", pass ? "text-ink" : "text-error")}>
                      {pass ? `Pass (≥${p.min})` : `FAIL (needs ${p.min})`}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <section className="container-store space-y-5">
        <h2 className="type-display type-h3">Shadows</h2>
        <p className="measure text-muted">Green-tinted, built from deep-3 in lib/theme.ts. Never gray-blue.</p>
        <div className="grid gap-6 sm:grid-cols-3">
          {(["sm", "md", "lift"] as const).map((k) => (
            <div
              key={k}
              className={cn(
                "rounded-sm border border-line bg-surface p-5",
                k === "sm" && "shadow-sm",
                k === "md" && "shadow-md",
                k === "lift" && "shadow-lift",
              )}
            >
              <p className="font-bold">shadow-{k}</p>
              <p className="mt-1 font-mono text-xs break-words text-muted">{shadows[k]}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-store space-y-5">
        <h2 className="type-display type-h3">Type</h2>
        <p className="type-display type-h1">
          Display H1 <span className="text-accent-bright">&amp;</span>
        </p>
        <p className="type-display type-h2">Display H2</p>
        <p className="type-display type-h3">Display H3</p>
        <p className="eyebrow road-under text-accent">Eyebrow with road line</p>
        <Tagline className="text-accent" />
        <p className="measure text-lg">
          Body copy in Overpass, based on Highway Gothic. <span className="text-muted">Muted text.</span>{" "}
          <a href="#" className="link-store">
            A link
          </a>
        </p>
        <p className="font-mono text-2xl font-semibold tabular">(270) 599-1126 · 5:30 AM</p>
      </section>

      <section className="container-store space-y-5">
        <h2 className="type-display type-h3">Logo options</h2>
        <p className="measure text-muted">
          Set <code className="font-mono">USE_BRAND_RED_IN_LOGO</code> in lib/theme.ts. Red appears
          nowhere else on the site. On dark sections the wordmark is always white.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {(
            [
              ["brandRed", "true: brand red (the real sign)"],
              ["primary", "false: pine green"],
            ] as const
          ).map(([token, label]) => (
            <div key={token} className="rounded-sm border border-line bg-surface p-5">
              <span className="inline-flex items-center gap-[0.4em] text-[2rem] whitespace-nowrap">
                <RouteBadge className="text-[0.92em]" />
                <span className="type-display" style={{ color: varOf(token) }}>
                  Quick Mart
                </span>
              </span>
              <p className="mt-3 font-mono text-sm text-muted">USE_BRAND_RED_IN_LOGO = {label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ---------- Components on light ---------- */}
      <section className="border-y border-line bg-bg py-12">
        <div className="container-store space-y-10">
          <h2 className="type-display type-h3">Components on light</h2>
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-[1.5rem]">
              <Lockup />
            </span>
            <RouteBadge className="text-3xl" />
          </div>
          <div className="space-y-6">
            <ButtonRow variant="primary" icon />
            <ButtonRow variant="outline" icon />
          </div>
          <div className="flex flex-wrap gap-4">
            <OpenNowPill schedule={openSchedule} />
            <OpenNowPill schedule={closedSchedule} />
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <DealTag deal={{ id: "x", title: "2-liter bottles", priceText: "2 for $5", note: "Example only" }} />
            <AisleCard aisle={getAisle("candy")} href="#" sizes="33vw" />
            <AisleCard aisle={getAisle("tobacco-smoke")} href="#" sizes="33vw" />
          </div>
          <div className="max-w-md">
            <label htmlFor="sg-field" className="font-bold">
              Text field
            </label>
            <input id="sg-field" className={fieldClass} placeholder="Placeholder" />
            <label htmlFor="sg-field-error" className="mt-4 block font-bold">
              Field with an error
            </label>
            <input id="sg-field-error" className={fieldClass} aria-invalid="true" defaultValue="nope" />
            <p className="mt-1.5 font-semibold text-error">That doesn’t look like a phone number or email.</p>
          </div>
          <div className="space-y-3">
            <p className="font-bold">Road line (section divider)</p>
            <RoadDivider />
          </div>
          <div className="space-y-3">
            <p className="font-bold">Shelf edge and caption strip</p>
            <ShelfEdge />
            <CaptionStrip left="Caption strip" right="Right side" />
          </div>
          <div className="max-w-xl space-y-3">
            <p className="font-bold">Hours timeline (example week)</p>
            <HoursTable schedule={exampleWeek} specials={[]} />
          </div>
        </div>
      </section>

      <section className="flow-root bg-surface-alt pb-12">
        <div className="container-store pt-12">
          <h2 className="type-display type-h3">At-a-glance rail (example data)</h2>
          <p className="mt-2 text-muted">Example price and hours. On the site it reads the real data.</p>
        </div>
        <div className="mt-12">
          <InfoRail schedule={openSchedule} prices={freshPrices} />
        </div>
        <div className="mt-6">
          <InfoRail schedule={{ weekly: Array(7).fill(null), special: [] }} prices={notSet} />
        </div>
        <p className="container-store mt-3 text-sm text-muted">Second rail: no hours and no prices set.</p>
      </section>

      {/* ---------- Components on dark ---------- */}
      <section className="on-dark texture-contour bg-deep py-12 text-on-deep">
        <div className="container-store space-y-10">
          <h2 className="type-display type-h3">Components on dark (with the contour texture)</h2>
          <div className="flex flex-wrap items-center gap-6">
            <span className="text-[1.5rem]">
              <Lockup tone="dark" />
            </span>
            <RouteBadge tone="dark" className="text-3xl" />
            <span className="outline-numerals text-[8rem] [--numeral-stroke:var(--color-deep-3)]" aria-hidden="true">
              185
            </span>
          </div>
          <div className="space-y-6">
            <ButtonRow variant="inverse" />
            <ButtonRow variant="outline-light" />
          </div>
          <p className="measure">
            Text on dark. <span className="text-on-deep-muted">Muted text on dark.</span>{" "}
            <a href="#" className="link-store">
              A link on dark
            </a>
          </p>
          <div className="max-w-xs space-y-3">
            <p className="font-bold">Road line on dark and the compact timeline</p>
            <RoadDivider />
            <HoursTimelineCompact schedule={exampleWeek} />
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            <FuelBoard prices={freshPrices} title="Prices (example)" headingLevel="h3" id="sg-fresh" />
            <FuelBoard prices={stalePrices} title="Older than 48 hours" headingLevel="h3" id="sg-stale" />
            <FuelBoard prices={notSet} title="Never set" headingLevel="h3" id="sg-empty" />
          </div>
          <a href="tel:+12705991126" className={buttonClass("inverse")}>
            <Phone aria-hidden="true" strokeWidth={1.75} className="size-5" />
            Inverse with icon
          </a>
        </div>
      </section>
    </div>
  );
}
