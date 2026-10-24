import Link from "next/link";
import { RoadDivider } from "@/components/brand/RoadLine";
import { Sep } from "@/components/brand/Sep";
import { Lockup, Tagline } from "@/components/brand/Wordmark";
import { HoursTimelineCompact } from "@/components/hours/HoursTable";
import { store } from "@/content/store";
import { summarizeWeek, type Schedule } from "@/lib/hours";
import { mainNav } from "@/lib/site";

const footerLink = "flex min-h-11 items-center underline-offset-4 hover:underline focus-visible:underline";

export function Footer({ schedule }: { schedule: Schedule }) {
  const hours = summarizeWeek(schedule);
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark texture-contour overflow-hidden bg-deep text-on-deep">
      {/* Top edge: the highway center line. */}
      <RoadDivider />

      {/* Large outline "185" cropped by the right edge. Decorative. */}
      <span
        aria-hidden="true"
        className="outline-numerals absolute top-6 -right-10 hidden text-[clamp(12rem,22vw,22rem)] [--numeral-stroke:var(--color-deep-3)] lg:block"
      >
        185
      </span>

      <div className="container-store relative grid gap-10 py-14 md:grid-cols-12 lg:py-16">
        <div className="md:col-span-5">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-sm text-[1.75rem]">
            <Lockup tone="dark" />
          </Link>
          <Tagline className="mt-3 text-on-deep-muted" />
          <address className="mt-6 leading-relaxed not-italic">
            <a
              href={store.maps.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="underline-offset-4 hover:underline focus-visible:underline"
            >
              {store.address.streetDisplay}
              <br />
              {store.address.city}, {store.address.region} {store.address.postalCode}
            </a>
            <br />
            <a
              href={store.phone.href}
              className="mt-2 inline-block font-mono text-lg tabular underline-offset-4 hover:underline focus-visible:underline"
            >
              {store.phone.display}
            </a>
          </address>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-on-deep-muted">Hours</h2>
          {hours.length > 0 ? (
            <>
              <dl className="mt-3 space-y-1.5">
                {hours.map((row) => (
                  <div key={row.days} className="flex justify-between gap-4 md:block">
                    <dt className="font-semibold">{row.days}</dt>
                    <dd className="font-mono text-on-deep-muted tabular">{row.hours}</dd>
                  </div>
                ))}
              </dl>
              <HoursTimelineCompact schedule={schedule} className="mt-4 max-w-56" />
            </>
          ) : (
            <p className="mt-3">
              <a href={store.phone.href} className="link-store">
                Call for hours
              </a>
            </p>
          )}
          <Link
            href="/visit"
            className="mt-4 inline-block text-sm text-on-deep-muted underline hover:text-on-deep focus-visible:text-on-deep"
          >
            Holiday hours & directions
          </Link>
        </div>

        <nav aria-label="Footer" className="md:col-span-4">
          <h2 className="eyebrow text-on-deep-muted">Around the store</h2>
          <ul className="mt-2 grid grid-cols-2 gap-x-6">
            {[{ href: "/", label: "Home" }, ...mainNav].map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={footerLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="relative border-t border-on-deep/10">
        <div className="container-store space-y-2 py-6 text-sm text-on-deep-muted">
          <p className="font-semibold text-on-deep">
            Must be 21+ to purchase tobacco. Must be 18+ to play the Kentucky Lottery.
          </p>
          <p>
            {store.name} is an independently owned {store.fuelBrand}-branded station. BP and the BP
            logo are trademarks of BP p.l.c.
          </p>
          <p>
            © {year} {store.name}
            <Sep />
            <Link href="/privacy" className="underline hover:text-on-deep focus-visible:text-on-deep">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
