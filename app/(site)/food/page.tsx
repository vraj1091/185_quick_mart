import { Phone } from "lucide-react";
import { PartnerLogo } from "@/components/brand/PartnerLogo";
import { CaptionStrip } from "@/components/brand/ShelfEdge";
import { buttonClass } from "@/components/ui/Button";
import { StorePhoto } from "@/components/ui/StorePhoto";
import { photos, type Photo } from "@/content/images";
import { menu, type MenuCategory } from "@/content/menu";
import { store } from "@/content/store";
import { cn } from "@/lib/cn";
import { getSettings } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Fried Chicken, Hunt Brothers Pizza, Coffee & Slushies in Bowling Green",
  description:
    "Perfectly Southern fried chicken, Hunt Brothers Pizza, fresh coffee, fountain drinks, slushies and Blue Bunny ice cream at 185 Quick Mart on Highway 185 in Bowling Green, KY.",
  path: "/food",
});

export default async function FoodPage() {
  const settings = await getSettings();

  return (
    <>
      <header className="container-store pt-10 pb-12 lg:pt-16 lg:pb-16">
        <p className="eyebrow text-accent">Hot food & drinks</p>
        <h1 className="type-display type-h1 mt-4 max-w-4xl">Hot food, cold drinks, fresh coffee.</h1>
        <p className="measure mt-5 text-lg sm:text-xl">
          Fried chicken and pizza from the kitchen, coffee on every morning, and a whole bay of
          fountain drinks and slushies.
        </p>
        {!settings.hotFoodOn ? (
          <p
            role="note"
            className="mt-6 max-w-2xl rounded-sm border-l-4 border-accent bg-accent-soft px-4 py-3 text-lg font-semibold"
          >
            The kitchen is closed right now. Call{" "}
            <a href={store.phone.href} className="link-store font-mono tabular">
              {store.phone.display}
            </a>{" "}
            before you come for chicken or pizza.
          </p>
        ) : null}
      </header>

      {/* ---------- From the kitchen ---------- */}
      <section aria-labelledby="kitchen" className="border-y border-line bg-surface-alt py-14 lg:py-20">
        <div className="container-store">
          <h2 id="kitchen" className="type-display type-h2">
            From the kitchen
          </h2>
          <div className="mt-10 grid gap-10 lg:grid-cols-12 lg:gap-14">
            <figure className="lg:col-span-6">
              <StorePhoto
                photo={photos.storefrontSide}
                cover
                preload
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="aspect-[982/600] rounded-t-sm"
              />
              <CaptionStrip left="Chicken and pizza signs" right="Side of the store" />
            </figure>
            <div className="grid content-start gap-10 sm:grid-cols-2 lg:col-span-6 lg:grid-cols-1">
              <MenuBlock
                id="chicken"
                category={menu[0]!}
                partner="perfectlySouthern"
                text="Perfectly Southern fried chicken, cooked right here in the store. Want a piece hot out of the fryer? Just ask at the counter."
              />
              <MenuBlock
                id="pizza"
                category={menu[1]!}
                partner="huntBrothers"
                text="Hunt Brothers pizza, whole pies or by the slice, baked here. Good for lunch, the drive home, or the whole crew."
              />
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Drinks and sweets ---------- */}
      <FoodFeature
        id="coffee"
        eyebrow="Coffee bar"
        title="Begin every day fresh."
        text="Fresh coffee on, every morning. Fill a cup at the bar, then add creamer, or grab a cappuccino from the machine."
        photo={photos.coffeeBar}
        caption="The coffee bar"
        aspect="aspect-[1330/1094]"
      />
      <FoodFeature
        id="fountain"
        eyebrow="Beverage Bay"
        title="Fountain drinks"
        text="Soda fountain and frozen drinks at the Beverage Bay. Grab a cup, fill it up, and get back on the road."
        photo={photos.fountain}
        caption="Beverage Bay"
        aspect="aspect-[4/5]"
        flip
      />
      <FoodFeature
        id="slushies"
        eyebrow="Slushies"
        title="Four flavors, ice cold"
        text="On the machines lately: strawberry, watermelon, mango and sour apple."
        note="Flavors rotate."
        photo={photos.slushies}
        caption="Slushie machines"
        aspect="aspect-[1562/1044]"
      />
      <FoodFeature
        id="ice-cream"
        eyebrow="Ice cream"
        title="Blue Bunny freezer"
        text="Cones, cups, ice cream sandwiches and bars. A good stop on a hot Kentucky afternoon."
        photo={photos.iceCream}
        caption="Blue Bunny freezer"
        aspect="aspect-[3/4]"
        position="50% 6%"
        flip
      />

      <section className="container-store pb-16 lg:pb-24">
        <div className="on-dark flex flex-col gap-5 rounded-md bg-deep p-6 text-on-deep sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <p className="text-xl font-bold">Calling ahead for food? We’ll tell you what’s hot.</p>
          <a href={store.phone.href} className={buttonClass("primary", "md", "shrink-0")}>
            <Phone aria-hidden="true" strokeWidth={1.75} className="size-5" />
            Call <span className="font-mono tabular">{store.phone.display}</span>
          </a>
        </div>
      </section>
    </>
  );
}

