"use client";

import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { RouteBadge } from "@/components/brand/RouteBadge";
import { fullAddress, store } from "@/content/store";
import { cn } from "@/lib/cn";

/**
 * Live Google map of the store, with the address in a caption strip underneath.
 * The map starts loading on its own once the rest of the page has finished, so
 * Google's scripts never slow down the first paint.
 */
export function MapEmbed({ className }: { className?: string }) {
  const [src, setSrc] = useState<string | null>(null);

  useEffect(() => {
    let idle: number | undefined;
    const start = () => {
      const show = () => setSrc(store.maps.embed);
      idle =
        typeof window.requestIdleCallback === "function"
          ? window.requestIdleCallback(show, { timeout: 1500 })
          : window.setTimeout(show, 200);
    };
    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });
    return () => {
      window.removeEventListener("load", start);
      if (idle !== undefined) {
        if (typeof window.cancelIdleCallback === "function") window.cancelIdleCallback(idle);
        window.clearTimeout(idle);
      }
    };
  }, []);

  return (
    <figure className={cn("overflow-hidden rounded-md border border-line bg-surface", className)}>
      <div className="relative aspect-[4/3] w-full bg-surface-alt sm:aspect-[16/11]">
        <p aria-hidden="true" className="absolute inset-0 flex items-center justify-center text-muted">
          Loading map…
        </p>
        {src ? (
          <iframe
            src={src}
            title={`Map showing ${store.name} at ${fullAddress}`}
            className="absolute inset-0 size-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        ) : null}
      </div>
      <figcaption className="on-dark flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-t-[3px] border-accent bg-deep px-4 py-2.5 text-on-deep">
        <span className="flex items-center gap-3 py-1.5">
          <RouteBadge tone="dark" className="text-sm" />
          <span className="leading-tight font-semibold">
            {store.address.streetDisplay}, {store.address.city}, {store.address.region}{" "}
            {store.address.postalCode}
          </span>
        </span>
        <a
          href={store.maps.search}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-1.5 font-bold underline decoration-on-deep-muted decoration-2 underline-offset-4 hover:text-on-deep"
        >
          Open in Google Maps
          <ExternalLink aria-hidden="true" strokeWidth={1.75} className="size-4" />
        </a>
      </figcaption>
    </figure>
  );
}
