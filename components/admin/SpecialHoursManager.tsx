"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { addSpecialHours, deleteSpecialHours } from "@/app/admin/actions";
import { specialHoursSchema, type SpecialHoursInput } from "@/lib/validation";
import {
  FieldError,
  StatusLine,
  SubmitButton,
  applyFieldErrors,
  dangerButton,
  inputClass,
  labelClass,
  useActionStatus,
} from "./ui";

export type AdminSpecial = { id: string; dateLabel: string; label: string; hoursLabel: string; past: boolean };

const blank: SpecialHoursInput = { date: "", label: "", mode: "closed", opens: "08:00", closes: "14:00" };

export function SpecialHoursManager({ specials }: { specials: AdminSpecial[] }) {
  const list = useActionStatus();
  const form = useActionStatus();
  const {
    register,
    handleSubmit,
    setError,
    reset,
    control,
    formState: { errors },
  } = useForm<SpecialHoursInput>({ resolver: zodResolver(specialHoursSchema), defaultValues: blank });
  const mode = useWatch({ control, name: "mode" });

  const onSubmit = async (values: SpecialHoursInput) => {
    const result = await form.run(() => addSpecialHours(values));
    applyFieldErrors(result, setError);
    if (result.ok) reset(blank);
  };

  return (
    <div className="space-y-6">
      {specials.length > 0 ? (
        <ul className="divide-y divide-line border-y border-line">
          {specials.map((s) => (
            <li key={s.id} className="flex flex-wrap items-center justify-between gap-3 py-3">
              <p className={s.past ? "text-muted" : undefined}>
                <span className="block font-bold">
                  {s.label}
                  {s.past ? " (past)" : null}
                </span>
                {s.dateLabel}: <span className="font-mono">{s.hoursLabel}</span>
              </p>
              <button
                type="button"
                className={dangerButton}
                disabled={list.pending}
                onClick={() => list.run(() => deleteSpecialHours(s.id))}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-muted">No holiday hours set.</p>
      )}
      <StatusLine status={list.status} />

      <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4 rounded-sm border-2 border-ink bg-surface p-4">
        <p className="font-extrabold">Add holiday hours</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="special-date" className={labelClass}>
              Date
            </label>
            <input
              id="special-date"
              type="date"
              className={`${inputClass} mt-1.5`}
              aria-invalid={!!errors.date}
              {...register("date")}
            />
            <FieldError id="special-date-error" message={errors.date?.message} />
          </div>
          <div>
            <label htmlFor="special-label" className={labelClass}>
              Name
            </label>
            <input
              id="special-label"
              placeholder="Thanksgiving"
              className={`${inputClass} mt-1.5`}
              aria-invalid={!!errors.label}
              {...register("label")}
            />
            <FieldError id="special-label-error" message={errors.label?.message} />
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label htmlFor="special-mode" className={labelClass}>
              That day we’re
            </label>
            <select id="special-mode" className={`${inputClass} mt-1.5`} {...register("mode")}>
              <option value="closed">Closed</option>
              <option value="open">Open special hours</option>
              <option value="24h">Open 24 hours</option>
            </select>
          </div>
          {mode === "open" ? (
            <>
              <div>
                <label htmlFor="special-opens" className={labelClass}>
                  Opens
                </label>
                <input
                  id="special-opens"
                  type="time"
                  className={`${inputClass} mt-1.5`}
                  aria-invalid={!!errors.opens}
                  {...register("opens")}
                />
                <FieldError id="special-opens-error" message={errors.opens?.message} />
              </div>
              <div>
                <label htmlFor="special-closes" className={labelClass}>
                  Closes
                </label>
                <input
                  id="special-closes"
                  type="time"
                  className={`${inputClass} mt-1.5`}
                  aria-invalid={!!errors.closes}
                  {...register("closes")}
                />
                <FieldError id="special-closes-error" message={errors.closes?.message} />
              </div>
            </>
          ) : null}
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <SubmitButton pending={form.pending}>Add holiday hours</SubmitButton>
          <StatusLine status={form.status} />
        </div>
      </form>
    </div>
  );
}
