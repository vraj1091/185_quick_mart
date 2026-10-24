import { ExternalLink, Navigation, Phone } from "lucide-react";
import { CaptionStrip } from "@/components/brand/ShelfEdge";
import { ContactForm } from "@/components/forms/ContactForm";
import { HoursTable } from "@/components/hours/HoursTable";
import { OpenNowPill } from "@/components/hours/OpenNowPill";
import { buttonClass } from "@/components/ui/Button";
import { StorePhoto } from "@/components/ui/StorePhoto";
import { MapEmbed } from "@/components/visit/MapEmbed";
import { photos } from "@/content/images";
import { store } from "@/content/store";
import { getSchedule, getSettings } from "@/lib/data";
import { hasWeeklyHours, upcomingSpecials } from "@/lib/hours";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Hours, Directions & Contact",
  description:
    "185 Quick Mart is at 1341 Highway 185 (KY-185), Bowling Green, KY 42101 in Warren County. Store hours, directions, phone (270) 599-1126, and a contact form.",
  path: "/visit",
});

export default async function VisitPage() {
  const [schedule, settings] = await Promise.all([getSchedule(), getSettings()]);

  return (
    <>
      <header className="container-store pt-10 pb-10 lg:pt-16 lg:pb-14">
        <p className="eyebrow text-accent">Visit</p>
        <h1 className="type-display type-h1 mt-4">Hours, directions & contact</h1>
      </header>

      <section aria-label="Location and hours" className="container-store pb-16 lg:pb-24">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="space-y-6 lg:col-span-7">
            <MapEmbed />
            <figure>
              <StorePhoto
                photo={photos.storefrontDay}
                cover
                sizes="(min-width: 1024px) 58vw, 100vw"
                className="aspect-[1792/1000] rounded-t-sm"
              />
              <CaptionStrip left="Look for the red sign" right="1341 Hwy 185" />
            </figure>
          </div>

          <div className="lg:col-span-5">
            <h2 className="eyebrow text-muted">Address</h2>
            <address className="mt-2 text-2xl leading-snug font-bold not-italic">
              {store.address.streetDisplay}
              <br />
              {store.address.city}, {store.address.region} {store.address.postalCode}
            </address>
            <p className="mt-1 text-muted">
              On KY-185 in {store.address.county}, {store.address.regionName}
            </p>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <a
                href={store.maps.directions}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("primary", "lg")}
              >
                <Navigation aria-hidden="true" strokeWidth={1.75} className="size-5" />
                Get Directions
              </a>
              <a
                href={store.maps.appleDirections}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("outline", "lg")}
              >
                Apple Maps
                <ExternalLink aria-hidden="true" strokeWidth={1.75} className="size-4" />
              </a>
            </div>

            <h2 className="eyebrow mt-10 text-muted">Phone</h2>
            <a
              href={store.phone.href}
              className="mt-2 inline-flex min-h-11 items-center gap-3 font-mono text-2xl font-semibold text-danger tabular hover:text-primary-hover"
            >
              <Phone aria-hidden="true" strokeWidth={1.75} className="size-6" />
              {store.phone.display}
            </a>
            {store.email ? (
              <p className="mt-2">
                <a href={`mailto:${store.email}`} className="link-store">
                  {store.email}
                </a>
              </p>
            ) : null}

            <div className="mt-10 flex flex-wrap items-center justify-between gap-3">
              <h2 className="eyebrow text-muted">Hours</h2>
              {hasWeeklyHours(schedule) ? <OpenNowPill schedule={schedule} /> : null}
            </div>
            <HoursTable
              schedule={schedule}
              specials={upcomingSpecials(schedule, new Date())}
              className="mt-3"
            />
          </div>
        </div>
      </section>

      {settings.hiringOn ? (
        <section aria-labelledby="hiring" className="container-store pb-16">
          <div className="on-dark grid gap-4 rounded-md border-t-[3px] border-accent bg-deep p-6 text-on-deep sm:p-10 lg:grid-cols-12 lg:items-center">
            <h2 id="hiring" className="type-display type-h2 lg:col-span-5">
              We’re hiring
            </h2>
            <p className="text-lg text-on-deep/90 lg:col-span-7">
              Friendly, reliable, and like a clean store? Stop by the counter and ask for an
              application, or send us a note below and pick “Jobs”.
            </p>
          </div>
        </section>
      ) : null}

      <section aria-labelledby="contact" className="border-t border-line bg-surface-alt py-16 lg:py-24">
        <div className="container-store grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <p className="eyebrow text-accent">Contact</p>
            <h2 id="contact" className="type-display type-h2 mt-3">
              Send us a note
            </h2>
            <p className="mt-4 text-lg text-muted">
              Questions, feedback, lost and found, or anything else. For something that can’t wait,
              call the store at{" "}
              <a href={store.phone.href} className="link-store font-mono tabular">
                {store.phone.display}
              </a>
              .
            </p>
          </div>
          <div className="lg:col-span-8">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
