import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { RoadDivider } from "@/components/brand/RoadLine";
import { buttonClass } from "@/components/ui/Button";
import { menu } from "@/content/menu";
import { store } from "@/content/store";
import { MenuBoards } from "./MenuBoards";

/**
 * "What's cooking": the menu boards with their header, the no-prices note, and the
 * call-ahead button. Used on the home page and on /food (one component, one data file).
 */
export function MenuSection({ id = "menu", showFoodLink = false }: { id?: string; showFoodLink?: boolean }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-24 bg-surface-alt">
      <RoadDivider />
      <div className="container-store py-16 lg:py-24">
        <div data-reveal className="max-w-3xl">
          <p className="eyebrow road-under text-accent">Hot food counter</p>
          <h2 id={`${id}-title`} className="type-display type-h2 mt-3">
            What’s cooking
          </h2>
          <p className="measure mt-4 text-lg text-muted">
            Breakfast biscuits from early morning, Perfectly Southern chicken and Hunt Brothers pizza
            all day.
          </p>
        </div>

        <MenuBoards categories={menu} className="mt-10" />

        <p className="mt-8 text-muted">
          Prices and daily availability vary. Ask at the counter or call{" "}
          <a href={store.phone.href} className="link-store font-mono tabular">
            {store.phone.display}
          </a>
          .
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <a href={store.phone.href} className={buttonClass("primary")}>
            <Phone aria-hidden="true" strokeWidth={1.75} className="size-5" />
            Call ahead
          </a>
          {showFoodLink ? (
            <Link href="/food#menu" className={buttonClass("outline")}>
              See the full food page
              <ArrowRight aria-hidden="true" strokeWidth={1.75} className="size-5" />
            </Link>
          ) : null}
        </div>
      </div>
    </section>
  );
}
