import { NoticeDismiss } from "./NoticeDismiss";

/** Short string id for a notice, so dismissing one notice doesn't hide the next. */
function noticeId(text: string): string {
  let h = 5381;
  for (let i = 0; i < text.length; i++) h = ((h << 5) + h + text.charCodeAt(i)) | 0;
  return (h >>> 0).toString(36);
}

/** Owner's notice strip (set in /admin). Hidden when empty or dismissed. */
export function NoticeBanner({ text }: { text: string | null }) {
  if (!text) return null;
  const id = noticeId(text);
  // Runs before the banner is painted, so a dismissed notice never flashes or shifts the page.
  const script = `try{if(localStorage.getItem("qm-notice")===${JSON.stringify(id)})document.documentElement.classList.add("notice-dismissed")}catch(e){}`;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: script }} />
      <div data-notice className="on-dark bg-deep text-on-deep">
        <div className="container-store flex min-h-11 items-center justify-between gap-3 py-1.5">
          <p className="text-[0.9375rem] leading-snug font-semibold">
            <span className="eyebrow mr-2.5 text-[0.75rem] text-on-deep-muted">Notice</span>
            {text}
          </p>
          <NoticeDismiss id={id} />
        </div>
      </div>
    </>
  );
}
