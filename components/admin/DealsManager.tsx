"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowDown, ArrowUp } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { deleteDeal, moveDeal, saveDeal, setDealActive } from "@/app/admin/actions";
import { cn } from "@/lib/cn";
import { dealSchema, type DealInput } from "@/lib/validation";
import {
  FieldError,
  StatusLine,
  SubmitButton,
  applyFieldErrors,
  dangerButton,
  inputClass,
  labelClass,
  smallButton,
  useActionStatus,
} from "./ui";

export type AdminDeal = {
  id: string;
  title: string;
  priceText: string;
  note: string;
  startsOn: string;
  endsOn: string;
  active: boolean;
  /** "Live", "Off", "Starts Nov 2", "Ended". */
  statusLabel: string;
  isLive: boolean;
};

const emptyDeal: DealInput = { title: "", priceText: "", note: "", startsOn: "", endsOn: "" };

export function DealsManager({ deals }: { deals: AdminDeal[] }) {
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const { status, pending, run } = useActionStatus();
  const liveCount = deals.filter((d) => d.isLive).length;

  return (
    <div className="space-y-5">
      {deals.length === 0 ? (
        <p className="text-muted">No deals yet. The deals section stays hidden on the site until you add one.</p>
      ) : (
        <ul className="divide-y divide-line border-y border-line">
          {deals.map((deal, i) => (
            <li key={deal.id} className="py-4">
              {editing === deal.id ? (
                <DealForm deal={deal} onDone={() => setEditing(null)} />
              ) : (
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-lg font-bold">
                      {deal.title} <span className="font-mono">· {deal.priceText}</span>
                    </p>
                    {deal.note ? <p className="text-muted">{deal.note}</p> : null}
                    <p
                      className={cn(
                        "eyebrow mt-1.5 inline-block rounded-xs px-2 py-1 text-[0.75rem]",
                        deal.isLive ? "bg-deep text-on-deep" : "bg-line text-ink",
                      )}
                    >
                      {deal.statusLabel}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button type="button" className={smallButton} onClick={() => setEditing(deal.id)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      className={smallButton}
                      disabled={pending}
                      onClick={() => run(() => setDealActive(deal.id, !deal.active))}
                    >
                      {deal.active ? "Take down" : "Put up"}
                    </button>
                    <button
                      type="button"
                      className={smallButton}
                      disabled={pending || i === 0}
                      onClick={() => run(() => moveDeal(deal.id, "up"))}
                    >
                      <ArrowUp aria-hidden="true" strokeWidth={1.75} className="size-4" />
                      <span className="sr-only">Move {deal.title} up</span>
                    </button>
                    <button
                      type="button"
                      className={smallButton}
                      disabled={pending || i === deals.length - 1}
                      onClick={() => run(() => moveDeal(deal.id, "down"))}
                    >
                      <ArrowDown aria-hidden="true" strokeWidth={1.75} className="size-4" />
                      <span className="sr-only">Move {deal.title} down</span>
                    </button>
                    <button
                      type="button"
                      className={dangerButton}
                      disabled={pending}
                      onClick={() => {
                        if (confirm(`Delete “${deal.title}” for good?`)) run(() => deleteDeal(deal.id));
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {liveCount > 4 ? (
        <p className="font-semibold text-danger">
          {liveCount} deals are live, but the home page shows the top 4. Use the arrows to choose.
        </p>
      ) : null}

      <StatusLine status={status} />

      {editing === "new" ? (
        <div className="rounded-sm border-2 border-ink bg-surface p-4">
          <DealForm onDone={() => setEditing(null)} />
        </div>
      ) : (
        <button type="button" className={smallButton} onClick={() => setEditing("new")}>
          + Add a deal
        </button>
      )}
    </div>
  );
}

function DealForm({ deal, onDone }: { deal?: AdminDeal; onDone: () => void }) {
  const { status, pending, run } = useActionStatus();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<DealInput>({
    resolver: zodResolver(dealSchema),
    defaultValues: deal
      ? {
          id: deal.id,
          title: deal.title,
          priceText: deal.priceText,
          note: deal.note,
          startsOn: deal.startsOn,
          endsOn: deal.endsOn,
        }
      : emptyDeal,
  });
  const idPrefix = deal ? `deal-${deal.id}` : "deal-new";

  const onSubmit = async (values: DealInput) => {
    const result = await run(() => saveDeal(values));
    applyFieldErrors(result, setError);
    if (result.ok) {
      if (!deal) reset(emptyDeal);
      onDone();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-[2fr_1fr]">
        <div>
          <label htmlFor={`${idPrefix}-title`} className={labelClass}>
            What’s on sale
          </label>
          <input
            id={`${idPrefix}-title`}
            placeholder="2-liter Pepsi products"
            className={`${inputClass} mt-1.5`}
            aria-invalid={!!errors.title}
            {...register("title")}
          />
          <FieldError id={`${idPrefix}-title-error`} message={errors.title?.message} />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-price`} className={labelClass}>
            Price
          </label>
          <input
            id={`${idPrefix}-price`}
            placeholder="2 for $5"
            className={`${inputClass} mt-1.5`}
            aria-invalid={!!errors.priceText}
            {...register("priceText")}
          />
          <FieldError id={`${idPrefix}-price-error`} message={errors.priceText?.message} />
        </div>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-note`} className={labelClass}>
          Note <span className="font-normal text-muted">(optional)</span>
        </label>
        <input
          id={`${idPrefix}-note`}
          placeholder="Mix and match"
          className={`${inputClass} mt-1.5`}
          aria-invalid={!!errors.note}
          {...register("note")}
        />
        <FieldError id={`${idPrefix}-note-error`} message={errors.note?.message} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor={`${idPrefix}-starts`} className={labelClass}>
            Starts <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id={`${idPrefix}-starts`}
            type="date"
            className={`${inputClass} mt-1.5`}
            aria-invalid={!!errors.startsOn}
            {...register("startsOn")}
          />
          <FieldError id={`${idPrefix}-starts-error`} message={errors.startsOn?.message} />
        </div>
        <div>
          <label htmlFor={`${idPrefix}-ends`} className={labelClass}>
            Last day <span className="font-normal text-muted">(optional)</span>
          </label>
          <input
            id={`${idPrefix}-ends`}
            type="date"
            className={`${inputClass} mt-1.5`}
            aria-invalid={!!errors.endsOn}
            {...register("endsOn")}
          />
          <FieldError id={`${idPrefix}-ends-error`} message={errors.endsOn?.message} />
        </div>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton pending={pending}>{deal ? "Save deal" : "Add deal"}</SubmitButton>
        <button type="button" className={smallButton} onClick={onDone}>
          Cancel
        </button>
        <StatusLine status={status} />
      </div>
    </form>
  );
}
