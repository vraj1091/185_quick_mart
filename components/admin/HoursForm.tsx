"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { clearWeeklyHours, saveWeeklyHours } from "@/app/admin/actions";
import { DISPLAY_DAY_ORDER, WEEKDAY_NAMES } from "@/lib/time";
import { weeklyHoursSchema, type WeeklyHoursInput } from "@/lib/validation";
import {
  FieldError,
  StatusLine,
  SubmitButton,
  dangerButton,
  inputClass,
  smallButton,
  useActionStatus,
} from "./ui";

export function HoursForm({ initial, published }: { initial: WeeklyHoursInput; published: boolean }) {
  const { status, pending, run } = useActionStatus();
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    control,
    formState: { errors },
  } = useForm<WeeklyHoursInput>({
    resolver: zodResolver(weeklyHoursSchema),
    defaultValues: initial,
  });
  const days = useWatch({ control, name: "days" });

  const copyMondayToAll = () => {
    const monday = getValues("days.1");
    for (let d = 0; d < 7; d++) {
      setValue(`days.${d}.mode`, monday.mode, { shouldDirty: true });
      setValue(`days.${d}.opens`, monday.opens, { shouldDirty: true });
      setValue(`days.${d}.closes`, monday.closes, { shouldDirty: true });
    }
  };

  return (
    <form onSubmit={handleSubmit((values) => run(() => saveWeeklyHours(values)))} noValidate className="space-y-5">
      {!published ? (
        <p className="rounded-sm border-l-4 border-accent bg-accent-soft px-4 py-3 font-semibold">
          No hours are published yet, so the site says “Call for hours”. Set them below and save.
        </p>
      ) : null}

      <fieldset>
        <legend className="sr-only">Weekly hours</legend>
        <ul className="divide-y divide-line border-y border-line">
          {DISPLAY_DAY_ORDER.map((d) => {
            const mode = days?.[d]?.mode ?? "open";
            const dayErrors = errors.days?.[d];
            return (
              <li key={d} className="grid gap-3 py-4 sm:grid-cols-[8rem_12rem_1fr] sm:items-start">
                <p className="pt-3 text-lg font-extrabold">{WEEKDAY_NAMES[d]}</p>
                <div>
                  <label htmlFor={`day-${d}-mode`} className="sr-only">
                    {WEEKDAY_NAMES[d]}
                  </label>
                  <select id={`day-${d}-mode`} className={inputClass} {...register(`days.${d}.mode`)}>
                    <option value="open">Open</option>
                    <option value="closed">Closed all day</option>
                    <option value="24h">Open 24 hours</option>
                  </select>
                </div>
                {mode === "open" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label htmlFor={`day-${d}-opens`} className="text-sm font-bold">
                        Opens
                      </label>
                      <input
                        id={`day-${d}-opens`}
                        type="time"
                        className={inputClass}
                        aria-invalid={!!dayErrors?.opens}
                        {...register(`days.${d}.opens`)}
                      />
                      <FieldError id={`day-${d}-opens-error`} message={dayErrors?.opens?.message} />
                    </div>
                    <div>
                      <label htmlFor={`day-${d}-closes`} className="text-sm font-bold">
                        Closes
                      </label>
                      <input
                        id={`day-${d}-closes`}
                        type="time"
                        className={inputClass}
                        aria-invalid={!!dayErrors?.closes}
                        {...register(`days.${d}.closes`)}
                      />
                      <FieldError id={`day-${d}-closes-error`} message={dayErrors?.closes?.message} />
                    </div>
                  </div>
                ) : (
                  <p className="pt-3 text-muted">{mode === "24h" ? "Open around the clock." : "Closed."}</p>
                )}
              </li>
            );
          })}
        </ul>
      </fieldset>

      <p className="text-sm text-muted">
        Times are Central. Closing after midnight? Just pick the time, like 2:00 AM, and it counts
        toward the next morning. 12:00 AM means midnight.
      </p>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <SubmitButton pending={pending}>Save hours</SubmitButton>
        <button type="button" className={smallButton} onClick={copyMondayToAll}>
          Copy Monday to every day
        </button>
        {published ? (
          <button
            type="button"
            className={dangerButton}
            disabled={pending}
            onClick={() => {
              if (confirm("Take all hours off the site? It will say “Call for hours”.")) {
                run(() => clearWeeklyHours());
              }
            }}
          >
            Remove hours
          </button>
        ) : null}
      </div>
      <StatusLine status={status} />
    </form>
  );
}
