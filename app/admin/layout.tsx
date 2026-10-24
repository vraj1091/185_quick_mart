import type { Metadata } from "next";
import { store } from "@/content/store";

export const metadata: Metadata = {
  title: { absolute: `Owner dashboard | ${store.name}` },
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-dvh bg-limestone">{children}</div>;
}
