"use server";

import { Prisma } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getAdminSession, requireAdmin, verifyAdminPassword } from "@/lib/auth";
import { db } from "@/lib/db";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { dateKeyToUtcMidnight, zonedTimeToUtc } from "@/lib/time";
import {
  dealSchema,
  fuelPricesSchema,
  hoursInputToColumns,
  loginSchema,
  noticeSchema,
  specialHoursSchema,
  togglesSchema,
  weeklyHoursSchema,
  type DealInput,
  type FuelPricesInput,
  type SpecialHoursInput,
  type WeeklyHoursInput,
} from "@/lib/validation";

export type ActionResult =
  | { ok: true; message: string }
  | { ok: false; error: string; fieldErrors?: Record<string, string[] | undefined> };

function invalid(error: z.ZodError): ActionResult {
  return {
    ok: false,
    error: "Some fields need a second look.",
    fieldErrors: z.flattenError(error).fieldErrors as Record<string, string[] | undefined>,
  };
}

/** Rebuild every public page so changes show up right away. */
function refreshSite() {
  revalidatePath("/", "layout");
}

async function guarded(work: () => Promise<ActionResult>): Promise<ActionResult> {
  await requireAdmin();
  try {
    return await work();
  } catch (err) {
    console.error("Admin action failed:", err);
    return { ok: false, error: "That didn't save. Check your connection and try again." };
  }
}

/* ---------- Login / logout ---------- */

export type LoginState = { error?: string };

export async function loginAction(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ password: formData.get("password") ?? "" });
  if (!parsed.success) return { error: "Enter the password." };

  const limit = await rateLimit(await clientKey("login"), 5, 15 * 60 * 1000);
  if (!limit.ok) {
    const minutes = Math.ceil(limit.retryAfterSeconds / 60);
    return { error: `Too many tries. Wait ${minutes} minute${minutes === 1 ? "" : "s"} and try again.` };
  }

  if (!(await verifyAdminPassword(parsed.data.password))) {
    return { error: "That password isn't right." };
  }

  const session = await getAdminSession();
  session.isAdmin = true;
  session.loggedInAt = Date.now();
  await session.save();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  const session = await getAdminSession();
  session.destroy();
  redirect("/admin/login");
}

/* ---------- Fuel prices ---------- */

export async function saveFuelPrices(input: FuelPricesInput): Promise<ActionResult> {
  return guarded(async () => {
    const parsed = fuelPricesSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    const entries = Object.entries(parsed.data) as [keyof FuelPricesInput, string][];
    await db.$transaction(
      entries.map(([grade, value]) => {
        const price = value === "" ? null : new Prisma.Decimal(value);
        return db.fuelPrice.upsert({
          where: { grade },
          update: { price },
          create: { grade, price },
        });
      }),
    );
    refreshSite();
    return { ok: true, message: "Prices saved. They’re live on the site now." };
  });
}

/* ---------- Deals ---------- */

function dealDates(input: DealInput) {
  return {
    startsAt: input.startsOn ? zonedTimeToUtc(input.startsOn, 0) : null,
    // Ends at the end of that day, store time.
    endsAt: input.endsOn ? zonedTimeToUtc(input.endsOn, 24 * 60) : null,
  };
}

export async function saveDeal(input: DealInput): Promise<ActionResult> {
  return guarded(async () => {
    const parsed = dealSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    const d = parsed.data;
    const data = {
      title: d.title,
      priceText: d.priceText,
      note: d.note || null,
      ...dealDates(d),
    };
    if (d.id) {
      await db.deal.update({ where: { id: d.id }, data });
    } else {
      const last = await db.deal.findFirst({ orderBy: { sortOrder: "desc" } });
      await db.deal.create({ data: { ...data, active: true, sortOrder: (last?.sortOrder ?? 0) + 1 } });
    }
    refreshSite();
    return { ok: true, message: d.id ? "Deal updated." : "Deal added and live." };
  });
}

export async function setDealActive(id: string, active: boolean): Promise<ActionResult> {
  return guarded(async () => {
    await db.deal.update({ where: { id: z.string().parse(id) }, data: { active } });
    refreshSite();
    return { ok: true, message: active ? "Deal is live." : "Deal taken down." };
  });
}

