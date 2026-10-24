"use client";

import { Menu, Phone, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { displayAddress, store } from "@/content/store";
import { buttonClass } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { mainNav } from "@/lib/site";

export function HeaderNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <nav aria-label="Main" className="hidden lg:block">
        <ul className="flex items-center gap-1">
          {mainNav.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-current={isActive(item.href) ? "page" : undefined}
                className={cn(
                  "nav-road flex min-h-11 items-center rounded-sm px-3 text-[0.9375rem] font-bold tracking-wide uppercase hover:text-primary focus-visible:text-primary",
                  isActive(item.href) ? "text-primary" : "text-ink",
                )}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="ml-3">
            <a href={store.phone.href} className={buttonClass("primary", "md")}>
              <Phone aria-hidden="true" strokeWidth={1.75} className="size-[1.125rem]" />
              <span>
                Call <span className="font-mono tabular">{store.phone.display}</span>
              </span>
            </a>
          </li>
        </ul>
      </nav>

      <button
        type="button"
        className="-mr-2 flex min-h-11 min-w-11 items-center gap-2 rounded-sm px-2 font-bold tracking-wide text-ink uppercase lg:hidden"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((v) => !v)}
      >
        {open ? (
          <X aria-hidden="true" strokeWidth={1.75} className="size-6" />
        ) : (
          <Menu aria-hidden="true" strokeWidth={1.75} className="size-6" />
        )}
        <span className="text-sm">{open ? "Close" : "Menu"}</span>
      </button>

      <div
        id="mobile-menu"
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-b border-line bg-bg lg:hidden"
      >
        <nav aria-label="Mobile" className="container-store pt-2 pb-6">
          <ul>
            {[{ href: "/", label: "Home" }, ...mainNav].map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cn(
                    "flex min-h-14 items-center justify-between border-b border-line text-lg font-bold uppercase",
                    isActive(item.href) ? "text-primary" : "text-ink",
                  )}
                >
                  {item.label}
                  {isActive(item.href) ? <span aria-hidden="true" className="h-3 w-3 bg-primary" /> : null}
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-muted">{displayAddress}</p>
        </nav>
      </div>
    </>
  );
}
