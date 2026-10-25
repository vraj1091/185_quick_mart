// Runs during the Vercel build (npm run vercel-build): creates any missing tables and
// adds the starting data (fuel grades, settings, confirmed hours) where it's missing.
// It never deletes data: `prisma db push` refuses changes that would lose data, and
// the seed only fills in what's empty.
//
// Schema changes use the direct (unpooled) connection when the host provides one,
// because connection poolers can interfere with them.
import { execSync } from "node:child_process";

const url =
  process.env.DATABASE_URL_UNPOOLED ||
  process.env.POSTGRES_URL_NON_POOLING ||
  process.env.DATABASE_URL;

if (!url) {
  console.error("[db-setup] DATABASE_URL is not set. Add a Postgres database to the Vercel project.");
  process.exit(1);
}

const env = { ...process.env, DATABASE_URL: url };
const run = (cmd) => execSync(cmd, { stdio: "inherit", env });

run("npx prisma db push --skip-generate");
run("npx tsx prisma/seed.ts");
console.log("[db-setup] Database is ready.");
