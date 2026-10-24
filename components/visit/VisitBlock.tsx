import { Navigation, Phone } from "lucide-react";
import Link from "next/link";
import { HoursTable } from "@/components/hours/HoursTable";
import { OpenNowPill } from "@/components/hours/OpenNowPill";
import { buttonClass } from "@/components/ui/Button";
import { store } from "@/content/store";
import { hasWeeklyHours, upcomingSpecials, type Schedule } from "@/lib/hours";
import { MapEmbed } from "./MapEmbed";

/** Map, address, hours and call/directions. Used at the bottom of the home page. */
export function VisitBlock({ schedule }: { schedule: Schedule }) {
  return (
    <section aria-labelledby="visit-title" className="border-t border-line bg-surface-alt py-16 lg:py-24">
      <div className="container-store grid gap-10 lg:grid-cols-12 lg:gap-14">
        <div className="lg:sticky lg:top-6 lg:col-span-7 lg:self-start">
          <MapEmbed />
        </div>
        <div className="lg:col-span-5">
          <p className="eyebrow text-accent">Visit</p>
          <h2 id="visit-title" className="type-display type-h2 mt-3">
            Find us on Highway 185
          </h2>
          <address className="mt-6 text-xl leading-snug font-bold not-italic">
            {store.address.streetDisplay}
            <br />
            {store.address.city}, {store.address.region} {store.address.postalCode}
            <a href={store.phone.href} className="mt-2 block font-mono text-lg font-semibold text-danger tabular">
              {store.phone.display}
            </a>
          </address>
          {hasWeeklyHours(schedule) ? <OpenNowPill schedule={schedule} className="mt-5" /> : null}
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href={store.maps.directions}
              target="_blank"
              rel="noopener noreferrer"
              className={buttonClass("primary")}
            >
              <Navigation aria-hidden="true" strokeWidth={1.75} className="size-5" />
              Get Directions
            </a>
            <a href={store.phone.href} className={buttonClass("outline")}>
              <Phone aria-hidden="true" strokeWidth={1.75} className="size-5" />
              Call the store
            </a>
          </div>
          <h3 className="eyebrow mt-10 mb-3 text-muted">Hours</h3>
          <HoursTable schedule={schedule} specials={upcomingSpecials(schedule, new Date())} />
          <Link href="/visit" className="link-store mt-6 inline-block">
            Contact form & more about visiting
          </Link>
        </div>
      </div>
    </section>
  );
}
