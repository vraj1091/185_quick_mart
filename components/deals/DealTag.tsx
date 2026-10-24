import type { DealData } from "@/lib/data";

/** A deal styled like a yellow shelf price label, with the black shelf edge underneath. */
export function DealTag({ deal }: { deal: DealData }) {
  return (
    <article className="flex h-full flex-col rounded-t-sm bg-legacy-highlight text-ink">
      <div className="flex-1 px-4 pt-3.5 pb-4">
        <h3 className="leading-snug font-bold">{deal.title}</h3>
        <p className="type-display mt-3 text-[2.25rem] leading-none">{deal.priceText}</p>
        {deal.note ? <p className="mt-3 text-sm leading-snug">{deal.note}</p> : null}
      </div>
      <div aria-hidden="true" className="h-2 bg-deep" />
    </article>
  );
}
