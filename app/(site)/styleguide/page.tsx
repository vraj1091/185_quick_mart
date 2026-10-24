import type { Metadata } from "next";
import { RouteBadge } from "@/components/brand/RouteBadge";
import { CaptionStrip, ShelfEdge } from "@/components/brand/ShelfEdge";
import { Lockup, Tagline } from "@/components/brand/Wordmark";
import { DealTag } from "@/components/deals/DealTag";
import { FuelBoard } from "@/components/fuel/FuelBoard";
import { OpenNowPill } from "@/components/hours/OpenNowPill";
import { buttonClass } from "@/components/ui/Button";
import { exampleFuelSnapshot } from "@/lib/fuel";
import type { Schedule } from "@/lib/hours";

// Hidden internal page: design tokens and components. Not linked, not indexed.
export const metadata: Metadata = {
  title: "Style guide",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

const colors = [
  ["asphalt", "#1E2023", "Header, footer, fuel board, body text"],
  ["asphalt-2", "#2B2E32", "Raised surfaces on dark"],
  ["sign-red", "#B4232C", "Brand: buttons, wordmark, links"],
  ["ember", "#8E1B22", "Red hover/pressed"],
  ["limestone", "#F3EEE4", "Page background"],
  ["bone", "#FBF9F4", "Cards, raised light surfaces"],
  ["concrete", "#D9D3C7", "Decorative borders, dividers"],
  ["slate", "#5A5E63", "Secondary text, input borders"],
  ["price-green", "#2FD06A", "Fuel price digits only"],
  ["canopy-green", "#0B6B3A", "Fuel grade dots only"],
  ["hi-vis", "#F2C230", "Deal tags and $5,000 badge only"],
] as const;

const swatch: Record<string, string> = {
  asphalt: "bg-asphalt",
  "asphalt-2": "bg-asphalt-2",
  "sign-red": "bg-sign-red",
  ember: "bg-ember",
  limestone: "bg-limestone",
  bone: "bg-bone",
  concrete: "bg-concrete",
  slate: "bg-slate",
  "price-green": "bg-price-green",
  "canopy-green": "bg-canopy-green",
  "hi-vis": "bg-hi-vis",
};

export default function StyleguidePage() {
  // Example data for previews only. Never real prices.
  const samplePrices = exampleFuelSnapshot(1);
  const stalePrices = exampleFuelSnapshot(49);
  const sampleSchedule: Schedule = {
    weekly: Array.from({ length: 7 }, () => ({ kind: "open" as const, opens: "05:00", closes: "23:00" })),
    special: [],
  };

  return (
    <div className="container-store space-y-16 py-12">
      <header>
        <p className="eyebrow text-sign-red">Internal</p>
        <h1 className="type-display type-h1 mt-3">Style guide</h1>
        <p className="mt-3 text-slate">Example data on this page is for previews only.</p>
      </header>

      <section className="space-y-4">
        <h2 className="type-display type-h3">Colors</h2>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {colors.map(([name, hex, use]) => (
            <li key={name} className="overflow-hidden rounded-sm border border-concrete bg-bone">
              <div className={`h-16 ${swatch[name]}`} />
              <div className="p-3 text-sm">
                <p className="font-bold">{name}</p>
                <p className="font-mono">{hex}</p>
                <p className="text-slate">{use}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="type-display type-h3">Type</h2>
        <p className="type-display type-h1">Display H1</p>
        <p className="type-display type-h2">Display H2</p>
        <p className="type-display type-h3">Display H3</p>
        <p className="eyebrow text-sign-red">Eyebrow label</p>
        <p className="measure text-lg">
          Body copy in Overpass, based on Highway Gothic. Friendly, quick, Kentucky-plain.
        </p>
        <p className="font-mono text-2xl font-semibold tabular">(270) 599-1126 · 5:30 AM</p>
      </section>

      <section className="space-y-6">
        <h2 className="type-display type-h3">Brand</h2>
        <div className="on-dark flex flex-wrap items-center gap-8 rounded-md bg-asphalt p-6 text-limestone">
          <span className="text-[1.5rem]">
            <Lockup />
          </span>
          <span className="text-[2.5rem]">
            <Lockup />
          </span>
          <RouteBadge className="text-3xl" />
        </div>
        <Tagline className="text-sign-red" />
        <ShelfEdge />
        <CaptionStrip left="Caption strip" right="Right side" />
      </section>

      <section className="space-y-4">
        <h2 className="type-display type-h3">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <button type="button" className={buttonClass("primary")}>Primary</button>
          <button type="button" className={buttonClass("outline")}>Outline</button>
          <button type="button" className={buttonClass("primary", "lg")}>Primary large</button>
        </div>
        <div className="on-dark flex flex-wrap gap-3 rounded-md bg-asphalt p-6">
          <button type="button" className={buttonClass("outline-light")}>Outline on dark</button>
          <button type="button" className={buttonClass("primary")}>Primary on dark</button>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div>
          <h2 className="type-display type-h3 mb-4">Fuel board: example data</h2>
          <FuelBoard prices={samplePrices} title="Example prices" headingLevel="h3" id="sg-fresh" />
        </div>
        <div>
          <h2 className="type-display type-h3 mb-4">Fuel board: older than 48 hours</h2>
          <FuelBoard prices={stalePrices} title="Example prices" headingLevel="h3" id="sg-stale" />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="type-display type-h3">Open-now pill (example 5 AM – 11 PM)</h2>
        <OpenNowPill schedule={sampleSchedule} />
      </section>

      <section className="space-y-4">
        <h2 className="type-display type-h3">Deal tag</h2>
        <div className="max-w-xs">
          <DealTag deal={{ id: "x", title: "2-liter bottles", priceText: "2 for $5", note: "Example only" }} />
        </div>
      </section>
    </div>
  );
}