export async function deleteDeal(id: string): Promise<ActionResult> {
  return guarded(async () => {
    await db.deal.delete({ where: { id: z.string().parse(id) } });
    refreshSite();
    return { ok: true, message: "Deal deleted." };
  });
}

export async function moveDeal(id: string, direction: "up" | "down"): Promise<ActionResult> {
  return guarded(async () => {
    const deals = await db.deal.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] });
    const index = deals.findIndex((d) => d.id === id);
    const swapWith = direction === "up" ? index - 1 : index + 1;
    if (index < 0 || swapWith < 0 || swapWith >= deals.length) {
      return { ok: true, message: "Already there." };
    }
    const reordered = [...deals];
    [reordered[index], reordered[swapWith]] = [reordered[swapWith]!, reordered[index]!];
    await db.$transaction(
      reordered.map((d, i) => db.deal.update({ where: { id: d.id }, data: { sortOrder: i } })),
    );
    refreshSite();
    return { ok: true, message: "Order saved." };
  });
}

/* ---------- Hours ---------- */

export async function saveWeeklyHours(input: WeeklyHoursInput): Promise<ActionResult> {
  return guarded(async () => {
    const parsed = weeklyHoursSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    await db.$transaction(
      parsed.data.days.map((day, dayOfWeek) => {
        const columns = hoursInputToColumns(day);
        return db.storeHours.upsert({
          where: { dayOfWeek },
          update: columns,
          create: { dayOfWeek, ...columns },
        });
      }),
    );
    refreshSite();
    return { ok: true, message: "Hours saved. The site shows open/closed from these now." };
  });
}

export async function clearWeeklyHours(): Promise<ActionResult> {
  return guarded(async () => {
    await db.storeHours.deleteMany();
    refreshSite();
    return { ok: true, message: "Hours removed. The site now says “Call for hours”." };
  });
}

export async function addSpecialHours(input: SpecialHoursInput): Promise<ActionResult> {
  return guarded(async () => {
    const parsed = specialHoursSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    const date = dateKeyToUtcMidnight(parsed.data.date);
    const columns = hoursInputToColumns(parsed.data);
    await db.$transaction([
      db.specialHours.deleteMany({ where: { date } }),
      db.specialHours.create({ data: { date, label: parsed.data.label, ...columns } }),
    ]);
    refreshSite();
    return { ok: true, message: "Holiday hours saved." };
  });
}

export async function deleteSpecialHours(id: string): Promise<ActionResult> {
  return guarded(async () => {
    await db.specialHours.delete({ where: { id: z.string().parse(id) } });
    refreshSite();
    return { ok: true, message: "Holiday hours removed." };
  });
}

/* ---------- Notice banner and switches ---------- */

export async function saveNotice(input: { noticeText: string }): Promise<ActionResult> {
  return guarded(async () => {
    const parsed = noticeSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    const noticeText = parsed.data.noticeText || null;
    await db.siteSettings.upsert({
      where: { id: 1 },
      update: { noticeText },
      create: { id: 1, noticeText },
    });
    refreshSite();
    return { ok: true, message: noticeText ? "Notice is up on every page." : "Notice removed." };
  });
}

export async function saveToggles(input: { hotFoodOn: boolean; hiringOn: boolean }): Promise<ActionResult> {
  return guarded(async () => {
    const parsed = togglesSchema.safeParse(input);
    if (!parsed.success) return invalid(parsed.error);
    await db.siteSettings.upsert({
      where: { id: 1 },
      update: parsed.data,
      create: { id: 1, ...parsed.data },
    });
    refreshSite();
    return { ok: true, message: "Settings saved." };
  });
}

/* ---------- Inbox ---------- */

export async function setMessageRead(id: string, read: boolean): Promise<ActionResult> {
  return guarded(async () => {
    await db.contactMessage.update({
      where: { id: z.string().parse(id) },
      data: { readAt: read ? new Date() : null },
    });
    revalidatePath("/admin");
    return { ok: true, message: read ? "Marked as read." : "Marked as unread." };
  });
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  return guarded(async () => {
    await db.contactMessage.delete({ where: { id: z.string().parse(id) } });
    revalidatePath("/admin");
    return { ok: true, message: "Message deleted." };
  });
}
