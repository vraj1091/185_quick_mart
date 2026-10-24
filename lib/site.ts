export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(
  /\/+$/,
  "",
);

export function absoluteUrl(path = "/"): string {
  return new URL(path, `${siteUrl}/`).toString();
}

export const mainNav = [
  { href: "/fuel", label: "Fuel" },
  { href: "/food", label: "Food" },
  { href: "/store", label: "In the Store" },
  { href: "/lottery", label: "Lottery" },
  { href: "/visit", label: "Visit" },
] as const;
