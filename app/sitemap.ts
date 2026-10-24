import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: { path: string; priority: number; changeFrequency: "daily" | "weekly" | "yearly" }[] = [
    { path: "/", priority: 1, changeFrequency: "daily" },
    { path: "/fuel", priority: 0.9, changeFrequency: "daily" },
    { path: "/food", priority: 0.8, changeFrequency: "weekly" },
    { path: "/store", priority: 0.7, changeFrequency: "weekly" },
    { path: "/lottery", priority: 0.8, changeFrequency: "weekly" },
    { path: "/visit", priority: 0.9, changeFrequency: "weekly" },
    { path: "/privacy", priority: 0.2, changeFrequency: "yearly" },
  ];
  return pages.map((p) => ({
    url: absoluteUrl(p.path),
    changeFrequency: p.changeFrequency,
    priority: p.priority,
  }));
}
