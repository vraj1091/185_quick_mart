"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { buttonClass } from "@/components/ui/Button";
import { fieldClass as inputClass } from "@/components/ui/fields";
import { store } from "@/content/store";
import { cn } from "@/lib/cn";
import { CONTACT_TOPICS, contactSchema, type ContactInput } from "@/lib/validation";

type Status =
  | { type: "idle" }
  | { type: "success"; name: string }
  | { type: "error"; message: string };


export function ContactForm() {
  const [status, setStatus] = useState<Status>({ type: "idle" });
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ContactInput>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", contact: "", topic: "General question", message: "", website: "" },
  });

  const onSubmit = async (values: ContactInput) => {
    setStatus({ type: "idle" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Partial<Record<keyof ContactInput, string[]>>;
      };
      if (res.ok && data.ok) {
        setStatus({ type: "success", name: values.name });
        reset();
        return;
      }
      if (data.fieldErrors) {
        for (const [field, messages] of Object.entries(data.fieldErrors)) {
          if (messages?.[0]) setError(field as keyof ContactInput, { message: messages[0] });
        }
      }
      setStatus({
        type: "error",
        message: data.error ?? `Something went wrong on our end. Please call us at ${store.phone.display}.`,
      });
    } catch {
      setStatus({
        type: "error",
        message: `We couldn't send that. Check your connection, or call us at ${store.phone.display}.`,
      });
    }
  };

  if (status.type === "success") {
    return (
      <div role="status" className="rounded-md border-2 border-primary bg-surface p-6">
        <p className="text-xl font-extrabold">Thanks, {status.name}. We got your message.</p>
        <p className="mt-2 text-muted">
          We’ll get back to you as soon as we can. Need an answer right now? Call{" "}
          <a href={store.phone.href} className="link-store font-mono tabular">
            {store.phone.display}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setStatus({ type: "idle" })}
          className={buttonClass("outline", "md", "mt-5")}
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Your name" error={errors.name?.message} id="contact-name">
          <input
            id="contact-name"
            autoComplete="name"
            className={inputClass}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "contact-name-error" : undefined}
            {...register("name")}
          />
        </Field>
        <Field
          label="Phone or email"
          hint="So we can get back to you."
          error={errors.contact?.message}
          id="contact-contact"
        >
          <input
            id="contact-contact"
            autoComplete="email"
            className={inputClass}
            aria-invalid={!!errors.contact}
            aria-describedby={cn("contact-contact-hint", errors.contact && "contact-contact-error")}
            {...register("contact")}
          />
        </Field>
      </div>

      <Field label="What’s it about?" error={errors.topic?.message} id="contact-topic">
        <select
          id="contact-topic"
          className={cn(inputClass, "appearance-auto")}
          aria-invalid={!!errors.topic}
          aria-describedby={errors.topic ? "contact-topic-error" : undefined}
          {...register("topic")}
        >
          {CONTACT_TOPICS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Message" error={errors.message?.message} id="contact-message">
        <textarea
          id="contact-message"
          rows={5}
          className={cn(inputClass, "min-h-36 resize-y")}
          aria-invalid={!!errors.message}
          aria-describedby={errors.message ? "contact-message-error" : undefined}
          {...register("message")}
        />
      </Field>

      {/* Honeypot: hidden from people and screen readers. */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor="contact-website">Website</label>
        <input id="contact-website" tabIndex={-1} autoComplete="off" {...register("website")} />
      </div>

      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" disabled={isSubmitting} className={buttonClass("primary", "lg")}>
          {isSubmitting ? "Sending…" : "Send message"}
        </button>
        <p className="text-sm text-muted">
          See our{" "}
          <Link href="/privacy" className="underline">
            privacy notice
          </Link>{" "}
          for how we handle your message.
        </p>
      </div>

      <p role="status" aria-live="polite" className="min-h-6 font-semibold text-danger">
        {status.type === "error" ? status.message : ""}
      </p>
    </form>
  );
}

function Field({
  id,
  label,
  hint,
  error,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="font-bold">
        {label}
      </label>
      {hint ? (
        <span id={`${id}-hint`} className="ml-2 text-sm text-muted">
          {hint}
        </span>
      ) : null}
      {children}
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 text-[0.9375rem] font-semibold text-danger">
          {error}
        </p>
      ) : null}
    </div>
  );
}
