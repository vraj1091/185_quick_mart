import { ArrowRight, Navigation, Phone } from "lucide-react";
import Link from "next/link";
import { AisleCard } from "@/components/aisles/AisleCard";
import { RouteBadge } from "@/components/brand/RouteBadge";
import { Sep } from "@/components/brand/Sep";
import { CaptionStrip } from "@/components/brand/ShelfEdge";
import { Tagline } from "@/components/brand/Wordmark";
import { DealTag } from "@/components/deals/DealTag";
import { FuelBoard } from "@/components/fuel/FuelBoard";
import { InfoRail } from "@/components/home/InfoRail";
import { RoadDivider } from "@/components/brand/RoadLine";
import { buttonClass } from "@/components/ui/Button";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { StorePhoto } from "@/components/ui/StorePhoto";
import { VisitBlock } from "@/components/visit/VisitBlock";
import { getAisle, homeAisleSlugs } from "@/content/aisles";
import { photos } from "@/content/images";
import { store } from "@/content/store";
import { getCurrentDeals, getFuelPrices, getSchedule, getSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: `${store.name} | BP Gas, Fried Chicken & Lottery on Hwy 185, Bowling Green KY`,
  absoluteTitle: true,
  description:
    "BP gas and diesel, Perfectly Southern fried chicken, Hunt Brothers Pizza, coffee, slushies, an ATM, air, bagged ice, and Kentucky Lottery cashing up to $5,000 on Highway 185 in Bowling Green, KY.",
  path: "/",
});

/** Grid placement for the home aisle cards (4 columns on large screens, no gaps). */
const aisleLayout: Record<(typeof homeAisleSlugs)[number], string> = {
  "chilled-drinks": "col-span-2 lg:row-span-2",
  "health-wellness": "lg:row-span-2",
  "snacks-chips": "",
  candy: "",
  "ice-cream": "lg:row-span-2",
  "auto-care": "lg:col-span-2 lg:row-span-2",
  "t-shirts": "",
  "tobacco-smoke": "col-span-2 lg:col-span-1",
};

const services = [
  "ATM",
  "Air for tires",
  "Bagged ice",
  `Lottery cashing up to $${store.lottery.cashLimitDollars.toLocaleString("en-US")}`,
  "Coffee",
  "Slushies",
];

