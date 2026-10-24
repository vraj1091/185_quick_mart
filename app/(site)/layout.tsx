import { JsonLd } from "@/components/JsonLd";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { NoticeBanner } from "@/components/layout/NoticeBanner";
import { getSchedule, getSettings } from "@/lib/data";
import { storeJsonLd } from "@/lib/seo";

// Public pages are static and rebuilt at most every 10 minutes, and right away after
// any save in /admin. Fuel prices and open/closed status are re-checked in the browser.
export const revalidate = 600;

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [settings, schedule] = await Promise.all([getSettings(), getSchedule()]);

  return (
    <>
      <a
        href="#main"
        className="sr-only z-50 rounded-sm bg-primary px-4 py-3 font-bold text-on-primary focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Skip to main content
      </a>
      <NoticeBanner text={settings.noticeText} />
      <Header />
      <main id="main" tabIndex={-1} className="focus:outline-none">
        {children}
      </main>
      <Footer schedule={schedule} />
      <MobileActionBar />
      <JsonLd data={storeJsonLd(schedule)} />
    </>
  );
}
