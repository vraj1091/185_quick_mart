/**
 * Hot food menu. Items are empty until the owner supplies the real menu and prices.
 * While a category has no items, the site shows "Ask at the counter for today's menu".
 * Leave `price` out to hide it.
 *
 * Example item: { name: "8-piece mixed chicken", description: "Breast, thigh, leg and wing", price: "$12.99" }
 */

export type MenuItem = { name: string; description?: string; price?: string };

export type MenuCategory = {
  id: "chicken" | "pizza";
  title: string;
  brand: string;
  items: MenuItem[];
};

export const menu: MenuCategory[] = [
  {
    id: "chicken",
    title: "Fried chicken",
    brand: "Perfectly Southern",
    // TODO(owner): real chicken menu (pieces, tenders, sides) and prices.
    items: [],
  },
  {
    id: "pizza",
    title: "Pizza",
    brand: "Hunt Brothers Pizza",
    // TODO(owner): real pizza menu (whole pizzas, slices, toppings) and prices.
    items: [],
  },
];

export function getMenuCategory(id: MenuCategory["id"]): MenuCategory {
  const category = menu.find((c) => c.id === id);
  if (!category) throw new Error(`Unknown menu category: ${id}`);
  return category;
}
