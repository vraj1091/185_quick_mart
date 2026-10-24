import { describe, expect, it } from "vitest";
import {
  contactSchema,
  dealSchema,
  fuelPricesSchema,
  hoursInputToColumns,
  isPhoneOrEmail,
  specialHoursSchema,
  weeklyHoursSchema,
} from "./validation";

const good = {
  name: "Dana",
  contact: "(270) 555-0134",
  topic: "Hot food" as const,
  message: "Do you have chicken tenders today?",
};

describe("contact form", () => {
  it("accepts a normal message", () => {
    expect(contactSchema.safeParse(good).success).toBe(true);
  });

  it("accepts phone numbers and emails", () => {
    for (const v of ["270-555-0134", "(270) 555 0134", "+1 270 555 0134", "dana@example.com"]) {
      expect(isPhoneOrEmail(v)).toBe(true);
    }
    for (const v of ["555-0134", "call me", "dana@", "12345678901234567"]) {
      expect(isPhoneOrEmail(v)).toBe(false);
    }
  });

  it("gives specific, human error messages", () => {
    const result = contactSchema.safeParse({ ...good, name: "  ", contact: "nope", message: "hi" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const messages = result.error.issues.map((i) => i.message);
      expect(messages).toContain("Please tell us your name.");
      expect(messages).toContain(
        "That doesn't look like a phone number or email. Give it another look.",
      );
      expect(messages).toContain("Add a few more words so we know how to help.");
    }
  });

  it("rejects unknown topics and very long messages", () => {
    expect(contactSchema.safeParse({ ...good, topic: "Free stuff" }).success).toBe(false);
    expect(contactSchema.safeParse({ ...good, message: "x".repeat(2001) }).success).toBe(false);
  });

  it("trims whitespace", () => {
    const result = contactSchema.parse({ ...good, name: "  Dana  " });
    expect(result.name).toBe("Dana");
  });

  it("passes the honeypot through for the route to check", () => {
    expect(contactSchema.parse({ ...good, website: "http://spam" }).website).toBe("http://spam");
  });
});

describe("admin forms", () => {
  it("validates fuel prices typed like the sign", () => {
    expect(fuelPricesSchema.safeParse({ regular: "2.799", premium: "3.49", diesel: "" }).success).toBe(true);
    expect(fuelPricesSchema.safeParse({ regular: "2,79", premium: "", diesel: "" }).success).toBe(false);
    expect(fuelPricesSchema.safeParse({ regular: "27.99", premium: "", diesel: "" }).success).toBe(false);
  });

  it("checks deal dates are in order", () => {
    const base = { title: "2-liter bottles", priceText: "2 for $5", note: "" };
    expect(dealSchema.safeParse({ ...base, startsOn: "2026-11-01", endsOn: "2026-11-07" }).success).toBe(true);
    expect(dealSchema.safeParse({ ...base, startsOn: "2026-11-07", endsOn: "2026-11-01" }).success).toBe(false);
    expect(dealSchema.safeParse({ ...base, startsOn: "", endsOn: "" }).success).toBe(true);
  });

  it("requires times only for open days", () => {
    const day = (mode: "open" | "closed" | "24h", opens = "", closes = "") => ({ mode, opens, closes });
    const week = [day("closed"), day("open", "05:00", "23:00"), day("24h"), day("open", "06:00", "02:00"), day("closed"), day("closed"), day("closed")];
    expect(weeklyHoursSchema.safeParse({ days: week }).success).toBe(true);
    week[1] = day("open", "", "23:00");
    expect(weeklyHoursSchema.safeParse({ days: week }).success).toBe(false);
    week[1] = day("open", "05:00", "05:00");
    expect(weeklyHoursSchema.safeParse({ days: week }).success).toBe(false);
  });

  it("stores midnight closing as 24:00 and 24-hour days as 00:00–24:00", () => {
    expect(hoursInputToColumns({ mode: "open", opens: "06:00", closes: "00:00" })).toEqual({ opensAt: "06:00", closesAt: "24:00" });
    expect(hoursInputToColumns({ mode: "24h", opens: "", closes: "" })).toEqual({ opensAt: "00:00", closesAt: "24:00" });
    expect(hoursInputToColumns({ mode: "closed", opens: "05:00", closes: "23:00" })).toEqual({ opensAt: null, closesAt: null });
  });

  it("validates holiday hours", () => {
    expect(specialHoursSchema.safeParse({ date: "2026-11-26", label: "Thanksgiving", mode: "closed", opens: "", closes: "" }).success).toBe(true);
    expect(specialHoursSchema.safeParse({ date: "2026-02-30", label: "Bad date", mode: "closed", opens: "", closes: "" }).success).toBe(false);
  });
});
