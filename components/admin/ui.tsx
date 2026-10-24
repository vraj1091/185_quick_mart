"use client";

import { AlertCircle, Check } from "lucide-react";
import { useState } from "react";
import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { ActionResult } from "@/app/admin/actions";
import { cn } from "@/lib/cn";

export const inputClass =
  "block w-full min-h-12 rounded-sm border border-muted bg-surface px-3 py-2 text-lg text-ink aria-[invalid=true]:border-error disabled:border-line disabled:bg-bg disabled:text-muted";

export const labelClass = "block font-bold";

/** Section card on the dashboard. */
export function AdminSection({
  id,
  title,
  intro,
  children,
}: {
  id: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className="scroll-mt-20 rounded-md border border-line bg-surface p-4 sm:p-6"
    >
      <h2 id={`${id}-title`} className="type-display text-[1.5rem] sm:text-[1.75rem]">
        {title}
      </h2>
      {intro ? <div className="mt-2 text-muted">{intro}</div> : null}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-1.5 font-semibold text-error">
      {message}
    </p>
  );
}

/** Success / error line after a save. Announced to screen readers. */
export function StatusLine({ status }: { status: ActionResult | null }) {
  return (
    <p role="status" aria-live="polite" className="min-h-7 font-semibold">
      {status ? (
        status.ok ? (
          <span className="inline-flex items-center gap-2 text-ink">
            <Check aria-hidden="true" strokeWidth={2} className="size-5 text-accent" />
            {status.message}
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 text-error">
            <AlertCircle aria-hidden="true" strokeWidth={1.75} className="size-5" />
            {status.error}
          </span>
        )
      ) : null}
    </p>
  );
}

/** Copies server-side field errors onto a React Hook Form. */
export function applyFieldErrors<T extends FieldValues>(result: ActionResult, setError: UseFormSetError<T>) {
  if (result.ok || !result.fieldErrors) return;
  for (const [field, messages] of Object.entries(result.fieldErrors)) {
    if (messages?.[0]) setError(field as Path<T>, { message: messages[0] });
  }
}

/** Status state plus a helper that runs a server action and records the result. */
export function useActionStatus() {
  const [status, setStatus] = useState<ActionResult | null>(null);
  const [pending, setPending] = useState(false);

  async function run(action: () => Promise<ActionResult>): Promise<ActionResult> {
    setPending(true);
    setStatus(null);
    try {
      const result = await action();
      setStatus(result);
      return result;
    } catch (err) {
      // Redirects (session expired) are handled by Next; rethrow them.
      if (err && typeof err === "object" && "digest" in err) throw err;
      const result: ActionResult = { ok: false, error: "That didn't save. Check your connection and try again." };
      setStatus(result);
      return result;
    } finally {
      setPending(false);
    }
  }

  return { status, setStatus, pending, run };
}

export function SubmitButton({
  pending,
  children,
  className,
}: {
  pending: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "inline-flex min-h-14 w-full items-center justify-center rounded-sm bg-primary px-6 text-lg font-bold text-on-primary hover:bg-primary-hover disabled:opacity-60 sm:w-auto",
        className,
      )}
    >
      {pending ? "Saving…" : children}
    </button>
  );
}

export const smallButton =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-sm border-2 border-primary px-3 font-bold text-primary hover:bg-accent-soft disabled:opacity-50";

export const dangerButton =
  "inline-flex min-h-11 items-center justify-center gap-1.5 rounded-sm border-2 border-error px-3 font-bold text-error hover:bg-error hover:text-on-primary disabled:opacity-50";
