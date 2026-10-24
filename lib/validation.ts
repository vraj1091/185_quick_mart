/**
 * Zod schemas shared by the browser (React Hook Form) and the server (API route and
 * server actions). The server always re-validates.
 */
import { z } from "zod";
import { isDateKey } from "./time";

/* ---------- Contact form ---------- */

export const CONTACT_TOPICS = [
  "General question",
  "Hot food",
  "Fuel",
  "Lottery",
  "Jobs",
  "Something else",
] as const;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isPhoneOrEmail(value: string): boolean {
  const v = value.trim();
  if (EMAIL_RE.test(v)) return true;
  if (!/^[+\d\s().-]+$/.test(v)) return false;
  const digits = v.replace(/\D/g, "");
  return digits.length >= 10 && digits.length <= 15;
}

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please tell us your name.")
    .max(80, "That name is a little long. Keep it under 80 characters."),
  contact: z
    .string()
    .trim()
    .min(1, "Leave a phone number or email so we can get back to you.")
    .max(120, "That's longer than a phone number or email should be.")
    .refine(isPhoneOrEmail, "That doesn't look like a phone number or email. Give it another look."),
  topic: z.enum(CONTACT_TOPICS, { error: "Pick the topic that fits best." }),
  message: z
    .string()
    .trim()
    .min(5, "Add a few more words so we know how to help.")
    .max(2000, "Please keep it under 2,000 characters."),
  /** Honeypot. People never see this field; bots fill it in. */
  website: z.string().max(500).optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;

/* ---------- Admin: fuel prices ---------- */

const priceField = z
  .string()
  .trim()
  .refine((v) => v === "" || /^\d{1,2}(\.\d{1,3})?$/.test(v), "Type it like 2.799")
  .refine(
    (v) => v === "" || (Number(v) >= 0.5 && Number(v) <= 15),
    "That price looks off. Check the number.",
  );

export const fuelPricesSchema = z.object({
  regular: priceField,
  premium: priceField,
  diesel: priceField,
});

export type FuelPricesInput = z.infer<typeof fuelPricesSchema>;

/* ---------- Admin: deals ---------- */

const optionalDateKey = z
  .string()
  .trim()
  .refine((v) => v === "" || isDateKey(v), "Pick a date.");

export const dealSchema = z
  .object({
    id: z.string().optional(),
    title: z
      .string()
      .trim()
      .min(2, "What's on sale?")
      .max(80, "Keep the name under 80 characters."),
    priceText: z
      .string()
      .trim()
      .min(1, "Add the price, like 2 for $5.")
      .max(30, "Keep the price short, like 2 for $5."),
    note: z.string().trim().max(120, "Keep the note under 120 characters."),
    startsOn: optionalDateKey,
    endsOn: optionalDateKey,
  })
  .refine((v) => !v.startsOn || !v.endsOn || v.endsOn >= v.startsOn, {
    path: ["endsOn"],
    message: "The end date is before the start date.",
  });

export type DealInput = z.infer<typeof dealSchema>;

/* ---------- Admin: hours ---------- */

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
export const HOURS_MODES = ["open", "closed", "24h"] as const;

type HoursFields = { mode: (typeof HOURS_MODES)[number]; opens: string; closes: string };

function checkHours(v: HoursFields, ctx: z.RefinementCtx) {
  if (v.mode !== "open") return;
  if (!TIME_RE.test(v.opens)) {
    ctx.addIssue({ code: "custom", path: ["opens"], message: "Pick an opening time." });
  }
  if (!TIME_RE.test(v.closes)) {
    ctx.addIssue({ code: "custom", path: ["closes"], message: "Pick a closing time." });
  }
  if (TIME_RE.test(v.opens) && v.opens === v.closes) {
    ctx.addIssue({
      code: "custom",
      path: ["closes"],
      message: "Same open and close time. Choose “Open 24 hours” instead.",
    });
  }
}

export const dayHoursInputSchema = z
  .object({ mode: z.enum(HOURS_MODES), opens: z.string(), closes: z.string() })
  .superRefine(checkHours);

export type DayHoursInput = z.infer<typeof dayHoursInputSchema>;

export const weeklyHoursSchema = z.object({
  /** Index 0 = Sunday. */
  days: z.array(dayHoursInputSchema).length(7),
});

export type WeeklyHoursInput = z.infer<typeof weeklyHoursSchema>;

export const specialHoursSchema = z
  .object({
    date: z.string().refine(isDateKey, "Pick a date."),
    label: z.string().trim().min(2, "Name the day, like Thanksgiving.").max(60),
    mode: z.enum(HOURS_MODES),
    opens: z.string(),
    closes: z.string(),
  })
  .superRefine(checkHours);

export type SpecialHoursInput = z.infer<typeof specialHoursSchema>;

/** Form fields -> database columns. */
export function hoursInputToColumns(v: HoursFields): { opensAt: string | null; closesAt: string | null } {
  if (v.mode === "closed") return { opensAt: null, closesAt: null };
  if (v.mode === "24h") return { opensAt: "00:00", closesAt: "24:00" };
  return { opensAt: v.opens, closesAt: v.closes === "00:00" ? "24:00" : v.closes };
}

/** Database columns -> form fields. */
export function columnsToHoursInput(opensAt: string | null, closesAt: string | null): HoursFields {
  if (!opensAt || !closesAt) return { mode: "closed", opens: "06:00", closes: "22:00" };
  if (opensAt === "00:00" && (closesAt === "24:00" || closesAt === "00:00")) {
    return { mode: "24h", opens: "00:00", closes: "00:00" };
  }
  return { mode: "open", opens: opensAt, closes: closesAt === "24:00" ? "00:00" : closesAt };
}

/* ---------- Admin: notice and toggles ---------- */

export const noticeSchema = z.object({
  noticeText: z.string().trim().max(160, "Keep the notice under 160 characters."),
});

export const togglesSchema = z.object({
  hotFoodOn: z.boolean(),
  hiringOn: z.boolean(),
});

export const loginSchema = z.object({
  password: z.string().min(1, "Enter the password.").max(200),
});
