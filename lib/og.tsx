import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { store } from "@/content/store";
import { logoColor, palette, withAlpha } from "./theme";

/*
 * Branded share image and icons, drawn with the same tokens as the site:
 * asphalt panel, red sign lettering with a white outline, and the 185 route plate.
 */

const ASPHALT = palette.deep;
const RED = palette.accent;
const LIMESTONE = palette.onDeep;

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

function RoutePlate({ size }: { size: number }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: palette.surface,
        border: `${Math.round(size * 0.11)}px solid ${ASPHALT}`,
        borderRadius: Math.round(size * 0.22),
        boxShadow: `0 0 0 ${Math.max(2, Math.round(size * 0.09))}px ${palette.onPrimary}`,
        padding: `${Math.round(size * 0.1)}px ${Math.round(size * 0.3)}px ${Math.round(size * 0.02)}px`,
        fontFamily: "Overpass",
        fontWeight: 800,
        fontSize: size,
        lineHeight: 1,
        color: ASPHALT,
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

  return new ImageResponse(
    (
      <div style={{ display: "flex", width: "100%", height: "100%", background: ASPHALT }}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: 640,
            padding: "64px 56px 56px",
            borderRight: `8px solid ${RED}`,
          }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 22 }}>
              <RoutePlate size={52} />
              <div
                style={{
                  fontFamily: "Archivo Expanded",
                  fontSize: 64,
                  color: logoColor,
                  letterSpacing: -1,
                  textShadow:
                    [[2, 0], [-2, 0], [0, 2], [0, -2], [1.5, 1.5], [-1.5, -1.5], [1.5, -1.5], [-1.5, 1.5]]
                      .map(([x, y]) => `${x}px ${y}px 0 ${palette.onPrimary}`)
                      .join(", "),
                }}
              >
                QUICK MART
              </div>
            </div>
            <div
              style={{
                marginTop: 28,
                fontFamily: "Overpass",
                fontSize: 26,
                letterSpacing: 5,
                color: LIMESTONE,
              }}
            >
              QUICK · CLEAN · KIND
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {["BP GAS & DIESEL", "HOT FOOD", "KENTUCKY LOTTERY"].map((line) => (
              <div
                key={line}
                style={{ fontFamily: "Archivo Expanded", fontSize: 36, lineHeight: 1.12, color: LIMESTONE }}
              >
                {line}
              </div>
            ))}
            <div
              style={{
                marginTop: 22,
                fontFamily: "Overpass Mono",
                fontSize: 22,
                lineHeight: 1.4,
                color: withAlpha(palette.onDeep, 0.8),
                display: "flex",
                flexDirection: "column",
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
          width={size.width - 640}
          height={size.height}
          style={{ objectFit: "cover", objectPosition: "45% 50%" }}
        />
      </div>
    ),
    { ...size, fonts: await fonts() },
  );
}

export async function renderIcon(px: number) {
  const plate = Math.round(px * 0.36);
  // Satori can't take `undefined` style values, so the large-icon extras are spread in.
  const large = px > 64;
  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: large ? ASPHALT : "transparent",
          ...(large ? { borderBottom: `${Math.round(px * 0.05)}px solid ${RED}` } : {}),
        }}
      >
        <RoutePlate size={plate} />
      </div>
    ),
    { width: px, height: px, fonts: await fonts() },
  );
}
