import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { FuelFreshness } from "@/components/fuel/FuelFreshness";
import { OpenNowPill } from "@/components/hours/OpenNowPill";
import { store } from "@/content/store";
import { cn } from "@/lib/cn";
import { fuelBoardState, priceSpoken, splitPrice, type FuelSnapshot } from "@/lib/fuel";
import { hasWeeklyHours, type Schedule } from "@/lib/hours";

/*
 * "At a glance" rail under the hero: status, regular price, lottery cashing, address.
 * Same data and empty-state rules as the rest of the site: no hours means "Call for
 * hours"; a missing or 48-hour-old price means "Call for price". Never placeholder values.
 */

const STALE_SCRIPT =
  '(function(){var s=document.currentScript,e=s&&s.previousElementSibling;if(e&&Date.now()>=Number(e.getAttribute("data-stale-at")))e.setAttribute("data-stale","")})()';

const label = "eyebrow text-[0.75rem] text-muted";
const cell = "flex min-h-[7.5rem] flex-col gap-2 p-4 sm:p-5";

function CallLink({ children }: { children: React.ReactNode }) {
  return (
    <a href={store.phone.href} className="link-store text-[1.0625rem]">
      {children}
    </a>
  );
}

function RegularPrice({ prices }: { prices: FuelSnapshot }) {
  const state = fuelBoardState(prices.rows, prices.checkedAt);
  const regular = state.fresh ? (state.rows.find((r) => r.grade === "regular")?.price ?? null) : null;
  if (!state.fresh || regular === null) return <CallLink>Call for price</CallLink>;
  const { main, tenths } = splitPrice(regular);
  return (
    <>
      <FuelFreshness staleAt={state.staleAtMs}>
        <p data-fuel-fresh className="font-mono text-[1.75rem] leading-none font-semibold text-primary tabular">
          <span className="sr-only">Regular, {priceSpoken(regular)}</span>
          <span aria-hidden="true" className="inline-flex items-start">
            ${main}
            {tenths ? (
              <span className="mt-[0.08em] ml-[0.1em] inline-flex flex-col items-center text-[0.4em] leading-[1.1]">
                <span>{tenths}</span>
                <span className="border-t-[1.5px] border-current px-[0.08em]">10</span>
              </span>
            ) : null}
          </span>
        </p>
        <p data-fuel-fallback>
          <CallLink>Call for price</CallLink>
        </p>
      </FuelFreshness>
      <script dangerouslySetInnerHTML={{ __html: STALE_SCRIPT }} />
    </>
  );
}

export function InfoRail({ schedule, prices }: { schedule: Schedule; prices: FuelSnapshot }) {
  const cashLimit = `$${store.lottery.cashLimitDollars.toLocaleString("en-US")}`;
  return (
    <section aria-label="At a glance" className="container-store relative z-10 -mt-8">
      <dl className="grid grid-cols-2 overflow-hidden rounded-sm border border-line bg-surface shadow-md lg:grid-cols-4">
        <div className={cn(cell, "border-r border-b border-line lg:border-b-0")}>
          <dt className={label}>Right now</dt>
          <dd>
            {hasWeeklyHours(schedule) ? (
              <OpenNowPill schedule={schedule} stacked fallback={<CallLink>Call for hours</CallLink>} />
            ) : (
              <CallLink>Call for hours</CallLink>
            )}
          </dd>
        </div>
        <div className={cn(cell, "border-b border-line lg:border-r lg:border-b-0")}>
          <dt className={label}>Regular gas</dt>
          <dd>
            <RegularPrice prices={prices} />
          </dd>
        </div>
        <div className={cn(cell, "border-r border-line")}>
          <dt className={label}>Lottery</dt>
          <dd>
            <Link
              href="/lottery"
              className="text-[1.0625rem] leading-snug font-bold hover:text-primary focus-visible:text-primary"
            >
              Cash prizes up to {cashLimit}
            </Link>
          </dd>
        </div>
        <div className={cell}>
          <dt className={label}>Find us</dt>
          <dd className="space-y-1">
            <p className="text-[1.0625rem] leading-snug font-bold">1341 Hwy 185</p>
            <a
              href={store.maps.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex min-h-6 items-center gap-1 text-[0.9375rem] font-bold text-primary underline decoration-2 underline-offset-4"
            >
              Directions
              <ArrowRight
                aria-hidden="true"
                strokeWidth={2}
                className="size-4 transition-transform group-hover:translate-x-[3px] group-focus-visible:translate-x-[3px]"
              />
            </a>
          </dd>
        </div>
      </dl>
    </section>
  );
}
