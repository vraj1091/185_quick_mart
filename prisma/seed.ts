/**
 * Seeds an empty database with safe defaults. Safe to run more than once.
 *  - Fuel grades with no price (the site shows "Call for today's price").
 *  - No store hours (the site shows "Call for hours" until the owner sets them).
 *  - Default site settings.
 *  - One example deal, switched OFF so it never shows until the owner turns it on.
 */
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  for (const grade of ["regular", "premium", "diesel"]) {
    await db.fuelPrice.upsert({ where: { grade }, update: {}, create: { grade, price: null } });
  }

  await db.siteSettings.upsert({ where: { id: 1 }, update: {}, create: { id: 1 } });

  if ((await db.deal.count()) === 0) {
    await db.deal.create({
      data: {
        title: "2-liter bottles",
        priceText: "2 for $5",
        note: "Example deal from a shelf tag. Check the price, then switch it on.",
        active: false,
        sortOrder: 0,
      },
    });
  }

  console.log("Seed complete: fuel grades, settings, and one inactive example deal.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => db.$disconnect());
