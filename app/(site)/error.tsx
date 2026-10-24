"use client";

import { buttonClass } from "@/components/ui/Button";
import { store } from "@/content/store";

export default function SiteError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="container-store py-16 lg:py-28">
      <h1 className="type-display type-h1 max-w-3xl">Something went wrong.</h1>
      <p className="measure mt-5 text-lg">
        Sorry about that. Try again, or call the store at{" "}
        <a href={store.phone.href} className="link-store font-mono tabular">
          {store.phone.display}
        </a>
        .
      </p>
      <button type="button" onClick={reset} className={buttonClass("primary", "md", "mt-8")}>
        Try again
      </button>
    </section>
  );
}
