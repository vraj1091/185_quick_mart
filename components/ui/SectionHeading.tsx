import { cn } from "@/lib/cn";

/** Small label + display heading + optional intro line. */
export function SectionHeading({
  id,
  eyebrow,
  title,
  intro,
  as: Tag = "h2",
  className,
  dark = false,
}: {
  id?: string;
  eyebrow?: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  as?: "h1" | "h2" | "h3";
  className?: string;
  dark?: boolean;
}) {
  return (
    <div className={cn("max-w-3xl", className)}>
      {eyebrow ? (
        <p className={cn("eyebrow mb-3", dark ? "text-limestone/80" : "text-sign-red")}>{eyebrow}</p>
      ) : null}
      <Tag id={id} className={cn("type-display", Tag === "h1" ? "type-h1" : "type-h2")}>
        {title}
      </Tag>
      {intro ? (
        <div className={cn("measure mt-4 text-lg", dark ? "text-limestone/85" : "text-slate")}>
          {intro}
        </div>
      ) : null}
    </div>
  );
}
