import { photos, type Photo } from "./images";

export type Aisle = {
  slug: string;
  number: string;
  name: string;
  /** One short line for cards. */
  blurb: string;
  /** Two or three sentences for the /store page. */
  description: string;
  /** First photo is used on cards. Empty for text-only aisles. */
  photos: Photo[];
  /** Shown as a required notice (tobacco). */
  ageNotice?: string;
};

export const aisles: Aisle[] = [
  {
    slug: "chilled-drinks",
    number: "01",
    name: "Chilled Drinks",
    blurb: "A whole wall of cold water, soda, sports drinks and energy drinks.",
    description:
      "Grab a cold one off the wall: water, soda, sports drinks, energy drinks and more. The 2-liters are on racks up by the front windows, so you can grab one for the house too.",
    photos: [photos.coolerWall, photos.twoLiters],
  },
  {
    slug: "snacks-chips",
    number: "02",
    name: "Snacks & Chips",
    blurb: "Takis, Doritos, Lay's, Cheetos, Pringles and plenty more.",
    description:
      "A full aisle of chips plus a gondola up front. Takis, Doritos, Lay's, Cheetos, Pringles, Planters nuts and popcorn. If you have a favorite, odds are it's here.",
    photos: [photos.chipsAndCoolers, photos.chipsAisle],
  },
  {
    slug: "candy",
    number: "03",
    name: "Candy",
    blurb: "Gummies, sours and chocolate, all on one wall.",
    description:
      "Haribo, Nerds, Skittles, Sour Patch Kids, Swedish Fish, Life Savers, M&M's and the rest. Sweet, sour, chewy or chocolate.",
    photos: [photos.candy],
  },
  {
    slug: "snack-cakes-pastries",
    number: "04",
    name: "Snack Cakes & Pastries",
    blurb: "Donettes, cupcakes, danishes and muffins for the drive.",
    description:
      "Hostess Donettes, cupcakes, Twinkies, Zingers, fruit pies, danishes and big muffins. Good with a cup of coffee from the bar.",
    photos: [photos.snackCakes, photos.pastries],
  },
  {
    slug: "jerky-meat-snacks",
    number: "05",
    name: "Jerky & Meat Snacks",
    blurb: "Jack Link's, Slim Jim and meat sticks for the road.",
    description:
      "A full rack of jerky in a bunch of flavors, plus Slim Jims and meat sticks. Easy protein for a long drive or a long shift.",
    photos: [photos.jerky],
  },
  {
    slug: "health-wellness",
    number: "06",
    name: "Health & Wellness",
    blurb: "Pain relief, cold medicine, antacids and cough drops.",
    description:
      "Headache, heartburn or a cold coming on? We keep Advil, Tylenol, Motrin, DayQuil, Alka-Seltzer, BC and Goody's powders, Halls, lip balm and other basics.",
    photos: [photos.health],
  },
  {
    slug: "auto-care",
    number: "07",
    name: "Auto Care",
    blurb: "Motor oil, fluids, DEF and gas cans.",
    description:
      "Low on oil or out of washer fluid? We carry motor oil, transmission fluid, washer fluid, DEF, gas cans and work gloves. Air for your tires is outside.",
    photos: [photos.autoCare],
  },
  {
    slug: "t-shirts",
    number: "08",
    name: "T-Shirts",
    blurb: "Plain black and white tees, ready to wear.",
    description:
      "Spilled coffee on your shirt or need a fresh one for work? We keep packs of plain black and white T-shirts on the shelf.",
    photos: [photos.tshirts],
  },
  {
    slug: "ice-cream",
    number: "09",
    name: "Ice Cream",
    blurb: "Blue Bunny cones, cups, sandwiches and bars.",
    description:
      "The Blue Bunny freezer is stocked with cones, cups, ice cream sandwiches and bars. A good stop on a hot Kentucky afternoon.",
    photos: [photos.iceCream],
  },
  {
    slug: "tobacco-smoke",
    number: "10",
    name: "Tobacco & Smoke",
    blurb: "Behind the counter. 21+ with valid ID.",
    description:
      "Cigarettes, tobacco and smoke items are kept behind the counter. Ask at the register.",
    photos: [],
    ageNotice: "You must be 21 or older with a valid ID to buy tobacco products.",
  },
];

/** Aisles featured on the home page, in grid order. */
export const homeAisleSlugs = [
  "chilled-drinks",
  "health-wellness",
  "snacks-chips",
  "candy",
  "ice-cream",
  "auto-care",
  "t-shirts",
  "tobacco-smoke",
] as const;

export function getAisle(slug: string): Aisle {
  const aisle = aisles.find((a) => a.slug === slug);
  if (!aisle) throw new Error(`Unknown aisle: ${slug}`);
  return aisle;
}
