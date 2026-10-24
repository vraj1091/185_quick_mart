"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { saveNotice, saveToggles } from "@/app/admin/actions";
import { noticeSchema, togglesSchema } from "@/lib/validation";
import { FieldError, StatusLine, SubmitButton, applyFieldErrors, inputClass, smallButton, useActionStatus } from "./ui";

type NoticeInput = z.infer<typeof noticeSchema>;
type TogglesInput = z.infer<typeof togglesSchema>;

export function NoticeForm({ initial }: { initial: string }) {
  const { status, pending, run } = useActionStatus();
  const {
    register,
    handleSubmit,
    setError,
    setValue,
    control,
    formState: { errors },
  } = useForm<NoticeInput>({ resolver: zodResolver(noticeSchema), defaultValues: { noticeText: initial } });
  const text = useWatch({ control, name: "noticeText" }) ?? "";

  const submit = async (values: NoticeInput) => {
    const result = await run(() => saveNotice(values));
    applyFieldErrors(result, setError);
  };

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-3">
      <label htmlFor="notice-text" className="sr-only">
        Notice text
      </label>
      <textarea
        id="notice-text"
        rows={2}
        maxLength={160}
        placeholder="Fresh chicken ready by 11 AM"
        className={`${inputClass} min-h-20`}
        aria-invalid={!!errors.noticeText}
        aria-describedby="notice-count"
        {...register("noticeText")}
      />
      <FieldError id="notice-error" message={errors.noticeText?.message} />
      <p id="notice-count" className="text-sm text-slate">
        {text.length}/160 characters. Leave it empty to hide the banner.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SubmitButton pending={pending}>Save notice</SubmitButton>
        {initial ? (
          <button
            type="button"
            className={smallButton}
            disabled={pending}
            onClick={() => {
              setValue("noticeText", "");
              void submit({ noticeText: "" });
            }}
          >
            Remove notice
          </button>
        ) : null}
        <StatusLine status={status} />
      </div>
    </form>
  );
}

export function TogglesForm({ initial }: { initial: TogglesInput }) {
  const { status, pending, run } = useActionStatus();
  const { register, handleSubmit } = useForm<TogglesInput>({
    resolver: zodResolver(togglesSchema),
    defaultValues: initial,
  });

  const toggleRow = "flex min-h-14 cursor-pointer items-start gap-4 rounded-sm border-2 border-concrete bg-white p-4";
  const box = "mt-0.5 size-6 shrink-0 accent-sign-red";

  return (
    <form onSubmit={handleSubmit((values) => run(() => saveToggles(values)))} className="space-y-3">
      <label className={toggleRow}>
        <input type="checkbox" className={box} {...register("hotFoodOn")} />
        <span>
          <span className="block text-lg font-bold">Hot food is available</span>
          <span className="text-slate">Turn off when the kitchen is closed. The site tells people to call first.</span>
        </span>
      </label>
      <label className={toggleRow}>
        <input type="checkbox" className={box} {...register("hiringOn")} />
        <span>
          <span className="block text-lg font-bold">We’re hiring</span>
          <span className="text-slate">Shows a “We’re hiring” box on the Visit page.</span>
        </span>
      </label>
      <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center">
        <SubmitButton pending={pending}>Save settings</SubmitButton>
        <StatusLine status={status} />
      </div>
    </form>
  );
}
