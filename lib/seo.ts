import type { Metadata } from "next";
import { store } from "@/content/store";
import { photos } from "@/content/images";
import { fromDayHours, hasWeeklyHours, type DayHours, type Schedule } from "./hours";
import { absoluteUrl } from "./site";
import { WEEKDAY_NAMES } from "./time";

type JsonLd = Record<string, unknown>;

function scheduleTimes(hours: DayHours): { opens: string; closes: string } | null {
  if (hours.kind === "closed") return null;
  if (hours.kind === "open24") return { opens: "00:00", closes: "23:59" };
  const { opensAt, closesAt } = fromDayHours(hours);
  return { opens: opensAt!, closes: closesAt === "24:00" ? "23:59" : closesAt! };
}

/** schema.org openingHoursSpecification, grouping days with the same hours. */
export function openingHoursSpecification(schedule: Schedule): JsonLd[] {
  const groups = new Map<string, { opens: string; closes: string; days: string[] }>();
  schedule.weekly.forEach((hours, day) => {
    if (!hours) return;
    const times = scheduleTimes(hours);
    if (!times) return;
    const key = `${times.opens}-${times.closes}`;
    const group = groups.get(key) ?? { ...times, days: [] };
    group.days.push(`https://schema.org/${WEEKDAY_NAMES[day]}`);
    groups.set(key, group);
  });
  return [...groups.values()].map((g) => ({
    "@type": "OpeningHoursSpecification",
    dayOfWeek: g.days.length === 1 ? g.days[0] : g.days,
    opens: g.opens,
    closes: g.closes,
  }));
}

function specialOpeningHours(schedule: Schedule): JsonLd[] {
  return schedule.special.map((s) => {
    const times = scheduleTimes(s.hours) ?? { opens: "00:00", closes: "00:00" };
    return {
      "@type": "OpeningHoursSpecification",
      name: s.label,
      validFrom: s.date,
      validThrough: s.date,
      ...times,
    };
  });
}

/** GasStation + ConvenienceStore JSON-LD. Only includes facts we actually have. */
export function storeJsonLd(schedule: Schedule | null): JsonLd {
  const data: JsonLd = {
    "@context": "https://schema.org",
    "@type": ["GasStation", "ConvenienceStore"],
    "@id": absoluteUrl("/#store"),
    name: store.name,
    alternateName: store.alternateName,
    slogan: store.tagline.join(" · "),
    url: absoluteUrl("/"),
    telephone: store.phone.e164,
    image: [absoluteUrl(photos.storefrontDay.src), absoluteUrl(photos.storefrontDusk.src)],
    address: {
      "@type": "PostalAddress",
      streetAddress: store.address.street,
      addressLocality: store.address.city,
      addressRegion: store.address.region,
      postalCode: store.address.postalCode,
      addressCountry: store.address.country,
    },
    areaServed: { "@type": "City", name: `${store.address.city}, ${store.address.regionName}` },
    brand: { "@type": "Brand", name: store.fuelBrand },
    amenityFeature: [
      "ATM",
      "Air for tires",
      "Kentucky Lottery",
      "Lottery prize cashing",
      "Diesel fuel",
      "Hot food",
      "Bagged ice",
    ].map((name) => ({ "@type": "LocationFeatureSpecification", name, value: true })),
    hasMap: store.maps.search,
  };

  if (store.coordinates) {
    data.geo = {
      "@type": "GeoCoordinates",
      latitude: store.coordinates.lat,
      longitude: store.coordinates.lng,
    };
  }
  if (store.email) data.email = store.email;

  const sameAs = Object.values(store.socials).filter((v): v is string => !!v);
  if (sameAs.length) data.sameAs = sameAs;

  if (hasWeeklyHours(schedule)) {
    data.openingHoursSpecification = openingHoursSpecification(schedule);
    const special = specialOpeningHours(schedule);
    if (special.length) data.specialOpeningHoursSpecification = special;
  }

  return data;
}

/** Serializes JSON-LD for a <script> tag without allowing "</script>" injection. */
export function jsonLdString(data: JsonLd): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

export const shareImageAlt = `${store.name}: BP gas, hot food and Kentucky Lottery on Highway 185 in Bowling Green, KY`;

/** Per-page metadata with canonical URL and matching Open Graph / Twitter fields. */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle = false,
}: {
  title: string;
  description: string;
  path: string;
  absoluteTitle?: boolean;
}): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${store.name}`;
  // Page-level openGraph/twitter replace the parent's entirely, so the share image
  // and card type are restated here (they come from app/opengraph-image.tsx).
  const image = { url: "/opengraph-image", width: 1200, height: 630, alt: shareImageAlt };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: store.name,
      title: fullTitle,
      description,
      url: path,
      images: [image],
    },
    twitter: { card: "summary_large_image", title: fullTitle, description, images: [image] },
  };
}
