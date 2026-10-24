import { ExternalLink, LogOut } from "lucide-react";
import Link from "next/link";
import { logoutAction } from "./actions";
import { DealsManager, type AdminDeal } from "@/components/admin/DealsManager";
import { FuelPricesForm, type FuelGradeState } from "@/components/admin/FuelPricesForm";
import { HoursForm } from "@/components/admin/HoursForm";
import { Inbox, type AdminMessage } from "@/components/admin/Inbox";
import { NoticeForm, TogglesForm } from "@/components/admin/SettingsForms";
import { SpecialHoursManager, type AdminSpecial } from "@/components/admin/SpecialHoursManager";
import { AdminSection } from "@/components/admin/ui";
import { Lockup } from "@/components/brand/Wordmark";
import { store, type FuelGradeId } from "@/content/store";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatUpdated, isPriceFresh } from "@/lib/fuel";
import { formatDayHours, toDayHours } from "@/lib/hours";
import { formatDateKey, utcMidnightToDateKey, zonedParts } from "@/lib/time";
import { columnsToHoursInput } from "@/lib/validation";

export const dynamic = "force-dynamic";

const dateFmt = new Intl.DateTimeFormat("en-US", {
  timeZone: store.timeZone,
  month: "short",
  day: "numeric",
});

export default async function AdminPage() {
  await requireAdmin();

  const now = new Date();
  const nowMs = now.getTime();
  const todayKey = zonedParts(now).dateKey;

  const [fuelRows, deals, weekly, specials, settings, messages] = await Promise.all([
    db.fuelPrice.findMany(),
    db.deal.findMany({ orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }] }),
    db.storeHours.findMany(),
    db.specialHours.findMany({
      where: { date: { gte: new Date(nowMs - 30 * 86_400_000) } },
      orderBy: { date: "asc" },
    }),
    db.siteSettings.findUnique({ where: { id: 1 } }),
    db.contactMessage.findMany({ orderBy: { createdAt: "desc" }, take: 100 }),
  ]);

  const fuelInitial = Object.fromEntries(
    store.fuel.grades.map((g) => {
      const row = fuelRows.find((r) => r.grade === g.id);
      const price = row?.price != null ? Number(row.price) : null;
      const updatedAt = row?.price != null ? row.updatedAt.toISOString() : null;
      const state: FuelGradeState = {
        price: price !== null ? String(price) : "",
        savedLabel: updatedAt ? formatUpdated(Date.parse(updatedAt), nowMs) : null,
        showing: isPriceFresh({ grade: g.id, price, updatedAt }, nowMs),
      };
      return [g.id, state];
    }),
  ) as Record<FuelGradeId, FuelGradeState>;

  const adminDeals: AdminDeal[] = deals.map((d) => {
    const started = !d.startsAt || d.startsAt <= now;
    const ended = !!d.endsAt && d.endsAt <= now;
    const isLive = d.active && started && !ended;
    let statusLabel = "Off";
    if (d.active) {
      if (ended) statusLabel = "Ended";
      else if (!started) statusLabel = `Starts ${dateFmt.format(d.startsAt!)}`;
      else statusLabel = d.endsAt ? `Live through ${dateFmt.format(new Date(d.endsAt.getTime() - 60_000))}` : "Live";
    }
    return {
      id: d.id,
      title: d.title,
      priceText: d.priceText,
      note: d.note ?? "",
      startsOn: d.startsAt ? zonedParts(d.startsAt).dateKey : "",
      endsOn: d.endsAt ? zonedParts(new Date(d.endsAt.getTime() - 60_000)).dateKey : "",
      active: d.active,
      statusLabel,
      isLive,
    };
  });

  const hoursInitial = {
    days: Array.from({ length: 7 }, (_, day) => {
      const row = weekly.find((w) => w.dayOfWeek === day);
      return row
        ? columnsToHoursInput(row.opensAt, row.closesAt)
        : { mode: "open" as const, opens: "06:00", closes: "22:00" };
    }),
  };

  const adminSpecials: AdminSpecial[] = specials.map((s) => {
    const key = utcMidnightToDateKey(s.date);
    return {
      id: s.id,
      dateLabel: formatDateKey(key),
      label: s.label,
      hoursLabel: formatDayHours(toDayHours(s.opensAt, s.closesAt)),
      past: key < todayKey,
    };
  });

  const adminMessages: AdminMessage[] = messages.map((m) => ({
    id: m.id,
    name: m.name,
    contact: m.contact,
    topic: m.topic,
    message: m.message,
    receivedLabel: formatUpdated(m.createdAt.getTime(), nowMs),
    read: m.readAt !== null,
  }));
  const unread = adminMessages.filter((m) => !m.read).length;

  const sections = [
    { id: "prices", label: "Prices" },
    { id: "deals", label: "Deals" },
    { id: "hours", label: "Hours" },
    { id: "notice", label: "Notice" },
    { id: "settings", label: "Settings" },
    { id: "inbox", label: unread ? `Inbox (${unread})` : "Inbox" },
  ];

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-bg text-ink">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between gap-3 px-4">
          <span className="text-[1rem] sm:text-[1.25rem]">
            <Lockup />
          </span>
          <div className="flex items-center gap-1">
            <Link
              href="/"
              target="_blank"
              className="flex min-h-11 items-center gap-1.5 rounded-sm px-2 text-sm font-bold whitespace-nowrap hover:text-primary"
            >
              Site
              <ExternalLink aria-hidden="true" strokeWidth={1.75} className="size-4" />
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex min-h-11 items-center gap-1.5 rounded-sm px-2 text-sm font-bold whitespace-nowrap hover:text-primary"
              >
                <LogOut aria-hidden="true" strokeWidth={1.75} className="size-4" />
                Log out
              </button>
            </form>
          </div>
        </div>
        <nav aria-label="Dashboard sections" className="border-t border-line">
          <ul className="mx-auto flex max-w-4xl gap-1 overflow-x-auto px-2">
            {sections.map((s) => (
              <li key={s.id} className="shrink-0">
                <a
                  href={`#${s.id}`}
                  className="flex min-h-11 items-center px-2.5 text-sm font-bold tracking-wide uppercase hover:text-primary"
                >
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      <main className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:py-8">
        <h1 className="type-display text-[2rem]">Owner dashboard</h1>

        <AdminSection
          id="prices"
          title="Fuel prices"
          intro="Saving updates the price board on the website right away, with today’s time."
        >
          <FuelPricesForm initial={fuelInitial} />
        </AdminSection>

        <AdminSection
          id="deals"
          title="Deals"
          intro="The home page shows up to four live deals as shelf price tags."
        >
          <DealsManager deals={adminDeals} />
        </AdminSection>

        <AdminSection id="hours" title="Store hours" intro="Used for “Open now” and the hours table.">
          <HoursForm initial={hoursInitial} published={weekly.length > 0} />
          <h3 className="mt-10 mb-3 text-xl font-extrabold">Holiday hours</h3>
          <SpecialHoursManager specials={adminSpecials} />
        </AdminSection>

        <AdminSection
          id="notice"
          title="Notice banner"
          intro="A short line at the top of every page, like “Fresh chicken ready by 11 AM”."
        >
          <NoticeForm initial={settings?.noticeText ?? ""} />
        </AdminSection>

        <AdminSection id="settings" title="Switches">
          <TogglesForm
            initial={{ hotFoodOn: settings?.hotFoodOn ?? true, hiringOn: settings?.hiringOn ?? false }}
          />
        </AdminSection>

        <AdminSection
          id="inbox"
          title="Inbox"
          intro="Messages from the contact form. They’re deleted automatically after 12 months."
        >
          <Inbox messages={adminMessages} />
        </AdminSection>
      </main>
    </>
  );
}
