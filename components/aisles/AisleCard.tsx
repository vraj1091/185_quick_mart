import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { Aisle } from "@/content/aisles";
import { StorePhoto } from "@/components/ui/StorePhoto";
import { cn } from "@/lib/cn";

/**
 * Category card labeled like the store's aisle signs: an "Aisle 01" chip and the name.
 * Real photo, one line of copy, no icons. Text-only aisles (tobacco) get no photo.
 * With `fill`, the photo stretches to the grid cell height on large screens.
 */
export function AisleCard({
  aisle,
  href,
  sizes,
  fill = false,
  headingLevel: Heading = "h3",
  className,
}: {
  aisle: Aisle;
  href: string;
  sizes: string;
  fill?: boolean;
  headingLevel?: "h2" | "h3";
  className?: string;
}) {
  const photo = aisle.photos[0];

  if (!photo) {
    return (
      <Link
        href={href}
        className={cn(
          "group on-dark flex h-full flex-col justify-between gap-6 rounded-sm border-t-[3px] border-accent bg-deep p-4 text-on-deep shadow-sm transition-[background-color,box-shadow,transform] duration-[180ms] ease-out hover:-translate-y-0.5 hover:bg-deep-2 hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:bg-deep-2 focus-visible:shadow-md motion-reduce:hover:translate-y-0 sm:p-5",
          className,
        )}
      >
        <div>
          <p className="font-mono text-xs font-semibold tracking-wider text-on-deep-muted uppercase">
            Aisle {aisle.number}
          </p>
          <Heading className="mt-1 flex items-center gap-1.5 text-[1.0625rem] leading-tight font-extrabold tracking-wide uppercase">
            {aisle.name}
            <Arrow className="text-on-deep-muted" />
          </Heading>
        </div>
        <p className="text-[0.9375rem] leading-snug text-on-deep-muted">{aisle.blurb}</p>
      </Link>
    );
  }

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-full flex-col overflow-hidden rounded-sm border border-line bg-surface shadow-sm transition-[border-color,box-shadow,transform] duration-[180ms] ease-out hover:-translate-y-0.5 hover:border-primary hover:shadow-md focus-visible:-translate-y-0.5 focus-visible:border-primary focus-visible:shadow-md motion-reduce:hover:translate-y-0 motion-reduce:focus-visible:translate-y-0",
        className,
      )}
    >
      <StorePhoto
        photo={photo}
        cover
        sizes={sizes}
        className={cn("aspect-[4/3] w-full", fill && "lg:aspect-auto lg:min-h-0 lg:flex-1")}
        imgClassName="transition-transform duration-[180ms] ease-out group-hover:scale-[1.03] group-focus-visible:scale-[1.03] motion-reduce:group-hover:scale-100"
      />
      <div className="border-t-[3px] border-accent px-3 pt-2.5 pb-3">
        <p className="inline-block rounded-xs bg-accent-soft px-1.5 pt-0.5 font-mono text-[0.6875rem] font-semibold tracking-wider text-primary uppercase">
          Aisle {aisle.number}
        </p>
        <Heading className="mt-1.5 flex items-center gap-1.5 text-[0.9375rem] leading-tight font-extrabold tracking-wide text-ink uppercase sm:text-base">
          {aisle.name}
          <Arrow />
        </Heading>
        <p className="mt-1 text-[0.9375rem] leading-snug text-muted">{aisle.blurb}</p>
      </div>
    </Link>
  );
}

/** Small arrow beside the aisle name that nudges right on hover and focus. */
function Arrow({ className = "text-accent" }: { className?: string }) {
  return (
    <ArrowRight
      aria-hidden="true"
      strokeWidth={2}
      className={cn(
        "size-4 shrink-0 transition-transform duration-[180ms] ease-out group-hover:translate-x-1 group-focus-visible:translate-x-1 motion-reduce:transition-none",
        className,
      )}
    />
  );
}
