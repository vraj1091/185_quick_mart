import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

// WCAG 2.2 A/AA checks (including color contrast) on every public page and the admin login.
const pages = ["/", "/fuel", "/food", "/store", "/lottery", "/visit", "/privacy", "/admin/login"];

for (const path of pages) {
  test(`no accessibility violations on ${path}`, async ({ page }) => {
    await page.goto(path);
    // Let client-only pieces (open-now pill, hours highlight) render first.
    await page.waitForLoadState("networkidle");
    const results = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
      .exclude("iframe") // the Google map is Google's content
      .analyze();
    const summary = results.violations.map(
      (v) => `${v.id} (${v.impact}): ${v.nodes.length} element(s) — ${v.nodes[0]?.target.join(" ")}`,
    );
    expect(summary, summary.join("\n")).toEqual([]);
  });
}
