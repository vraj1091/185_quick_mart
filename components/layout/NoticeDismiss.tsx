"use client";

import { X } from "lucide-react";

export function NoticeDismiss({ id }: { id: string }) {
  return (
    <button
      type="button"
      className="-mr-2 flex min-h-11 min-w-11 shrink-0 items-center justify-center rounded-sm text-limestone/80 hover:text-white"
      onClick={() => {
        try {
          localStorage.setItem("qm-notice", id);
        } catch {
          // Private browsing: the notice just closes for this page view.
        }
        document.documentElement.classList.add("notice-dismissed");
      }}
    >
      <X aria-hidden="true" strokeWidth={1.75} className="size-5" />
      <span className="sr-only">Dismiss notice</span>
    </button>
  );
}
