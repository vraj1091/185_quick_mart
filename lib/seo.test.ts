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
