import Link from "next/link";
import { buttonClass } from "@/components/ui/Button";
import { store } from "@/content/store";
import { mainNav } from "@/lib/site";

/** 404 content, shown inside the site chrome by app/not-found.tsx. */
export function NotFoundContent() {
  return (
    <section className="container-store py-16 lg:py-28">
      <p className="font-mono text-sm font-semibold text-sign-red">404</p>
      <h1 className="type-display type-h1 mt-3 max-w-3xl">That one’s not on the shelf.</h1>
      <p className="measure mt-5 text-lg">
        The page you’re looking for moved or never existed. Try one of these, or call us at{" "}
        <a href={store.phone.href} className="link-store font-mono tabular">
          {store.phone.display}
        </a>
        .
      </p>
      <ul className="mt-8 flex flex-wrap gap-3">
        <li>
          <Link href="/" className={buttonClass("primary")}>
            Home
          </Link>
        </li>
        {mainNav.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={buttonClass("outline")}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
