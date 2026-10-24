import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import { MobileActionBar } from "@/components/layout/MobileActionBar";
import { NotFoundContent } from "@/components/layout/NotFoundContent";
import { getSchedule } from "@/lib/data";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default async function NotFound() {
  const schedule = await getSchedule();
  return (
    <>
      <Header />
      <main id="main">
        <NotFoundContent />
      </main>
      <Footer schedule={schedule} />
      <MobileActionBar />
    </>
  );
}
