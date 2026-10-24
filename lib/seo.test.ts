import { describe, expect, it } from "vitest";
import { emptySchedule, type Schedule } from "./hours";
import { jsonLdString, openingHoursSpecification, storeJsonLd } from "./seo";

describe("store JSON-LD", () => {
  it("describes a GasStation + ConvenienceStore with the real NAP", () => {
    const data = storeJsonLd(emptySchedule());
    expect(data["@type"]).toEqual(["GasStation", "ConvenienceStore"]);
    expect(data.name).toBe("185 Quick Mart");
    expect(data.alternateName).toBe("HWY 185 Quick Mart");
    expect(data.telephone).toBe("+12705991126");
    expect(data.address).toMatchObject({
      "@type": "PostalAddress",
      streetAddress: "1341 KY-185",
      addressLocality: "Bowling Green",
      addressRegion: "KY",
      postalCode: "42101",
    });
    expect(data.brand).toEqual({ "@type": "Brand", name: "BP" });
  });

  it("leaves out facts we don't have", () => {
    const data = storeJsonLd(emptySchedule());
    expect(data).not.toHaveProperty("openingHoursSpecification");
    expect(data).not.toHaveProperty("geo");
    expect(data).not.toHaveProperty("sameAs");
  });

  it("adds grouped opening hours once they're published", () => {
    const s: Schedule = {
      weekly: [
        { kind: "open", opens: "06:00", closes: "23:00" },
        { kind: "open", opens: "05:00", closes: "23:00" },
        { kind: "open", opens: "05:00", closes: "23:00" },
        { kind: "open", opens: "05:00", closes: "23:00" },
        { kind: "open", opens: "05:00", closes: "23:00" },
        { kind: "open24" },
        { kind: "closed" },
      ],
      special: [{ date: "2026-11-26", label: "Thanksgiving", hours: { kind: "closed" } }],
    };
    expect(openingHoursSpecification(s)).toEqual([
      { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Sunday", opens: "06:00", closes: "23:00" },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "https://schema.org/Monday",
          "https://schema.org/Tuesday",
          "https://schema.org/Wednesday",
          "https://schema.org/Thursday",
        ],
        opens: "05:00",
        closes: "23:00",
      },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Friday", opens: "00:00", closes: "23:59" },
    ]);
    const data = storeJsonLd(s);
    expect(data.specialOpeningHoursSpecification).toEqual([
      expect.objectContaining({ validFrom: "2026-11-26", validThrough: "2026-11-26", opens: "00:00", closes: "00:00" }),
    ]);
  });

  it("can't be used to break out of the script tag", () => {
    expect(jsonLdString({ name: "</script><script>alert(1)</script>" })).not.toContain("</script>");
  });
});

describe("store JSON-LD with the confirmed hours", () => {
  it("publishes Mon–Fri 4–11, Sat 5–11, Sun 7–11 and links the menu", async () => {
    const { confirmedHours } = await import("@/content/store");
    const { toDayHours } = await import("./hours");
    const schedule: Schedule = {
      weekly: confirmedHours.map((h) => toDayHours(h.opensAt, h.closesAt)),
      special: [],
    };
    const data = storeJsonLd(schedule);
    expect(data.openingHoursSpecification).toEqual([
      { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Sunday", opens: "07:00", closes: "23:00" },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((d) => `https://schema.org/${d}`),
        opens: "04:00",
        closes: "23:00",
      },
      { "@type": "OpeningHoursSpecification", dayOfWeek: "https://schema.org/Saturday", opens: "05:00", closes: "23:00" },
    ]);
    expect(data.hasMenu).toMatch(/\/food#menu$/);
  });
});

describe("menu JSON-LD", () => {
  it("lists every menu item by name and never includes prices", async () => {
    const { menuJsonLd } = await import("./seo");
    const { menu } = await import("@/content/menu");
    const json = JSON.stringify(menuJsonLd());
    expect(json).not.toMatch(/offers|price|\$/i);
    for (const category of menu) {
      for (const group of category.groups) {
        for (const item of group.items) expect(json).toContain(JSON.stringify(item.name));
      }
    }
  });
});
