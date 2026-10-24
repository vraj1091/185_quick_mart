import Link from "next/link";
import { Lockup } from "@/components/brand/Wordmark";
import { HeaderNav } from "./HeaderNav";

export function Header() {
  return (
    <header className="on-dark relative z-30 border-b-[3px] border-accent bg-deep text-on-deep">
      <div className="container-store flex h-16 items-center justify-between gap-4 lg:h-[4.75rem]">
        <Link
          href="/"
          className="-mx-1 flex min-h-11 items-center rounded-sm px-1 text-[1.3125rem] sm:text-[1.5rem]"
        >
          <Lockup />
        </Link>
        <HeaderNav />
      </div>
    </header>
  );
}