function MenuBlock({
  id,
  category,
  partner,
  text,
}: {
  id: string;
  category: MenuCategory;
  partner: "perfectlySouthern" | "huntBrothers";
  text: string;
}) {
  return (
    <div id={id} className="scroll-mt-6">
      <PartnerLogo partner={partner} className="mb-3 h-12 w-auto" />
      <p className="eyebrow text-accent">{category.brand}</p>
      <h3 className="type-display type-h3 mt-2">{category.title}</h3>
      <p className="mt-3 text-lg">{text}</p>
      {category.items.length > 0 ? (
        <ul className="mt-5 divide-y divide-line border-y border-line">
          {category.items.map((item) => (
            <li key={item.name} className="flex items-baseline justify-between gap-4 py-3">
              <span>
                <span className="font-bold">{item.name}</span>
                {item.description ? (
                  <span className="block text-[0.9375rem] text-muted">{item.description}</span>
                ) : null}
              </span>
              {item.price ? <span className="font-mono font-semibold tabular">{item.price}</span> : null}
            </li>
          ))}
        </ul>
      ) : (
        <p className="mt-4 border-l-4 border-primary pl-3 font-semibold">
          Ask at the counter for today’s menu.
        </p>
      )}
    </div>
  );
}

function FoodFeature({
  id,
  eyebrow,
  title,
  text,
  note,
  photo,
  caption,
  aspect,
  position,
  flip = false,
}: {
  id: string;
  eyebrow: string;
  title: string;
  text: string;
  note?: string;
  photo: Photo;
  caption: string;
  aspect: string;
  position?: string;
  flip?: boolean;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={cn("scroll-mt-6 py-12 lg:py-16", flip && "bg-surface-alt")}
    >
      <div className="container-store grid gap-8 lg:grid-cols-12 lg:items-center lg:gap-14">
        <figure className={cn("lg:col-span-7", flip && "lg:order-2 lg:col-span-5 lg:col-start-8")}>
          <StorePhoto
            photo={photo}
            cover
            sizes={flip ? "(min-width: 1024px) 40vw, 100vw" : "(min-width: 1024px) 58vw, 100vw"}
            className={cn(aspect, "rounded-t-sm", flip && "max-h-[36rem] w-full")}
            position={position}
          />
          <CaptionStrip left={caption} right={store.address.city} />
        </figure>
        <div className={cn("lg:col-span-5", flip && "lg:order-1 lg:col-span-6 lg:col-start-1")}>
          <p className="eyebrow text-accent">{eyebrow}</p>
          <h2 id={`${id}-title`} className="type-display type-h2 mt-3">
            {title}
          </h2>
          <p className="measure mt-4 text-lg">{text}</p>
          {note ? <p className="mt-2 font-semibold text-muted">{note}</p> : null}
        </div>
      </div>
    </section>
  );
}
