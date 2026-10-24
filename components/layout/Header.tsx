import Link from "next/link";
import { Lockup } from "@/components/brand/Wordmark";
import { HeaderNav } from "./HeaderNav";
import { ScrollFlag } from "./ScrollFlag";

/** White sticky header. Scroll styling lives in globals.css (.site-header). */
export function Header() {
  return (
    <header className="site-header sticky top-0 z-30 bg-bg text-ink lg:-top-5">
      <ScrollFlag />
      <div className="site-header-inner container-store flex h-16 items-center justify-between gap-4 lg:h-[5.5rem]">
        <Link
          href="/"
          className="-mx-1 flex min-h-11 items-center rounded-sm px-1 text-[1.3125rem] sm:text-[1.5rem]"
        >
          <Lockup className="site-lockup" />
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
