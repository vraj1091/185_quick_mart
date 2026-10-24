import Link from "next/link";
import { store } from "@/content/store";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Privacy Notice",
  description: "How 185 Quick Mart handles the information you send through this website.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <article className="container-store pt-10 pb-20 lg:pt-16">
      <p className="eyebrow text-sign-red">Privacy</p>
      <h1 className="type-display type-h1 mt-4">Privacy notice</h1>
      <div className="prose-store measure mt-8 text-lg">
        <p>
          This is a plain-English summary of what this website collects and what we do with it. We
          keep it short because we collect very little.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Contact form.</strong> If you send us a message, we get your name, the phone
            number or email you give us, the topic you pick, and your message.
          </li>
          <li>
            <strong>Spam protection.</strong> To stop abuse, we keep a scrambled (hashed) version of
            your internet address for up to a day. We can’t turn it back into your address.
          </li>
          <li>
            <strong>Nothing else.</strong> No accounts, no ad tracking, no selling your information.
            The map on our pages comes from Google Maps. When it loads, Google receives the
            usual information any website gets from your browser, and Google’s own privacy policy
            applies to that map.
          </li>
        </ul>

        <h2>Why we collect it</h2>
        <p>Only to read your message and get back to you.</p>

        <h2>How long we keep it</h2>
        <p>
          We keep messages for up to 12 months so we can look back at a conversation, then delete
          them. If our email service is turned on, a copy of your message is also sent to the
          store’s email inbox.
        </p>

        <h2>Who sees it</h2>
        <p>
          The store owner and manager. Our website host and email provider store the data on our
          behalf. We don’t share it with anyone else unless the law requires it.
        </p>

        <h2>Deleting your information</h2>
        <p>
          Want your message deleted? Call us at{" "}
          <a href={store.phone.href} className="link-store font-mono tabular">
            {store.phone.display}
          </a>{" "}
          or send a note through the{" "}
          <Link href="/visit#contact" className="link-store">
            contact form
          </Link>{" "}
          and we’ll remove it.
        </p>

        <h2>Changes</h2>
        <p>If this notice changes, we’ll update it on this page. Last updated October 2026.</p>
      </div>
    </article>
  );
}