export default async function HomePage() {
  const [prices, schedule, deals, settings] = await Promise.all([
    getFuelPrices(),
    getSchedule(),
    getCurrentDeals(),
    getSettings(),
  ]);
  const cashLimit = `$${store.lottery.cashLimitDollars.toLocaleString("en-US")}`;

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="overflow-hidden">
        <div className="container-store grid gap-8 pt-5 pb-14 sm:pt-8 lg:grid-cols-[minmax(0,55fr)_minmax(0,45fr)] lg:items-center lg:gap-14 lg:pt-10 lg:pb-16">
        <div className="relative">
          {/* Huge outline "185" behind the headline, cropped by the section's top edge. */}
          <span
            aria-hidden="true"
            className="outline-numerals absolute -top-24 right-0 hidden text-[clamp(13rem,17vw,18rem)] md:block"
          >
            185
          </span>
          <p className="eyebrow relative flex items-center gap-3 text-muted">
            <RouteBadge className="text-[1.0625rem]" />
            <span>
              Highway 185
              <Sep />
              {store.address.city}, {store.address.region}
            </span>
          </p>
          <h1 className="type-display type-h1 relative mt-5">
            Gas, hot food <span className="text-accent-bright">&amp;</span> everything in between.
          </h1>
          <Tagline className="relative mt-5 text-accent" />
          <p className="measure relative mt-4 text-lg text-muted sm:text-xl">
            Fill up on BP, grab fried chicken or a Hunt Brothers slice, and pick up whatever else
            you forgot.
          </p>
          <div className="relative mt-7 flex flex-wrap gap-3">
            <a
              href={store.maps.directions}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("primary", "lg")}
            >
              <Navigation aria-hidden="true" strokeWidth={1.75} className="size-5" />
              Get Directions
            </a>
            <a href={store.phone.href} className={buttonClass("outline", "lg")}>
              <Phone aria-hidden="true" strokeWidth={1.75} className="size-5" />
              Call <span className="font-mono tabular">{store.phone.display}</span>
            </a>
          </div>
        </div>
        {/* Photo on a solid dark-pine block offset 16px (desktop), for depth without gradients. */}
        <figure className="offset-frame order-first lg:order-none lg:mr-4 lg:mb-4">
          <div className="overflow-hidden rounded-sm border border-line bg-surface shadow-lift">
            <StorePhoto
              photo={photos.storefrontDusk}
              cover
              preload
              sizes="(min-width: 1312px) 560px, (min-width: 1024px) 42vw, 100vw"
              className="aspect-[16/10] lg:aspect-[4/3.2]"
              position="35% 50%"
            />
            <CaptionStrip left="1341 Hwy 185" right={`${store.address.city}, ${store.address.region}`} />
          </div>
        </figure>
        </div>
      </section>

      {/* ---------- At a glance (overlaps the bottom of the hero) ---------- */}
      <div className="flow-root bg-surface-alt">
        <InfoRail schedule={schedule} prices={prices} />
      </div>

      {/* ---------- Fuel ---------- */}
      <section aria-labelledby="home-fuel" className="bg-surface-alt pt-10 pb-14 lg:pt-12 lg:pb-24">
        <div className="container-store grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
          <div className="lg:col-span-5">
            <p className="eyebrow road-under text-accent">At the pump</p>
            <h2 id="home-fuel" className="type-display type-h2 mt-3">
              Today’s gas prices
            </h2>
            <p className="mt-4 text-xl font-bold">BP fuel. Low prices. Diesel on site.</p>
            <p className="measure mt-3 text-muted">
              Regular, premium and diesel, straight from the board out front. Air for your tires,
              ice for your cooler, cash from the ATM while you’re here.
            </p>
            <Link href="/fuel" className="link-store mt-6 inline-flex items-center gap-2">
              Fuel & air details
              <ArrowRight aria-hidden="true" strokeWidth={1.75} className="size-4" />
            </Link>
          </div>
          <FuelBoard prices={prices} title="Pump prices" headingLevel="h3" className="lg:col-span-7" />
        </div>
      </section>

      {/* ---------- Hot food: dark pine band with the contour texture ---------- */}
      <section
        aria-labelledby="home-food"
        className="on-dark texture-contour bg-deep py-16 text-on-deep lg:py-24"
      >
        <div data-reveal className="container-store grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7 lg:pr-4">
            <figure className="offset-frame [--offset-color:var(--color-accent)]">
              <div className="overflow-hidden rounded-sm shadow-lift">
                <StorePhoto
                  photo={photos.storefrontSide}
                  cover
                  sizes="(min-width: 1024px) 58vw, 100vw"
                  className="aspect-[982/600]"
                />
                <CaptionStrip left="Look for the pizza sign" right="Hot food inside" />
              </div>
            </figure>
            <div className="mt-8 grid grid-cols-5 items-start gap-4 lg:mt-10 lg:gap-8">
              <div className="offset-frame col-span-3 [--offset-color:var(--color-accent)]">
                <StorePhoto
                  photo={photos.slushies}
                  cover
                  sizes="(min-width: 1024px) 34vw, 60vw"
                  className="aspect-[4/3] rounded-sm shadow-lift"
                />
              </div>
              <div className="offset-frame col-span-2 [--offset-color:var(--color-accent)]">
                <StorePhoto
                  photo={photos.coffeeBar}
                  cover
                  sizes="(min-width: 1024px) 23vw, 40vw"
                  className="aspect-[3/4] rounded-sm shadow-lift"
                  position="45% 50%"
                />
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 lg:pt-6">
            {/* Bright fern is too faint for small text on dark pine (3.7:1), so this eyebrow uses on-deep-muted. */}
            <p className="eyebrow road-under text-on-deep-muted">Hot food & drinks</p>
            <h2 id="home-food" className="type-display type-h2 mt-3 text-on-deep">
              Fried chicken. Pizza. Fresh coffee.
            </h2>
            <div className="mt-5 space-y-4 text-lg text-on-deep-muted">
              <p>
                <strong className="text-on-deep">Perfectly Southern</strong> fried chicken and{" "}
                <strong className="text-on-deep">Hunt Brothers</strong> pizza, made right here. Want it
                hot out of the fryer? Just ask at the counter.
              </p>
              <p>
                Fresh coffee on, every morning. Slushies in strawberry, watermelon, mango and sour
                apple, and a full fountain at the Beverage Bay.
              </p>
            </div>
            {!settings.hotFoodOn ? (
              <p className="mt-5 rounded-sm border-l-4 border-accent bg-accent-soft px-4 py-3 font-semibold text-ink">
                The kitchen is closed right now. Call before you come for chicken or pizza.
              </p>
            ) : null}
            <Link href="/food" className={buttonClass("inverse", "md", "mt-7")}>
              See food & drinks
              <ArrowRight aria-hidden="true" strokeWidth={1.75} className="size-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------- The wall above the counter ---------- */}
      <figure>
        <StorePhoto
          photo={photos.interiorBand}
          cover
          sizes="100vw"
          className="aspect-[2.1/1] w-full sm:aspect-[3/1] lg:aspect-[1470/380]"
          position="6% 100%"
        />
        <CaptionStrip
          className="px-4 sm:px-6 lg:px-10"
          left="Inside the store"
          right="Above the register"
        />
      </figure>

      {/* ---------- Aisles ---------- */}
      <section aria-labelledby="home-aisles" className="container-store py-16 lg:py-24">
        <div data-reveal className="flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            id="home-aisles"
            eyebrow={store.supportLine}
            title="Aisle by aisle"
            intro="Cold drinks, snacks, medicine, motor oil, even a clean T-shirt. If you forgot it at home, check here first."
          />
          <Link href="/store" className="link-store inline-flex items-center gap-2">
            Walk the whole store
            <ArrowRight aria-hidden="true" strokeWidth={1.75} className="size-4" />
          </Link>
        </div>
        <ul
          data-reveal
          data-reveal-stagger
          className="mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-flow-dense lg:auto-rows-[15.5rem] lg:grid-cols-4"
        >
          {homeAisleSlugs.map((slug) => {
            const aisle = getAisle(slug);
            return (
              <li key={slug} className={aisleLayout[slug]}>
                <AisleCard
                  aisle={aisle}
                  href={`/store#${aisle.slug}`}
                  fill
                  sizes={
                    aisleLayout[slug].includes("col-span-2")
                      ? "(min-width: 1024px) 50vw, 100vw"
                      : "(min-width: 1024px) 25vw, 50vw"
                  }
                />
              </li>
            );
          })}
        </ul>
      </section>

      {/* ---------- Services ---------- */}
      <section aria-labelledby="home-services" className="border-y border-line bg-surface-alt">
        <div data-reveal className="container-store flex flex-col gap-3 py-7 lg:flex-row lg:items-center lg:gap-10">
          <h2 id="home-services" className="eyebrow shrink-0 text-accent">
            Also at the store
          </h2>
          <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-lg font-bold sm:flex sm:flex-wrap sm:text-xl">
            {services.map((s, i) => (
              <li key={s} className="flex items-center gap-4">
                {i > 0 ? (
                  <span aria-hidden="true" className="hidden text-primary sm:inline">
                    ·
                  </span>
                ) : null}
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ---------- Lottery ---------- */}
      <section aria-labelledby="home-lottery" className="container-store py-16 lg:py-24">
        <div
          data-reveal
          className="on-dark texture-contour grid overflow-hidden rounded-md bg-deep text-on-deep lg:grid-cols-12"
        >
          <div className="p-6 sm:p-10 lg:col-span-8 lg:p-14">
            <p className="flex flex-wrap items-center gap-3">
              <span className="type-display rounded-sm bg-surface px-3 pt-2.5 pb-1.5 text-[1.75rem] text-primary">
                {cashLimit}
              </span>
              <span className="eyebrow text-on-deep-muted">Kentucky Lottery cashing</span>
            </p>
            <h2 id="home-lottery" className="type-display type-h2 mt-6">
              Won? Cash it here.
            </h2>
            <p className="measure mt-4 text-lg text-on-deep-muted">
              Won a scratch-off? Cash it right here, up to {cashLimit}. Buy tickets, scratch-offs
              and draw games at the counter or the self-serve lottery machine.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link href="/lottery" className={buttonClass("outline-light")}>
                How cashing works
              </Link>
              <p className="text-sm text-on-deep-muted">
                Must be 18 or older to play. Please play responsibly.
              </p>
            </div>
          </div>
          <StorePhoto
            photo={photos.lottery}
            cover
            sizes="(min-width: 1024px) 34vw, 100vw"
            className="aspect-[4/3] lg:col-span-4 lg:aspect-auto lg:min-h-full"
            position="50% 0%"
          />
        </div>
      </section>

      {/* ---------- Deals (only when the owner has posted some) ---------- */}
      {deals.length > 0 ? (
        <section aria-labelledby="home-deals" className="container-store pb-16 lg:pb-24">
          <RoadDivider className="mb-14 lg:mb-20" />
          <SectionHeading
            id="home-deals"
            eyebrow="On the shelf now"
            title="This week’s deals"
            intro="Deals change. These are on the shelf right now."
          />
          <ul data-reveal data-reveal-stagger className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {deals.map((deal) => (
              <li key={deal.id}>
                <DealTag deal={deal} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ---------- Visit ---------- */}
      <VisitBlock schedule={schedule} />
    </>
  );
}
