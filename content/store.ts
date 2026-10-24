/**
 * Store facts: the single source of truth for 185 Quick Mart.
 * Components read from here; never hard-code these values elsewhere.
 *
 * Anything set to `null` is unknown. The UI hides it until the owner fills it in.
 * Hours, fuel prices, deals and the notice banner live in the database and are
 * edited from /admin, not here.
 */

export type FuelGradeId = "regular" | "premium" | "diesel";

export type StoreInfo = {
  name: string;
  alternateName: string;
  tagline: readonly [string, string, string];
  supportLine: string;
  fuelBrand: string;
  address: {
    street: string;
    streetDisplay: string;
    city: string;
    region: string;
    regionName: string;
    postalCode: string;
    country: string;
    county: string;
  };
  phone: { display: string; e164: string; href: string };
  timeZone: string;
  servingSince: number | null;
  coordinates: { lat: number; lng: number } | null;
  email: string | null;
  socials: { facebook: string | null; instagram: string | null; googleBusiness: string | null };
  maps: { directions: string; appleDirections: string; embed: string; search: string };
  fuel: {
    grades: readonly { id: FuelGradeId; label: string }[];
    dieselOnSite: boolean;
    payAtPump: boolean | null;
    midGrade: boolean | null;
    nonEthanol: boolean | null;
  };
  lottery: { cashLimitDollars: number; counterLimitDollars: number };
  partnerLogos: Record<"bp" | "huntBrothers" | "perfectlySouthern" | "kyLottery", PartnerLogo | null>;
};

export type PartnerLogo = { src: string; width: number; height: number; alt: string };

const addressQuery = "1341+KY-185,+Bowling+Green,+KY+42101";

export const store: StoreInfo = {
  name: "185 Quick Mart",
  // Some directories list the store under this name. Used only in schema markup.
  alternateName: "HWY 185 Quick Mart",
  // Painted on the wall above the counter.
  tagline: ["Quick", "Clean", "Kind"],
  supportLine: "One stop for everything",
  fuelBrand: "BP",
  address: {
    street: "1341 KY-185",
    streetDisplay: "1341 Highway 185",
    city: "Bowling Green",
    region: "KY",
    regionName: "Kentucky",
    postalCode: "42101",
    country: "US",
    county: "Warren County",
  },
  // TODO(owner): confirm this number matches the Google Business Profile listing.
  phone: { display: "(270) 599-1126", e164: "+12705991126", href: "tel:+12705991126" },
  timeZone: "America/Chicago",
  // TODO(owner): confirm the opening year (early reviews suggest 2023), then set to 2023.
  servingSince: null,
  // TODO(owner): exact latitude/longitude of the front door. Until then maps use the address.
  coordinates: null,
  // TODO(owner): public email address, if any.
  email: null,
  // TODO(owner): links to Facebook, Instagram, and the Google Business Profile.
  socials: { facebook: null, instagram: null, googleBusiness: null },
  maps: {
    directions: `https://www.google.com/maps/dir/?api=1&destination=${addressQuery}`,
    appleDirections: `https://maps.apple.com/?daddr=${addressQuery}`,
    embed: `https://www.google.com/maps?q=${addressQuery}&output=embed`,
    search: `https://www.google.com/maps/search/?api=1&query=${addressQuery}`,
  },
  fuel: {
    grades: [
      { id: "regular", label: "Regular" },
      { id: "premium", label: "Premium" },
      { id: "diesel", label: "Diesel" },
    ],
    dieselOnSite: true,
    // TODO(owner): can customers pay at the pump? Leave null to keep it off the site.
    payAtPump: null,
    // TODO(owner): is there a mid-grade? Leave null until confirmed.
    midGrade: null,
    // TODO(owner): is non-ethanol (E0) sold? Leave null until confirmed.
    nonEthanol: null,
  },
  lottery: {
    // From the owner. TODO(owner): confirm the store is an authorized Kentucky Lottery
    // cashing agent for prizes from $600.01 to $5,000 before launch.
    cashLimitDollars: 5000,
    // Any Kentucky Lottery retailer can pay prizes up to this amount without a claim form.
    counterLimitDollars: 600,
  },
  // Third-party logos stay off the site until the owner confirms the agreements allow it.
  // To add one: put the file in public/images/partners/ and fill in { src, width, height, alt }.
  partnerLogos: { bp: null, huntBrothers: null, perfectlySouthern: null, kyLottery: null },
};

export const STORE_TIME_ZONE = store.timeZone;

export const fullAddress = `${store.address.street}, ${store.address.city}, ${store.address.region} ${store.address.postalCode}`;
export const displayAddress = `${store.address.streetDisplay}, ${store.address.city}, ${store.address.region} ${store.address.postalCode}`;

export const officialLinks = {
  kyLotteryClaim: "https://www.kylottery.com/apps/customer_service/prize_claim_form.html",
  kyLottery: "https://www.kylottery.com/",
  // Kentucky Council on Problem Gambling helpline (kycpg.org). TODO(owner): re-check before launch.
  gamblingHelpline: { display: "1-800-GAMBLER (1-800-426-2537)", href: "tel:+18004262537" },
  kycpg: "https://kycpg.org/",
};
