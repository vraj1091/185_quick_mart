// Points prisma/schema.prisma at the right database engine for DATABASE_URL.
//   file:...            -> sqlite      (local development)
//   postgres(ql)://...  -> postgresql  (production)
// Runs automatically before `npm run build` and `npm run db:push`.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

if (!process.env.DATABASE_URL && existsSync(".env")) {
  try {
    process.loadEnvFile(".env");
  } catch {
    // .env unreadable: fall through and keep the current provider.
  }
}

const url = process.env.DATABASE_URL ?? "";
const provider = /^postgres(ql)?:\/\//i.test(url) ? "postgresql" : "sqlite";
const schemaPath = new URL("../prisma/schema.prisma", import.meta.url);
const schema = readFileSync(schemaPath, "utf8");
const pattern = /(datasource db \{[^}]*?provider\s*=\s*")(sqlite|postgresql)(")/;

if (!pattern.test(schema)) {
  console.error("[prisma-provider] Could not find the datasource provider line in prisma/schema.prisma.");
  process.exit(1);
}

const updated = schema.replace(pattern, `$1${provider}$3`);
if (updated !== schema) {
  writeFileSync(schemaPath, updated);
  console.log(`[prisma-provider] Switched database provider to ${provider}.`);
} else {
  console.log(`[prisma-provider] Using ${provider}.`);
}
