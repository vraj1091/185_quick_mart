"use client";

import { deleteMessage, setMessageRead } from "@/app/admin/actions";
import { cn } from "@/lib/cn";
import { StatusLine, dangerButton, smallButton, useActionStatus } from "./ui";

export type AdminMessage = {
  id: string;
  name: string;
  contact: string;
  topic: string;
  message: string;
  receivedLabel: string;
  read: boolean;
};

function contactHref(contact: string): string {
  if (contact.includes("@")) return `mailto:${contact}`;
  const digits = contact.replace(/[^\d+]/g, "");
  return `tel:${digits.startsWith("+") ? digits : digits.length === 10 ? `+1${digits}` : digits}`;
}

export function Inbox({ messages }: { messages: AdminMessage[] }) {
  const { status, pending, run } = useActionStatus();

  if (messages.length === 0) {
    return <p className="text-slate">No messages yet. Messages from the contact form show up here.</p>;
  }

  return (
    <div className="space-y-4">
      <StatusLine status={status} />
      <ul className="space-y-3">
        {messages.map((m) => (
          <li
            key={m.id}
            className={cn(
              "rounded-sm border-2 bg-white p-4",
              m.read ? "border-concrete" : "border-asphalt shadow-[inset_4px_0_0_var(--color-sign-red)]",
            )}
          >
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <p className="text-lg font-bold">
                {m.read ? null : <span className="eyebrow mr-2 text-[0.75rem] text-sign-red">New</span>}
                {m.name}
              </p>
              <p className="text-sm text-slate">{m.receivedLabel}</p>
            </div>
            <p className="mt-1">
              <a href={contactHref(m.contact)} className="link-store font-mono">
                {m.contact}
              </a>
              <span className="text-slate"> · {m.topic}</span>
            </p>
            <p className="mt-3 whitespace-pre-wrap">{m.message}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                className={smallButton}
                disabled={pending}
                onClick={() => run(() => setMessageRead(m.id, !m.read))}
              >
                {m.read ? "Mark unread" : "Mark read"}
              </button>
              <button
                type="button"
                className={dangerButton}
                disabled={pending}
                onClick={() => {
                  if (confirm(`Delete the message from ${m.name}?`)) run(() => deleteMessage(m.id));
                }}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
