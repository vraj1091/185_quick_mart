/**
 * Puts the owner-confirmed hours (content/store.ts) into an existing database,
 * for example production after deploying this update.
 *
 *   npm run db:hours              adds them only if no hours are stored yet
 *   npm run db:hours -- --force   replaces whatever is stored (asks nobody, so be sure)
 *
 * If hours are already stored and differ, it lists the differences and changes nothing.
 */
import { PrismaClient } from "@prisma/client";
import { confirmedHours } from "../content/store";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const db = new PrismaClient();

async function main() {
  const force = process.argv.includes("--force");
  const stored = await db.storeHours.findMany({ orderBy: { dayOfWeek: "asc" } });

  if (stored.length > 0 && !force) {
    const diffs = confirmedHours
      .map((want, day) => {
        const have = stored.find((r) => r.dayOfWeek === day);
        const haveText = have ? `${have.opensAt ?? "closed"}–${have.closesAt ?? ""}` : "not set";
        const wantText = `${want.opensAt}–${want.closesAt}`;
        return haveText === wantText ? null : `  ${DAYS[day]}: stored ${haveText}, confirmed ${wantText}`;
      })
      .filter(Boolean);
    if (diffs.length === 0) {
      console.log("Stored hours already match the confirmed hours. Nothing to do.");
    } else {
      console.log("Hours are already stored (maybe edited in /admin), so nothing was changed:");
      console.log(diffs.join("\n"));
      console.log('To replace them with the confirmed hours anyway: npm run db:hours -- --force');
    }
    return;
  }

  await db.$transaction(
    confirmedHours.map((h, dayOfWeek) =>
      db.storeHours.upsert({ where: { dayOfWeek }, update: h, create: { dayOfWeek, ...h } }),
    ),
  );
  console.log(force ? "Replaced the stored hours with the confirmed hours." : "Added the confirmed hours.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
