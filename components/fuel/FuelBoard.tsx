import { Phone } from "lucide-react";
import { store } from "@/content/store";
import { cn } from "@/lib/cn";
import { fuelBoardState, priceSpoken, splitPrice, type FuelSnapshot } from "@/lib/fuel";
import { Sep } from "@/components/brand/Sep";
import { buttonClass } from "@/components/ui/Button";
import { FuelFreshness } from "./FuelFreshness";
import { FuelUpdated } from "./FuelUpdated";

/*
 * Fuel price board, styled after the BP price pylon out front.
 *
 * Stale-price rule (never show a price older than 48 hours), enforced three ways:
 *  1. Server: prices already past 48 hours are never rendered.
 *  2. Inline script: hides prices before first paint if a cached page has gone stale.
 *  3. Client: FuelFreshness re-checks every minute and when the tab comes back.
 */

const STALE_SCRIPT =
  '(function(){var s=document.currentScript,e=s&&s.previousElementSibling;if(e&&Date.now()>=Number(e.getAttribute("data-stale-at")))e.setAttribute("data-stale","")})()';

type Props = {
  prices: FuelSnapshot;
  title?: string;
  headingLevel?: "h2" | "h3";
  size?: "md" | "lg";
  id?: string;
  className?: string;
};

export function FuelBoard({
  prices,
  title = "Gas prices",
  headingLevel: Heading = "h2",
  size = "md",
  id,
  className,
}: Props) {
  const state = fuelBoardState(prices.rows, prices.checkedAt);
  const headingId = `${id ?? "fuel-board"}-title`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={cn("on-dark overflow-hidden rounded-md bg-asphalt text-limestone", className)}
    >
      <div className="flex items-center justify-between gap-3 border-b border-white/10 px-5 py-3.5 sm:px-6">
        <Heading id={headingId} className="eyebrow text-limestone">
          {title}
        </Heading>
        <p className="eyebrow text-limestone/70">
          {store.fuelBrand}
          <Sep />
          per gallon
        </p>
      </div>

      {state.fresh ? (
        <>
          <FuelFreshness staleAt={state.staleAtMs}>
            <div data-fuel-fresh>
              <dl>
                {state.rows.map((row) => (
                  <div
                    key={row.grade}
                    className={cn(
                      "flex items-center justify-between gap-4 border-b border-white/10 px-5 sm:px-6",
                      size === "lg" ? "py-5" : "py-4",
                    )}
                  >
                    <dt className="eyebrow flex items-center gap-3 text-[0.875rem] text-limestone">
                      <span
                        aria-hidden="true"
                        className="size-2.5 rounded-full bg-canopy-green ring-1 ring-white/30"
                      />
                      {row.label}
                    </dt>
                    <dd>
                      {row.price !== null ? (
                        <PriceDigits price={row.price} size={size} />
                      ) : (
                        <a href={store.phone.href} className="link-store text-base">
                          Call for price
                        </a>
                      )}
                    </dd>
                  </div>
                ))}
              </dl>
              <p className="px-5 py-3 text-sm text-limestone/75 sm:px-6">
                Updated <FuelUpdated at={state.updatedAtMs} />
              </p>
            </div>
            <div data-fuel-fallback>
              <CallForPrice />
            </div>
          </FuelFreshness>
          <script dangerouslySetInnerHTML={{ __html: STALE_SCRIPT }} />
        </>
      ) : (
        <CallForPrice />
      )}
    </section>
  );
}

function PriceDigits({ price, size }: { price: number; size: "md" | "lg" }) {
  const { main, tenths } = splitPrice(price);
  return (
    <span
      className={cn(
        "price-led flex items-start font-mono leading-none font-semibold tabular",
        size === "lg"
          ? "text-[clamp(3rem,2.2rem+3.2vw,4.5rem)]"
          : "text-[clamp(2.5rem,2rem+2vw,3.5rem)]",
      )}
    >
      <span className="sr-only">{priceSpoken(price)}</span>
      <span aria-hidden="true">{main}</span>
      {tenths ? (
        <span
          aria-hidden="true"
          className="mt-[0.1em] ml-[0.08em] flex flex-col items-center text-[0.34em] leading-[1.1]"
        >
          <span>{tenths}</span>
          <span className="border-t-2 border-current px-[0.08em]">10</span>
        </span>
      ) : null}
    </span>
  );
}

function CallForPrice() {
  return (
    <div className="px-5 py-6 sm:px-6 sm:py-8">
      <p className="type-display text-[1.75rem] sm:text-[2rem]">Call for today’s price</p>
      <p className="mt-3 max-w-md text-limestone/80">
        Prices change often. Give us a call and we’ll read you what’s on the sign.
      </p>
      <a href={store.phone.href} className={buttonClass("primary", "md", "mt-5")}>
        <Phone aria-hidden="true" strokeWidth={1.75} className="size-5" />
        Call <span className="font-mono tabular">{store.phone.display}</span>
      </a>
    </div>
  );
}
