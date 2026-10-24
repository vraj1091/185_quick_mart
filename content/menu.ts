/**
 * Hot food menu: the single source for the menu boards on the home page and /food.
 *
 * NO PRICES, on purpose. Prices change often and are handwritten in the store, so the
 * type has no price field at all and nothing can render one. Names and options only.
 *
 * Deliberately left out until the owner confirms (see README owner TODOs):
 * - "Chicken Leg" and "Chicken Wing" are crossed out on the paper lunch menu, so they
 *   aren't under Lunch. They still appear under the chicken Boxes.
 * - A handwritten "Puff" on the breakfast sheet is unclear.
 * - Breakfast and lunch serving times are unknown, so no times are stated anywhere.
 */

export type MenuItem = { name: string; note?: string };

export type MenuGroup = {
  title?: string;
  items: MenuItem[];
  /** Short single words (sauces): shown on one line with dot separators. */
  inline?: boolean;
};

export type MenuCategory = {
  id: "breakfast" | "lunch" | "chicken" | "pizza";
  /** Board header, e.g. "Breakfast". */
  title: string;
  /** Short label for the phone tab bar. */
  tabLabel: string;
  /** Brand line above the title, e.g. "Perfectly Southern®". */
  eyebrow?: string;
  groups: MenuGroup[];
};

export const menu: MenuCategory[] = [
  {
    id: "breakfast",
    title: "Breakfast",
    tabLabel: "Breakfast",
    groups: [
      {
        items: [
          { name: "Bacon Biscuit" },
          { name: "Bacon, Egg & Cheese Biscuit" },
          { name: "Bacon (4 slices)" },
          { name: "Sausage Biscuit" },
          { name: "Sausage, Egg & Cheese Biscuit" },
          { name: "Biscuit & Gravy" },
        ],
      },
    ],
  },
  {
    id: "lunch",
    title: "Lunch",
    tabLabel: "Lunch",
    groups: [
      {
        items: [
          { name: "Chicken Crispito" },
          { name: "Corn Dog" },
          { name: "Egg Roll" },
          { name: "Burritos" },
          { name: "Fried Okra" },
          { name: "Chicken Nuggets" },
          { name: "Chicken Sandwich" },
          { name: "Cheese Sticks (5)" },
          { name: "Onion Rings (5)" },
          { name: "Fried Pickles" },
          // TODO(owner): handwritten note says "Salisbury steak" — confirm which one is served.
          { name: "Pork Rib Sandwich" },
          { name: "Jalapeño Poppers (4)" },
        ],
      },
    ],
  },
  {
    id: "chicken",
    title: "Fried Chicken",
    tabLabel: "Chicken",
    eyebrow: "Perfectly Southern®",
    groups: [
      { title: "Tenders", items: [{ name: "2 Piece or 3 Piece", note: "As a box or chicken only" }] },
      {
        title: "Family Meal",
        items: [{ name: "9 Pieces", note: "With 2 large sides, 4 biscuits and 2 sauces, or chicken only" }],
      },
      {
        title: "Boxes",
        items: [
          { name: "Chicken Sandwich" },
          { name: "1 Piece Crispy Fish" },
          { name: "Livers or Gizzards", note: "Small or large" },
          { name: "Chicken Leg or Chicken Wing" },
        ],
      },
      {
        title: "Sides",
        items: [{ name: "Crispy Fries" }, { name: "Potato Wedges", note: "Regular or large" }],
      },
      {
        title: "Dipping sauces",
        inline: true,
        items: [{ name: "Ranch" }, { name: "BBQ" }, { name: "Hot Sauce" }, { name: "Honey Mustard" }],
      },
    ],
  },
  {
    id: "pizza",
    title: "Pizza & Wings",
    tabLabel: "Pizza",
    eyebrow: "Hunt Brothers®",
    groups: [
      {
        title: "Pizza",
        items: [
          { name: "Hunk A Pizza®", note: "1 or 2 Hunks" },
          { name: "Whole Pizza" },
          { name: "Limited-time pizza", note: "Ask what’s on" },
          { name: "Double Cheese" },
        ],
      },
      {
        title: "Wings",
        items: [{ name: "Southern Style or Hot ’n Spicy", note: "5, 10 or 25 pieces (party size)" }],
      },
      { title: "WingBites®", items: [{ name: "Home Style or Buffalo", note: "5 oz, 10 oz or 25 oz" }] },
      {
        title: "Combos",
        items: [{ name: "Wings Combo", note: "Hunk or Whole Pizza + wings" }, { name: "WingBites® Combo" }],
      },
    ],
  },
];
