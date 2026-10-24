/**
 * Every photo the site uses, with real dimensions and alt text.
 * Files ending in -building, -food-signs, -machines, -bowls, -tight, -lower, -shelves,
 * -tagline-band and -keypad are crops made by scripts/crop-photos.py to remove wrong
 * store names, garbled lettering, and tobacco promotions. See README "Photo changes".
 */

export type Photo = { src: string; width: number; height: number; alt: string };

export const photos = {
  storefrontDusk: {
    src: "/images/storefront/storefront-dusk-building.jpg",
    width: 1218,
    height: 710,
    alt: "185 Quick Mart at dusk with the red sign lit over the front doors",
  },
  storefrontDay: {
    src: "/images/storefront/storefront-day-building.jpg",
    width: 1792,
    height: 1000,
    alt: "The front of 185 Quick Mart on a sunny day, with flower planters along the windows",
  },
  storefrontSide: {
    src: "/images/storefront/storefront-side-food-signs.jpg",
    width: 982,
    height: 600,
    alt: "Side of the store with the Hunt Brothers Pizza sign, a Perfectly Southern chicken poster in the window, and the ice chest",
  },
  fuelCanopy: {
    src: "/images/fuel/fuel-canopy.jpg",
    width: 1792,
    height: 1344,
    alt: "The BP canopy and fuel pumps at 185 Quick Mart",
  },
  coffeeBar: {
    src: "/images/food/coffee-bar-machines.jpg",
    width: 1330,
    height: 1094,
    alt: "The coffee bar with two brewers, an espresso machine, a cappuccino machine and creamer",
  },
  fountain: {
    src: "/images/food/fountain-beverage-bay.jpg",
    width: 1264,
    height: 1680,
    alt: "The Beverage Bay fountain station with soda fountain, frozen drinks, cups and lids",
  },
  slushies: {
    src: "/images/food/slushie-machines-bowls.jpg",
    width: 1562,
    height: 1044,
    alt: "Two slushie machines with strawberry, watermelon, mango and sour apple flavors",
  },
  iceCream: {
    src: "/images/food/ice-cream-freezer-tight.jpg",
    width: 935,
    height: 1650,
    alt: "Blue Bunny ice cream freezer stocked with cups, cones, sandwiches and bars",
  },
  interiorBand: {
    src: "/images/aisles/interior-tagline-band.jpg",
    width: 1470,
    height: 380,
    alt: "Quick · Clean · Kind lettered on the wall above the counter, beside the hot food menu boards",
  },
  coolerWall: {
    src: "/images/aisles/cooler-wall.jpg",
    width: 1792,
    height: 1344,
    alt: "The Chilled Drinks cooler wall, stocked with water, soda, sports and energy drinks",
  },
  chipsAndCoolers: {
    src: "/images/aisles/chips-and-coolers.jpg",
    width: 1792,
    height: 1344,
    alt: "Chips gondola with Pringles, Lay's, Takis and Planters, with the drink coolers behind",
  },
  chipsAisle: {
    src: "/images/aisles/chips-aisle-lower.jpg",
    width: 1792,
    height: 864,
    alt: "A long chips aisle with Takis, Doritos, Lay's and Cheetos",
  },
  candy: {
    src: "/images/aisles/candy-aisle.jpg",
    width: 1792,
    height: 1344,
    alt: "Candy aisle with Haribo, Nerds, Skittles, Sour Patch Kids and Swedish Fish",
  },
  snackCakes: {
    src: "/images/aisles/snack-cakes-aisle.jpg",
    width: 1792,
    height: 1344,
    alt: "Snack cake aisle with Hostess Donettes and boxed snack cakes",
  },
  pastries: {
    src: "/images/aisles/pastries-display.jpg",
    width: 1264,
    height: 1680,
    alt: "Pastry rack with Hostess muffins, danishes, cupcakes and fruit pies",
  },
  jerky: {
    src: "/images/aisles/jerky-meat-snacks.jpg",
    width: 1792,
    height: 1344,
    alt: "Jerky and meat snacks including Jack Link's and Slim Jim",
  },
  health: {
    src: "/images/aisles/health-wellness.jpg",
    width: 1264,
    height: 1680,
    alt: "Health & Wellness endcap with Advil, Tylenol, DayQuil, Alka-Seltzer and cough drops",
  },
  autoCare: {
    src: "/images/aisles/auto-care-shelves.jpg",
    width: 1662,
    height: 1014,
    alt: "Auto care shelves with motor oil, washer fluid, DEF and a red gas can",
  },
  tshirts: {
    src: "/images/aisles/tshirts-shelf.jpg",
    width: 1264,
    height: 1680,
    alt: "Shelves of packaged plain T-shirts in black and white",
  },
  twoLiters: {
    src: "/images/aisles/two-liter-racks.jpg",
    width: 1792,
    height: 1344,
    alt: "Racks of 2-liter soda bottles by the front windows",
  },
  atm: {
    src: "/images/services/atm-keypad.jpg",
    width: 1264,
    height: 675,
    alt: "The card reader and keypad of the Express ATM inside the store",
  },
  lottery: {
    src: "/images/services/lottery-vending.jpg",
    width: 1264,
    height: 1680,
    alt: "Kentucky Lottery self-service ticket machine inside the store",
  },
} satisfies Record<string, Photo>;
