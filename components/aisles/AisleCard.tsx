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
          "group on-dark flex h-full flex-col justify-between gap-6 rounded-sm border-t-[3px] border-accent bg-deep p-4 text-on-deep hover:bg-deep-2 sm:p-5",
          className,
        )}
      >
        <div>
          <p className="font-mono text-xs font-semibold tracking-wider text-on-deep-muted uppercase">
            Aisle {aisle.number}
          </p>
          <Heading className="mt-1 text-[1.0625rem] leading-tight font-extrabold tracking-wide uppercase">
            {aisle.name}
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
        "group flex h-full flex-col overflow-hidden rounded-sm border border-line bg-surface hover:-translate-y-0.5 hover:border-primary motion-reduce:hover:translate-y-0",
        className,
      )}
    >
      <StorePhoto
        photo={photo}
        cover
        sizes={sizes}
        className={cn("aspect-[4/3] w-full", fill && "lg:aspect-auto lg:min-h-0 lg:flex-1")}
      />
      <div className="border-t-[3px] border-accent px-3 pt-2.5 pb-3">
        <p className="inline-block rounded-xs bg-accent-soft px-1.5 pt-0.5 font-mono text-[0.6875rem] font-semibold tracking-wider text-primary uppercase">
          Aisle {aisle.number}
        </p>
        <Heading className="mt-1.5 text-[0.9375rem] leading-tight font-extrabold tracking-wide text-ink uppercase sm:text-base">
          {aisle.name}
        </Heading>
        <p className="mt-1 text-[0.9375rem] leading-snug text-muted">{aisle.blurb}</p>
      </div>
    </Link>
  );
}
