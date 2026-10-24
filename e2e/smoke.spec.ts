import { expect, test } from "@playwright/test";

test("home page loads with the store's headline", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Gas, hot food");
  await expect(page).toHaveTitle(/185 Quick Mart/);
});

test("call links dial the store", async ({ page }) => {
  await page.goto("/");
  const callLinks = page.locator('a[href="tel:+12705991126"]');
  expect(await callLinks.count()).toBeGreaterThan(0);
  await expect(callLinks.filter({ visible: true }).first()).toBeVisible();
});

test("Call, Directions and Gas Prices are one tap away on phones", async ({ page, isMobile }) => {
  test.skip(!isMobile, "Phone-only action bar");
  await page.goto("/food");
  const bar = page.getByRole("navigation", { name: "Quick actions" });
  await expect(bar.getByRole("link", { name: "Call" })).toHaveAttribute("href", "tel:+12705991126");
  await expect(bar.getByRole("link", { name: "Directions" })).toHaveAttribute("href", /google\.com\/maps\/dir/);
  await bar.getByRole("link", { name: "Gas Prices" }).click();
  await expect(page).toHaveURL(/\/fuel#prices$/);
});

test("every main page responds", async ({ page }) => {
  for (const path of ["/fuel", "/food", "/store", "/lottery", "/visit", "/privacy"]) {
    const res = await page.goto(path);
    expect(res?.status(), path).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("admin requires login", async ({ page }) => {
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/admin\/login$/);
  await expect(page.getByRole("heading", { name: "Owner login" })).toBeVisible();

  await page.getByLabel("Password").fill("definitely-not-the-password");
  await page.getByRole("button", { name: "Log in" }).click();
  // After several runs the login rate limit kicks in instead; both mean "not let in".
  await expect(page.getByText(/That password isn't right\.|Too many tries/)).toBeVisible();
  await expect(page).toHaveURL(/\/admin\/login$/);
});

test("contact form shows friendly errors and sends", async ({ page }) => {
  await page.goto("/visit");
  await page.getByRole("button", { name: "Send message" }).click();
  await expect(page.getByText("Please tell us your name.")).toBeVisible();

  await page.getByLabel("Your name").fill("Smoke Test");
  await page.getByLabel("Phone or email").fill("smoke@example.com");
  await page.getByLabel("Message").fill("Automated smoke test. Please ignore.");
  await page.getByRole("button", { name: "Send message" }).click();
  // Repeated runs hit the 5-per-hour limit, which answers with a friendly "call us" message.
  await expect(page.getByText(/We got your message\.|You've sent a few messages already/)).toBeVisible();
});

test("menu tabs work with the keyboard on phones", async ({ page, isMobile }) => {
  test.skip(!isMobile, "The tab bar only appears on phones");
  await page.goto("/");
  const tablist = page.getByRole("tablist", { name: "Menu" });
  const tab = (name: string) => tablist.getByRole("tab", { name });
  await expect(tab("Breakfast")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Bacon Biscuit");

  await tab("Breakfast").focus();
  await page.keyboard.press("ArrowRight");
  await expect(tab("Lunch")).toBeFocused();
  await expect(tab("Lunch")).toHaveAttribute("aria-selected", "true");
  await expect(page.getByRole("tabpanel")).toContainText("Chicken Crispito");

  await page.keyboard.press("End");
  await expect(page.getByRole("tabpanel")).toContainText("Hunk A Pizza");
  await page.keyboard.press("ArrowRight"); // wraps around
  await expect(tab("Breakfast")).toHaveAttribute("aria-selected", "true");
});

test("all four menu boards show side by side on desktop", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop layout");
  await page.goto("/food#menu");
  for (const name of ["Breakfast", "Lunch", "Fried Chicken", "Pizza & Wings"]) {
    await expect(page.locator("#menu").getByRole("heading", { level: 3, name, exact: true })).toBeVisible();
  }
});

test("the menu never shows prices, and real hours show in the footer", async ({ page }) => {
  await page.goto("/");
  const menuText = await page.locator("#menu").innerText();
  expect(menuText).not.toMatch(/\$\s?\d/);
  await expect(page.locator("#menu")).toContainText("Prices and daily availability vary");
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("Mon–Fri");
  await expect(footer).toContainText("4 AM – 11 PM");
  await expect(footer).not.toContainText("Call for hours");
});
