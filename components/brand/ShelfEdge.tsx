import { cn } from "@/lib/cn";

/** Black shelf edge with a red price-strip line on top. Used between major sections. */
export function ShelfEdge({ className }: { className?: string }) {
  return (
    <div
      role="presentation"
      className={cn("h-2.5 border-t-[3px] border-sign-red bg-asphalt", className)}
    />
  );
}

/** Caption strip under a photo, styled like the shelf price strips in the store. */
export function CaptionStrip({
  left,
  right,
  className,
}: {
  left: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "on-dark flex min-h-10 items-center justify-between gap-4 border-t-[3px] border-sign-red bg-asphalt px-3 py-2 font-mono text-[0.8125rem] font-semibold tracking-wide text-limestone uppercase",
        className,
      )}
    >
      <span>{left}</span>
      {right ? <span className="text-right text-limestone/75">{right}</span> : null}
    </div>
  );
}
