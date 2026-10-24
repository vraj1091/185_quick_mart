"use client";

import { formatUpdated } from "@/lib/fuel";
import { useNow } from "@/lib/use-now";

/** "7:12 AM today". The server renders the full date; the browser swaps in today/yesterday. */
export function FuelUpdated({ at }: { at: number }) {
  const now = useNow();
  return <time dateTime={new Date(at).toISOString()}>{formatUpdated(at, now)}</time>;
}
