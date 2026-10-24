import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { CaptionStrip } from "@/components/brand/ShelfEdge";
import { FuelBoard } from "@/components/fuel/FuelBoard";
import { buttonClass } from "@/components/ui/Button";
import { StorePhoto } from "@/components/ui/StorePhoto";
import { photos } from "@/content/images";
import { store } from "@/content/store";
import { getFuelPrices } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Gas Prices: BP Regular, Premium & Diesel on Hwy 185, Bowling Green",
  description:
    "Today's BP gas prices at 185 Quick Mart on Highway 185 in Bowling Green, KY: regular, premium and diesel. Air for tires and bagged ice on site.",
  path: "/fuel",
});

const grades = [
  { name: "Regular", text: "Everyday unleaded for most cars, trucks and mowers." },
  { name: "Premium", text: "Higher octane for engines that call for it." },
  { name: "Diesel", text: "Diesel on site for pickups and work trucks." },
];

export default async function FuelPage() {
  const prices = await getFuelPrices();

  const faqs: { q: string; a: React.ReactNode }[] = [
    {
      q: "Do you have diesel?",
      a: "Yes. Diesel is on site, along with regular and premium.",
    },
    {
      q: "Is there air for tires?",
      a: "Yes, there’s an air machine at the store. Ask at the counter if you need a hand.",
    },
    ...(store.fuel.payAtPump !== null
      ? [
          {
            q: "Can I pay at the pump?",
            a: store.fuel.payAtPump
              ? "Yes, you can pay with a card right at the pump, or come inside."
              : "Please pay inside at the counter.",
          },
        ]
      : []),
    {
      q: "How current are the prices on this page?",
      a: (
        <>
          We post them when we change the sign, and you’ll see the time they were updated. If a
          price is more than two days old we take it down and ask you to call, so you never drive
          over for a price that’s gone. Call{" "}
          <a href={store.phone.href} className="link-store font-mono tabular">
            {store.phone.display}
          </a>{" "}
          any time.
        </>
      ),
    },
  ];

  return (
    <>
      <section className="container-store grid gap-10 pt-10 pb-14 lg:grid-cols-12 lg:items-center lg:gap-14 lg:pt-16 lg:pb-20">
        <div className="lg:col-span-5">
          <p className="eyebrow road-under text-accent">BP fuel on Highway 185</p>
          <h1 className="type-display type-h1 mt-4">Fuel & prices</h1>
          <p className="measure mt-5 text-lg sm:text-xl">
            Low prices at the pump on regular, premium and diesel. Air for your tires and ice for
            your cooler while you’re here.
          </p>
          <a href={store.phone.href} className={buttonClass("outline", "md", "mt-7")}>
            <Phone aria-hidden="true" strokeWidth={1.75} className="size-5" />
            Call <span className="font-mono tabular">{store.phone.display}</span>
          </a>
        </div>
        <FuelBoard
          id="prices"
          prices={prices}
          title="Today’s prices"
          size="lg"
          className="scroll-mt-6 lg:col-span-7"
        />
      </section>

      <figure data-reveal className="container-store">
        <StorePhoto
          photo={photos.fuelCanopy}
          cover
          preload
          sizes="(min-width: 1312px) 1232px, 100vw"
          className="aspect-[16/10] rounded-t-sm sm:aspect-[2.2/1]"
          position="50% 62%"
        />
        <CaptionStrip left="The BP pumps" right="1341 Hwy 185" />
      </figure>

      <section aria-labelledby="grades" className="container-store py-16 lg:py-24">
        <div data-reveal className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <p className="eyebrow road-under text-accent">At the pump</p>
            <h2 id="grades" className="type-display type-h2 mt-3">
              Three grades
            </h2>
          </div>
          <dl className="divide-y divide-line border-y border-line lg:col-span-8">
            {grades.map((g) => (
              <div key={g.name} className="grid gap-1 py-5 sm:grid-cols-[12rem_1fr] sm:gap-6">
                <dt className="flex items-center gap-3 text-xl font-extrabold uppercase">
                  <span aria-hidden="true" className="size-2.5 rounded-full bg-accent" />
                  {g.name}
                </dt>
                <dd className="text-lg text-muted">{g.text}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="while-here" className="border-y border-line bg-surface-alt py-16 lg:py-20">
        <div className="container-store grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <h2 id="while-here" className="type-display type-h2">
              While you’re here
            </h2>
          </div>
          <ul className="space-y-6 text-lg lg:col-span-8">
            <li>
              <strong className="block text-xl">Air for your tires</strong>
              <span className="text-muted">Check them while you fill up.</span>
            </li>
            <li>
              <strong className="block text-xl">Bagged ice</strong>
              <span className="text-muted">From the ice chest out front, for the cooler or the party.</span>
            </li>
            <li>
              <strong className="block text-xl">Oil, fluids and gas cans</strong>
              <span className="text-muted">
                Motor oil, washer fluid, DEF and more in the{" "}
                <Link href="/store#auto-care" className="link-store">
                  Auto Care aisle
                </Link>
                .
              </span>
            </li>
            <li>
              <strong className="block text-xl">ATM inside</strong>
              <span className="text-muted">Cash when you need it.</span>
            </li>
          </ul>
        </div>
      </section>

      <section aria-labelledby="fuel-faq" className="container-store py-16 lg:py-24">
        <div data-reveal className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-5">
            <h2 id="fuel-faq" className="type-display type-h2">
              Fuel questions
            </h2>
          </div>
          <div className="lg:col-span-7">
            {faqs.map((f) => (
              <details key={f.q} className="group border-b border-line first:border-t">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-4 text-lg font-bold [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <span
                    aria-hidden="true"
                    className="font-mono text-2xl leading-none text-accent group-open:rotate-45 motion-safe:transition-transform"
                  >
                    +
                  </span>
                </summary>
                <div className="measure pb-5 text-lg text-muted">{f.a}</div>
              </details>
            ))}
            <Link href="/visit" className="link-store mt-8 inline-flex items-center gap-2">
              Hours and directions
              <ArrowRight aria-hidden="true" strokeWidth={1.75} className="size-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
