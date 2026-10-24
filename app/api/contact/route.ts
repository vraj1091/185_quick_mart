import { NextResponse } from "next/server";
import { z } from "zod";
import { store } from "@/content/store";
import { db } from "@/lib/db";
import { sendContactEmail } from "@/lib/email";
import { clientKey, rateLimit } from "@/lib/rate-limit";
import { contactSchema } from "@/lib/validation";

const MAX_PER_HOUR = 5;
const KEEP_MESSAGES_DAYS = 365;

function reply(body: Record<string, unknown>, status = 200, headers?: HeadersInit) {
  return NextResponse.json(body, { status, headers });
}

/** Blocks cross-site form posts. Browsers always send Origin on POST fetches. */
function isSameOrigin(req: Request): boolean {
  const origin = req.headers.get("origin");
  if (!origin) return true;
  try {
    const host = req.headers.get("x-forwarded-host") ?? req.headers.get("host");
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

export async function POST(req: Request) {
  if (!isSameOrigin(req)) {
    return reply({ ok: false, error: "Please send your message from our website." }, 403);
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return reply({ ok: false, error: "We couldn't read that message. Please try again." }, 400);
  }

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return reply(
      {
        ok: false,
        error: "Please fix the fields marked in red.",
        fieldErrors: z.flattenError(parsed.error).fieldErrors,
      },
      400,
    );
  }

  const { website, ...message } = parsed.data;

  // Honeypot filled in: almost certainly a bot. Pretend it worked and drop it.
  if (website) return reply({ ok: true });

  try {
    const limit = await rateLimit(await clientKey("contact"), MAX_PER_HOUR, 60 * 60 * 1000);
    if (!limit.ok) {
      return reply(
        {
          ok: false,
          error: `You've sent a few messages already. Please give us a call at ${store.phone.display} instead.`,
        },
        429,
        { "Retry-After": String(limit.retryAfterSeconds) },
      );
    }

    await db.contactMessage.create({ data: message });

    // Privacy notice promise: messages are kept for up to 12 months.
    await db.contactMessage.deleteMany({
      where: { createdAt: { lt: new Date(Date.now() - KEEP_MESSAGES_DAYS * 86_400_000) } },
    });
  } catch (err) {
    console.error("Contact form save failed:", err);
    return reply(
      {
        ok: false,
        error: `Something went wrong on our end and your message didn't go through. Please call us at ${store.phone.display}.`,
      },
      500,
    );
  }

  // Email is a bonus; the message is already saved in the admin inbox.
  await sendContactEmail(message);

  return reply({ ok: true });
}
