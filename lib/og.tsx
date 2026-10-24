import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { store } from "@/content/store";
import { logoColor, palette } from "./theme";

/*
 * Branded share image and icons, drawn with the theme colors from lib/theme.ts:
 * white background, the route plate, the wordmark, pine accents and the storefront photo.
 */

async function fonts() {
  const dir = path.join(process.cwd(), "assets", "fonts");
  const [archivo, overpass, mono] = await Promise.all([
    readFile(path.join(dir, "archivo-expanded-800.woff")),
    readFile(path.join(dir, "overpass-800.woff")),
    readFile(path.join(dir, "overpass-mono-600.woff")),
  ]);
  return [
    { name: "Archivo Expanded", data: archivo, weight: 800 as const, style: "normal" as const },
    { name: "Overpass", data: overpass, weight: 800 as const, style: "normal" as const },
    { name: "Overpass Mono", data: mono, weight: 600 as const, style: "normal" as const },
  ];
}

/** The "185" plate. Light: white plate, ink border. Dark: pine plate, white border. */
function RoutePlate({ size, tone = "light" }: { size: number; tone?: "light" | "dark" }) {
  const dark = tone === "dark";
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: dark ? palette.primary : palette.surface,
        border: `${Math.max(2, Math.round(size * 0.11))}px solid ${dark ? palette.onPrimary : palette.ink}`,
        borderRadius: Math.round(size * 0.22),
        padding: `${Math.round(size * 0.1)}px ${Math.round(size * 0.3)}px ${Math.round(size * 0.02)}px`,
        fontFamily: "Overpass",
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        color: dark ? palette.onPrimary : palette.ink,
      }}
    >
      185
    </div>
  );
}

export async function renderShareImage(size: { width: number; height: number }) {
  const photo = await readFile(
    path.join(process.cwd(), "public", "images", "storefront", "storefront-day-building.jpg"),
  );
  const photoSrc = `data:image/jpeg;base64,${photo.toString("base64")}`;
  const panel = 640;

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: palette.bg }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: panel,
            padding: "64px 56px 0",
            borderRight: `10px solid ${palette.primary}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <RoutePlate size={52} />
              <div style={{ fontFamily: "Archivo Expanded", fontSize: 64, color: logoColor, letterSpacing: -1 }}>
                QUICK MART
              </div>
            </div>
            <div style={{ marginTop: 28, fontFamily: "Overpass", fontSize: 26, letterSpacing: 5, color: palette.accent }}>
              QUICK · CLEAN · KIND
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {["BP GAS & DIESEL", "HOT FOOD", "KENTUCKY LOTTERY"].map((line) => (
              <div
                key={line}
                style={{ fontFamily: "Archivo Expanded", fontSize: 36, lineHeight: 1.12, color: palette.ink }}
              >
                {line}
              </div>
            ))}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                marginTop: 22,
                marginBottom: 44,
                fontFamily: "Overpass Mono",
                fontSize: 22,
                lineHeight: 1.4,
                color: palette.muted,
              }}
            >
              <span>1341 HWY 185</span>
              <span>{`${store.address.city.toUpperCase()}, ${store.address.region}`}</span>
            </div>
          </div>
        </div>
        {/* ImageResponse renders plain <img>; next/image doesn't apply here. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={photoSrc}
          alt=""
          width={size.width - panel}
          height={size.height}
          style={{ objectFit: "cover", objectPosition: "45% 50%" }}
        />
      </div>
    ),
    { ...size, fonts: await fonts() },
  );
}

/** App icon / favicon: a white route plate on pine. */
export async function renderIcon(px: number) {
  const plate = Math.round(px * (px > 64 ? 0.34 : 0.3));
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: palette.primary,
          borderRadius: px > 64 ? 0 : Math.round(px * 0.18),
        }}
      >
        <RoutePlate size={plate} />
      </div>
    ),
    { width: px, height: px, fonts: await fonts() },
  );
}
