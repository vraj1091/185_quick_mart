import "server-only";
import { createHash } from "node:crypto";
import { headers } from "next/headers";
import { db } from "./db";

/**
 * Database-backed rate limiting, so it still works on serverless hosts where
 * in-memory counters reset between requests.
 */
export async function rateLimit(
  key: string,
  limit: number,
  windowMs: number,
): Promise<{ ok: boolean; retryAfterSeconds: number }> {
  const now = Date.now();
  const hits = await db.rateLimitHit.findMany({
    where: { key, createdAt: { gt: new Date(now - windowMs) } },
    orderBy: { createdAt: "asc" },
    select: { createdAt: true },
    take: limit,
  });

  if (hits.length >= limit) {
    const oldest = hits[0]!.createdAt.getTime();
    return { ok: false, retryAfterSeconds: Math.max(1, Math.ceil((oldest + windowMs - now) / 1000)) };
  }

  await db.rateLimitHit.create({ data: { key } });

  // Prune old rows now and then.
  if (Math.random() < 0.05) {
    await db.rateLimitHit.deleteMany({ where: { createdAt: { lt: new Date(now - 86_400_000) } } });
  }
  return { ok: true, retryAfterSeconds: 0 };
}

/** Visitor IP, hashed so raw addresses are never stored. */
export async function clientKey(scope: string): Promise<string> {
  const h = await headers();
  const ip =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || "unknown";
  const salt = process.env.SESSION_SECRET ?? "";
  return `${scope}:${createHash("sha256").update(`${ip}|${salt}`).digest("hex").slice(0, 32)}`;
}
