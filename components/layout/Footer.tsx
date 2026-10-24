import Link from "next/link";
import { Sep } from "@/components/brand/Sep";
import { Lockup, Tagline } from "@/components/brand/Wordmark";
import { store } from "@/content/store";
import { summarizeWeek, type Schedule } from "@/lib/hours";
import { mainNav } from "@/lib/site";

export function Footer({ schedule }: { schedule: Schedule }) {
  const hours = summarizeWeek(schedule);
  const year = new Date().getFullYear();

  return (
    <footer className="on-dark border-t-[3px] border-sign-red bg-asphalt text-limestone">
      <div className="container-store grid gap-10 py-14 md:grid-cols-12 lg:py-16">
        <div className="md:col-span-5">
          <Link href="/" className="inline-flex min-h-11 items-center rounded-sm text-[1.75rem]">
            <Lockup />
          </Link>
          <Tagline className="mt-3 text-limestone/80" />
          <address className="mt-6 leading-relaxed not-italic">
            <a
              href={store.maps.directions}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:underline"
            >
              {store.address.streetDisplay}
              <br />
              {store.address.city}, {store.address.region} {store.address.postalCode}
            </a>
            <br />
            <a href={store.phone.href} className="mt-2 inline-block font-mono text-lg tabular hover:text-white">
              {store.phone.display}
            </a>
          </address>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow text-limestone/70">Hours</h2>
          {hours.length > 0 ? (
            <dl className="mt-3 space-y-1.5">
              {hours.map((row) => (
                <div key={row.days} className="flex justify-between gap-4 md:block">
                  <dt className="font-semibold">{row.days}</dt>
                  <dd className="font-mono text-limestone/85 tabular">{row.hours}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-3">
              <a href={store.phone.href} className="link-store">
                Call for hours
              </a>
            </p>
          )}
          <Link href="/visit" className="mt-4 inline-block text-sm text-limestone/75 underline hover:text-white">
            Holiday hours & directions
          </Link>
        </div>

        <nav aria-label="Footer" className="md:col-span-4">
          <h2 className="eyebrow text-limestone/70">Around the store</h2>
          <ul className="mt-2 grid grid-cols-2 gap-x-6">
            <li>
              <Link href="/" className="flex min-h-11 items-center hover:text-white hover:underline">
                Home
              </Link>
            </li>
            {mainNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="flex min-h-11 items-center hover:text-white hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="border-t border-white/10">
        <div className="container-store space-y-2 py-6 text-sm text-limestone/75">
          <p className="font-semibold text-limestone/90">
            Must be 21+ to purchase tobacco. Must be 18+ to play the Kentucky Lottery.
          </p>
          <p>
            {store.name} is an independently owned {store.fuelBrand}-branded station. BP and the BP
            logo are trademarks of BP p.l.c.
          </p>
          <p>
            © {year} {store.name}
            <Sep />
            <Link href="/privacy" className="underline hover:text-white">
              Privacy
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
