"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { saveFuelPrices } from "@/app/admin/actions";
import { store, type FuelGradeId } from "@/content/store";
import { fuelPricesSchema, type FuelPricesInput } from "@/lib/validation";
import { FieldError, StatusLine, SubmitButton, applyFieldErrors, inputClass, useActionStatus } from "./ui";

export type FuelGradeState = { price: string; savedLabel: string | null; showing: boolean };

export function FuelPricesForm({ initial }: { initial: Record<FuelGradeId, FuelGradeState> }) {
  const { status, pending, run } = useActionStatus();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FuelPricesInput>({
    resolver: zodResolver(fuelPricesSchema),
    defaultValues: {
      regular: initial.regular.price,
      premium: initial.premium.price,
      diesel: initial.diesel.price,
    },
  });

  const onSubmit = async (values: FuelPricesInput) => {
    const result = await run(() => saveFuelPrices(values));
    applyFieldErrors(result, setError);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-3">
        {store.fuel.grades.map((g) => {
          const state = initial[g.id];
          const error = errors[g.id]?.message;
          return (
            <div key={g.id}>
              <label htmlFor={`price-${g.id}`} className="block text-lg font-extrabold uppercase">
                {g.label}
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 font-mono text-xl text-slate">
                  $
                </span>
                <input
                  id={`price-${g.id}`}
                  inputMode="decimal"
                  autoComplete="off"
                  placeholder="2.799"
                  className={`${inputClass} pl-8 font-mono text-2xl tabular`}
                  aria-invalid={!!error}
                  aria-describedby={`price-${g.id}-saved${error ? ` price-${g.id}-error` : ""}`}
                  {...register(g.id)}
                />
              </div>
              <FieldError id={`price-${g.id}-error`} message={error} />
              <p id={`price-${g.id}-saved`} className="mt-1.5 text-sm text-slate">
                {state.savedLabel ? `Saved ${state.savedLabel}` : "Not set yet"}
                {state.savedLabel && !state.showing ? (
                  <span className="block font-semibold text-sign-red">
                    Hidden on the site: older than 48 hours.
                  </span>
                ) : null}
              </p>
            </div>
          );
        })}
      </div>
      <p className="text-sm text-slate">
        Type prices like the sign: $2.79⁹⁄₁₀ is <span className="font-mono">2.799</span>. Leave a box
        empty to hide that grade. Prices hide themselves 48 hours after you save, so save every
        morning, even if nothing changed.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-5">
        <SubmitButton pending={pending}>Save prices</SubmitButton>
        <StatusLine status={status} />
      </div>
    </form>
  );
}
