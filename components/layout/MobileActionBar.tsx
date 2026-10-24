import { Fuel, Navigation, Phone } from "lucide-react";
import Link from "next/link";
import { store } from "@/content/store";

/** Fixed bottom bar on phones and tablets: Call, Directions, Gas Prices. */
export function MobileActionBar() {
  const item =
    "flex min-h-16 flex-col items-center justify-center gap-1 text-[0.8125rem] font-bold tracking-wide uppercase";
  return (
    <>
      {/* Spacer so the fixed bar never covers the end of the page. */}
      <div aria-hidden="true" className="h-[calc(4rem+3px+env(safe-area-inset-bottom))] lg:hidden" />
      <nav
      aria-label="Quick actions"
      className="on-dark fixed inset-x-0 bottom-0 z-40 border-t-[3px] border-sign-red bg-asphalt pb-[env(safe-area-inset-bottom)] text-limestone lg:hidden"
    >
      <ul className="grid grid-cols-3">
        <li>
          <a href={store.phone.href} className={`${item} bg-sign-red text-white active:bg-ember`}>
            <Phone aria-hidden="true" strokeWidth={1.75} className="size-5" />
            Call
          </a>
        </li>
        <li className="border-r border-white/10">
          <a
            href={store.maps.directions}
            target="_blank"
            rel="noopener noreferrer"
            className={`${item} active:bg-asphalt-2`}
          >
            <Navigation aria-hidden="true" strokeWidth={1.75} className="size-5" />
            Directions
          </a>
        </li>
        <li>
          <Link href="/fuel#prices" className={`${item} active:bg-asphalt-2`}>
            <Fuel aria-hidden="true" strokeWidth={1.75} className="size-5" />
            Gas Prices
          </Link>
        </li>
      </ul>
      </nav>
    </>
  );
}
