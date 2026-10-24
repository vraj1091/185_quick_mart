import Image from "next/image";
import type { Photo } from "@/content/images";
import { cn } from "@/lib/cn";

type Props = {
  photo: Photo;
  /** Required: tells the browser which size to download. */
  sizes: string;
  /** Hero image only. */
  preload?: boolean;
  className?: string;
  /** Fill the parent box (set its size/aspect with className) and crop to fit. */
  cover?: boolean;
  /** CSS object-position when `cover` is set, e.g. "50% 30%". */
  position?: string;
  /** Extra classes on the <img> itself (e.g. hover zoom inside a cover frame). */
  imgClassName?: string;
};

export function StorePhoto({ photo, sizes, preload, className, cover, position, imgClassName }: Props) {
  if (cover) {
    return (
      <div className={cn("relative overflow-hidden bg-line", className)}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          sizes={sizes}
          preload={preload}
          fetchPriority={preload ? "high" : undefined}
          className={cn("object-cover", imgClassName)}
          style={position ? { objectPosition: position } : undefined}
        />
      </div>
    );
  }
  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      width={photo.width}
      height={photo.height}
      sizes={sizes}
      preload={preload}
      fetchPriority={preload ? "high" : undefined}
      className={cn("h-auto w-full bg-line", className)}
    />
  );
}
