import { Fuel, Navigation, Phone } from "lucide-react";
import Link from "next/link";
import { store } from "@/content/store";

/** Fixed bottom bar on phones and tablets: Call (filled), Directions and Gas Prices (outlined). */
export function MobileActionBar() {
  const item =
    "flex min-h-12 flex-col items-center justify-center gap-0.5 rounded-sm text-[0.75rem] font-bold tracking-wide uppercase";
  const outlined = `${item} border-2 border-primary text-primary active:bg-accent-soft`;
  return (
    <>
      {/* Spacer so the fixed bar never covers the end of the page. */}
      <div aria-hidden="true" className="h-[calc(4rem+1px+env(safe-area-inset-bottom))] lg:hidden" />
      <nav
        aria-label="Quick actions"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-bg pb-[env(safe-area-inset-bottom)] lg:hidden"
      >
        <ul className="grid grid-cols-3 gap-2 p-2">
          <li>
            <a href={store.phone.href} className={`${item} bg-primary text-on-primary active:bg-primary-hover`}>
              <Phone aria-hidden="true" strokeWidth={1.75} className="size-5" />
              Call
            </a>
          </li>
          <li>
            <a href={store.maps.directions} target="_blank" rel="noopener noreferrer" className={outlined}>
              <Navigation aria-hidden="true" strokeWidth={1.75} className="size-5" />
              Directions
            </a>
          </li>
          <li>
            <Link href="/fuel#prices" className={outlined}>
              <Fuel aria-hidden="true" strokeWidth={1.75} className="size-5" />
              Gas Prices
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
