import Link from "next/link";
import { CaptionStrip } from "@/components/brand/ShelfEdge";
import { StorePhoto } from "@/components/ui/StorePhoto";
import { aisles, type Aisle } from "@/content/aisles";
import { photos } from "@/content/images";
import { store } from "@/content/store";
import { cn } from "@/lib/cn";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "In the Store: Drinks, Snacks, Health, Auto Care & More",
  description:
    "Aisle by aisle at 185 Quick Mart in Bowling Green, KY: cold drinks, chips, candy, snack cakes, jerky, medicine, motor oil, T-shirts, ice cream, plus an ATM.",
  path: "/store",
});

export default function StorePage() {
  return (
    <>
      <header className="container-store pt-10 pb-10 lg:pt-16 lg:pb-14">
        <p className="eyebrow text-accent">In the store</p>
        <h1 className="type-display type-h1 mt-4">{store.supportLine}.</h1>
        <p className="measure mt-5 text-lg sm:text-xl">
          Ten aisles of the things you stop for on the way to work or on the way home. Here’s what’s
          on the shelves.
        </p>
      </header>

      <nav aria-label="Aisles" className="container-store pb-12 lg:pb-16">
        <ol className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
          {aisles.map((a) => (
            <li key={a.slug}>
              <Link
                href={`#${a.slug}`}
                className="flex min-h-12 items-center gap-3 rounded-sm border border-line bg-surface px-3 py-2 text-ink hover:border-primary"
              >
                <span className="rounded-xs bg-accent-soft px-1.5 pt-0.5 font-mono text-sm font-semibold text-primary">{a.number}</span>
                <span className="text-[0.9375rem] leading-tight font-bold uppercase">{a.name}</span>
              </Link>
            </li>
          ))}
        </ol>
      </nav>

      {aisles.map((aisle, i) => (
        <AisleSection key={aisle.slug} aisle={aisle} flip={i % 2 === 1} />
      ))}

      <section aria-labelledby="services" className="container-store scroll-mt-6 py-14 lg:py-20" id="atm">
        <div className="grid gap-8 border-t border-line pt-14 lg:grid-cols-12 lg:gap-14">
          <figure className="lg:col-span-6">
            <StorePhoto
              photo={photos.atm}
              cover
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="aspect-[1264/675] rounded-t-sm"
            />
            <CaptionStrip left="ATM" right="Inside the store" />
          </figure>
          <div className="lg:col-span-6">
            <p className="eyebrow text-accent">Also inside</p>
            <h2 id="services" className="type-display type-h2 mt-3">
              ATM, ice, air & lottery
            </h2>
            <p className="measure mt-4 text-lg">
              Air for your tires, ice for your cooler, cash from the ATM. Kentucky Lottery tickets
              and{" "}
              <Link href="/lottery" className="link-store">
                prize cashing up to ${store.lottery.cashLimitDollars.toLocaleString("en-US")}
              </Link>{" "}
              at the counter.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

function AisleSection({ aisle, flip }: { aisle: Aisle; flip: boolean }) {
  const [main, second] = aisle.photos;

  if (!main) {
    return (
      <section id={aisle.slug} aria-labelledby={`${aisle.slug}-title`} className="container-store scroll-mt-6 py-10 lg:py-14">
        <div className="on-dark grid gap-6 rounded-md border-t-[3px] border-accent bg-deep p-6 text-on-deep sm:p-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="font-mono text-sm font-semibold tracking-wider text-on-deep-muted uppercase">
              Aisle {aisle.number}
            </p>
            <h2 id={`${aisle.slug}-title`} className="type-display type-h2 mt-2">
              {aisle.name}
            </h2>
          </div>
          <div className="text-lg lg:col-span-7">
            <p>{aisle.description}</p>
            {aisle.ageNotice ? (
              <p className="mt-4 flex items-start gap-3 rounded-sm border-2 border-on-deep px-3 py-2 font-bold">
                <span className="shrink-0 rounded-xs bg-on-deep px-1.5 pt-0.5 font-mono text-ink">21+</span>
                {aisle.ageNotice}
              </p>
            ) : null}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id={aisle.slug}
      aria-labelledby={`${aisle.slug}-title`}
      className={cn("scroll-mt-6 py-10 lg:py-14", flip && "bg-surface-alt")}
    >
      <div className="container-store grid gap-8 lg:grid-cols-12 lg:items-end lg:gap-14">
        <div className={cn("lg:col-span-7", flip && "lg:order-2")}>
          <figure>
            <StorePhoto
              photo={main}
              cover
              sizes="(min-width: 1024px) 58vw, 100vw"
              className={cn(
                "rounded-t-sm",
                main.height > main.width ? "aspect-[4/3] sm:aspect-[16/11]" : "aspect-[16/11]",
              )}
              position={main.height > main.width ? "50% 35%" : undefined}
            />
            <CaptionStrip left={`Aisle ${aisle.number}`} right={aisle.name} />
          </figure>
        </div>
        <div className={cn("lg:col-span-5", flip && "lg:order-1")}>
          <p className="font-mono text-sm font-semibold tracking-wider text-accent uppercase">
            Aisle {aisle.number}
          </p>
          <h2 id={`${aisle.slug}-title`} className="type-display type-h2 mt-2">
            {aisle.name}
          </h2>
          <p className="measure mt-4 text-lg">{aisle.description}</p>
          {second ? (
            <StorePhoto
              photo={second}
              cover
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="mt-6 aspect-[16/10] rounded-sm"
              position={second.height > second.width ? "50% 30%" : undefined}
            />
          ) : null}
        </div>
      </div>
    </section>
  );
}
