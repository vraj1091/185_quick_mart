import { renderShareImage } from "@/lib/og";
import { shareImageAlt } from "@/lib/seo";

export const alt = shareImageAlt;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return renderShareImage(size);
}
