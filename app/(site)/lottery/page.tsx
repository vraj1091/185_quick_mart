import { ExternalLink, Phone } from "lucide-react";
import { CaptionStrip } from "@/components/brand/ShelfEdge";
import { buttonClass } from "@/components/ui/Button";
import { StorePhoto } from "@/components/ui/StorePhoto";
import { photos } from "@/content/images";
import { officialLinks, store } from "@/content/store";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Kentucky Lottery & Prize Cashing up to $5,000",
  description:
    "Kentucky Lottery tickets, scratch-offs and draw games at 185 Quick Mart in Bowling Green, KY. Cash winning tickets up to $5,000. Must be 18 or older to play.",
  path: "/lottery",
});

const money = (n: number) => `$${n.toLocaleString("en-US")}`;

export default function LotteryPage() {
  const cashLimit = money(store.lottery.cashLimitDollars);
  const counterLimit = money(store.lottery.counterLimitDollars);

  const rules = [
    {
      amount: `${counterLimit} or less`,
      text: (
        <>Bring the winning ticket to the counter and we’ll cash it. No claim form needed.</>
      ),
    },
    {
      amount: `Over ${counterLimit} up to ${cashLimit}`,
      text: (
        <>
          Bring the signed ticket, a completed Kentucky Lottery{" "}
          <a href={officialLinks.kyLotteryClaim} target="_blank" rel="noopener noreferrer" className="link-store">
            prize claim form
          </a>
          , and a valid photo ID. We’ll take care of the rest.
        </>
      ),
    },
    {
      amount: `Over ${cashLimit}`,
      text: (
        <>
          These are claimed through the Kentucky Lottery itself: at a Super Cashing Agent (up to
          $25,000) or at Kentucky Lottery headquarters in Louisville. See the Lottery’s{" "}
          <a href={officialLinks.kyLotteryClaim} target="_blank" rel="noopener noreferrer" className="link-store">
            claim page
          </a>{" "}
          for where and how.
        </>
      ),
    },
  ];

  return (
    <>
      <section className="container-store grid gap-10 pt-10 pb-14 lg:grid-cols-12 lg:items-center lg:gap-14 lg:pt-16 lg:pb-20">
        <div className="lg:col-span-7">
          <p className="eyebrow text-sign-red">Kentucky Lottery</p>
          <h1 className="type-display type-h1 mt-4">Play here. Cash it here.</h1>
          <p className="measure mt-5 text-lg sm:text-xl">
            Kentucky Lottery tickets, scratch-offs and draw games at the counter, plus a
            self-service lottery machine inside the store.
          </p>
          <div className="on-dark mt-8 inline-flex flex-wrap items-center gap-4 rounded-md bg-asphalt p-4 pr-6 text-limestone">
            <span className="type-display rounded-sm bg-hi-vis px-3 pt-2.5 pb-1.5 text-[2rem] text-asphalt">
              {cashLimit}
            </span>
            <span className="text-lg font-bold">We cash winning tickets up to {cashLimit}.</span>
          </div>
        </div>
        <figure className="lg:col-span-5">
          <StorePhoto
            photo={photos.lottery}
            cover
            preload
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="aspect-[4/3] rounded-t-sm sm:aspect-[16/11] lg:aspect-[4/5]"
            position="50% 0%"
          />
          <CaptionStrip left="Self-service lottery machine" right="Inside" />
        </figure>
      </section>

      <section aria-labelledby="cashing" className="border-y border-concrete bg-bone py-16 lg:py-24">
        <div className="container-store grid gap-10 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-4">
            <p className="eyebrow text-sign-red">Cashing a winner</p>
            <h2 id="cashing" className="type-display type-h2 mt-3">
              Won? Here’s how it works.
            </h2>
            <p className="mt-4 text-slate">
              Sign the back of your ticket as soon as you know it’s a winner.
            </p>
          </div>
          <dl className="lg:col-span-8">
            {rules.map((r) => (
              <div
                key={r.amount}
                className="grid gap-2 border-t-[3px] border-asphalt py-6 sm:grid-cols-[14rem_1fr] sm:gap-8"
              >
                <dt className="font-mono text-lg font-semibold tabular">{r.amount}</dt>
                <dd className="text-lg">{r.text}</dd>
              </div>
            ))}
            <p className="border-t border-concrete pt-5 text-slate">
              Prizes must be claimed within 180 days of the drawing, or of the game’s end date for
              scratch-offs. Rules are set by the Kentucky Lottery and can change; check{" "}
              <a href={officialLinks.kyLottery} target="_blank" rel="noopener noreferrer" className="link-store">
                kylottery.com
              </a>{" "}
              for the latest.
            </p>
          </dl>
        </div>
      </section>

      <section aria-labelledby="responsibly" className="container-store py-16 lg:py-24">
        <div className="max-w-4xl">
          <h2 id="responsibly" className="type-display type-h2">
            Play responsibly
          </h2>
          <div className="measure mt-6 space-y-4 text-lg">
            <p className="font-bold">Must be 18 or older to play. Please play responsibly.</p>
            <p>
              Lottery games are for fun, and no ticket is a sure thing. If gambling stops being fun
              for you or someone you know, free, confidential help is available 24/7. Call or text{" "}
              <a href={officialLinks.gamblingHelpline.href} className="link-store font-mono tabular">
                {officialLinks.gamblingHelpline.display}
              </a>
              .
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <a
                href={officialLinks.kycpg}
                target="_blank"
                rel="noopener noreferrer"
                className={buttonClass("outline")}
              >
                Kentucky Council on Problem Gambling
                <ExternalLink aria-hidden="true" strokeWidth={1.75} className="size-4" />
              </a>
              <a href={store.phone.href} className={buttonClass("outline")}>
                <Phone aria-hidden="true" strokeWidth={1.75} className="size-5" />
                Questions? Call the store
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
