import type { Metadata, Viewport } from "next";
import { Overpass, Overpass_Mono } from "next/font/google";
import localFont from "next/font/local";
import { store } from "@/content/store";
import { siteUrl } from "@/lib/site";
import "./globals.css";

// Archivo ExtraBold at 118% width (the wide channel-letter look), pinned to that one
// instance and subset to Latin: 7 KB instead of 88 KB for the full variable font.
// Rebuild it with scripts/build-display-font.py if the width ever changes.
const archivo = localFont({
  src: "./fonts/archivo-display.woff2",
  weight: "800",
  style: "normal",
  display: "swap",
  variable: "--font-archivo",
  adjustFontFallback: "Arial",
});

const overpass = Overpass({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-overpass",
});

const overpassMono = Overpass_Mono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-overpass-mono",
});

const defaultTitle = `${store.name} | BP Gas, Fried Chicken & Lottery on Hwy 185, Bowling Green KY`;
const defaultDescription =
  "BP gas and diesel, Perfectly Southern fried chicken, Hunt Brothers Pizza, coffee, slushies, an ATM, air, ice, and Kentucky Lottery cashing up to $5,000. 1341 Highway 185, Bowling Green, KY.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: `%s | ${store.name}` },
  description: defaultDescription,
  applicationName: store.name,
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: store.name,
    title: defaultTitle,
    description: defaultDescription,
    url: "/",
  },
  twitter: { card: "summary_large_image", title: defaultTitle, description: defaultDescription },
};

export const viewport: Viewport = {
  themeColor: "#1e2023",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-US"
      className={`${archivo.variable} ${overpass.variable} ${overpassMono.variable}`}
      suppressHydrationWarning
    >
      <body>{children}</body>
    </html>
  );
}
