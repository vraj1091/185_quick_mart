import { Phone } from "lucide-react";
import { store } from "@/content/store";
import { cn } from "@/lib/cn";
import { fuelBoardState, type FuelSnapshot } from "@/lib/fuel";
import { Sep } from "@/components/brand/Sep";
import { buttonClass } from "@/components/ui/Button";
import { FuelFreshness } from "./FuelFreshness";
import { FuelUpdated } from "./FuelUpdated";
import { LedPrice } from "./LedPrice";

/*
 * Fuel price board, styled after the price pylon out front: dark pine header,
 * darkest-pine body, LED-green digits.
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
      className={cn("border-chrome bg-chrome rounded-md border-[6px] shadow-md", className)}
    >
      {/* The metal cabinet: chrome frame, then a thin dark inner line. */}
      <div className="on-dark border-deep-3 bg-deep-2 text-on-deep overflow-hidden rounded-[2px] border">
        <div className="bg-deep flex items-center justify-between gap-3 px-5 py-3.5 shadow-[inset_0_1px_0_color-mix(in_srgb,var(--color-on-deep)_6%,transparent)] sm:px-6">
          <Heading id={headingId} className="eyebrow text-on-deep">
            {title}
          </Heading>
          <p className="eyebrow text-on-deep-muted">
            {store.fuelBrand}
            <Sep />
            per gallon
          </p>
        </div>

        {state.fresh ? (
          <>
            <FuelFreshness staleAt={state.staleAtMs}>
              <div data-fuel-fresh>
                <dl data-odometer-group>
                  {state.rows.map((row) => (
                    <div
                      key={row.grade}
                      className={cn(
                        "border-on-deep/10 flex items-center justify-between gap-4 border-b px-5 sm:px-6",
                        size === "lg" ? "py-5" : "py-4",
                      )}
                    >
                      <dt className="eyebrow text-on-deep-muted flex items-center gap-3 text-[0.875rem]">
                        <span aria-hidden="true" className="bg-accent size-2.5 rounded-full" />
                        {row.label}
                      </dt>
                      <dd>
                        {row.price !== null ? (
                          <LedPrice price={row.price} size={size} />
                        ) : (
                          <a href={store.phone.href} className="link-store text-base">
                            Call for price
                          </a>
                        )}
                      </dd>
                    </div>
                  ))}
                </dl>
                <div className="flex justify-end px-5 pt-3 pb-4 sm:px-6">
                  <p className="bg-deep-3 text-on-deep-muted rounded-xs px-2.5 pt-1 pb-0.5 font-mono text-xs">
                    Updated <FuelUpdated at={state.updatedAtMs} />
                  </p>
                </div>
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
      </div>
    </section>
  );
}

function CallForPrice() {
  return (
    <div className="px-5 py-6 sm:px-6 sm:py-8">
      <p className="type-display text-[1.75rem] sm:text-[2rem]">Call for today’s price</p>
      <p className="text-on-deep-muted mt-3 max-w-md">
        Prices change often. Give us a call and we’ll read you what’s on the sign.
      </p>
      <a href={store.phone.href} className={buttonClass("inverse", "md", "mt-5")}>
        <Phone aria-hidden="true" strokeWidth={1.75} className="size-5" />
        Call <span className="tabular font-mono">{store.phone.display}</span>
      </a>
    </div>
  );
}
