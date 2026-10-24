import Image from "next/image";
import { store } from "@/content/store";

/**
 * Slot for a partner's logo (BP, Hunt Brothers Pizza, etc.). Renders nothing until the
 * owner confirms the agreement allows it and the file is added in content/store.ts.
 */
export function PartnerLogo({
  partner,
  className,
}: {
  partner: keyof typeof store.partnerLogos;
  className?: string;
}) {
  const logo = store.partnerLogos[partner];
  if (!logo) return null;
  return (
    <Image
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt={logo.alt}
      className={className}
    />
  );
}
