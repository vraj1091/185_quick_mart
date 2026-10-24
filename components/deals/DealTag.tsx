import type { DealData } from "@/lib/data";

/**
 * A deal styled like a shelf price label: white tag, pine border, mono price,
 * and a punched hang-hole notch in the corner.
 */
export function DealTag({ deal }: { deal: DealData }) {
  return (
    <article className="relative flex h-full flex-col rounded-sm border-2 border-primary bg-surface px-4 pt-4 pb-5 text-ink">
      <span
        aria-hidden="true"
        className="absolute top-3 right-3 size-3.5 rounded-full border-2 border-primary bg-surface-alt"
      />
      <h3 className="pr-7 leading-snug font-bold">{deal.title}</h3>
      <p className="mt-3 font-mono text-[2rem] leading-none font-semibold text-primary tabular">
        {deal.priceText}
      </p>
      {deal.note ? <p className="mt-3 text-sm leading-snug text-muted">{deal.note}</p> : null}
    </article>
  );
}
