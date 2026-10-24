import "server-only";
import { store } from "@/content/store";
import type { ContactInput } from "./validation";

/**
 * Emails a contact-form message to the owner through Resend.
 * Returns false (and the message stays in the admin inbox) when email isn't set up or fails.
 */
export async function sendContactEmail(message: Omit<ContactInput, "website">): Promise<boolean> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  const from = process.env.CONTACT_FROM_EMAIL || `${store.name} website <onboarding@resend.dev>`;
  if (!apiKey || !to) return false;

  const replyTo = message.contact.includes("@") ? message.contact : undefined;
  const text = [
    `New message from the ${store.name} website`,
    "",
    `Name: ${message.name}`,
    `Phone or email: ${message.contact}`,
    `Topic: ${message.topic}`,
    "",
    message.message,
    "",
    "You can also read and manage messages in the owner dashboard at /admin.",
  ].join("\n");

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        from,
        to: [to],
        subject: `Website message: ${message.topic} from ${message.name}`,
        text,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) {
      console.error(`Resend returned ${res.status}: ${await res.text()}`);
      return false;
    }
    return true;
  } catch (err) {
    console.error("Could not send contact email:", err);
    return false;
  }
}
