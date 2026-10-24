"use client";

import { useActionState } from "react";
import { loginAction, type LoginState } from "@/app/admin/actions";
import { inputClass, labelClass } from "./ui";

export function LoginForm() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(loginAction, {});

  return (
    <form action={formAction} className="mt-8 space-y-5">
      <div>
        <label htmlFor="password" className={labelClass}>
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
          className={`${inputClass} mt-1.5`}
          aria-invalid={!!state.error}
          aria-describedby={state.error ? "login-error" : undefined}
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="inline-flex min-h-14 w-full items-center justify-center rounded-sm bg-primary px-6 text-lg font-bold text-on-primary hover:bg-primary-hover disabled:opacity-60"
      >
        {pending ? "Checking…" : "Log in"}
      </button>
      <p id="login-error" role="status" aria-live="polite" className="min-h-7 font-semibold text-error">
        {state.error ?? ""}
      </p>
    </form>
  );
}
