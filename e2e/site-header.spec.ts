import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

/** Animation names on the parts of the header status (the dot and its pulse). */
function statusAnimations(page: Page) {
  return page
    .getByRole("banner")
    .getByRole("link", { name: "Available for projects" })
    .evaluate((status) =>
      Array.from(status.querySelectorAll("*")).map((dot) => getComputedStyle(dot).animationName),
    );
}

test("desktop header shows the nav, status and meta row", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "the mobile header collapses the nav");
  await page.goto("/");
  const header = page.getByRole("banner");

  const nav = header.getByRole("navigation", { name: "Primary" });
  await expect(nav.getByRole("link")).toHaveText(["Work", "About", "Stack", "Contact"]);
  await expect(header.getByRole("link", { name: "Available for projects" })).toBeVisible();
  await expect(header.getByText("21° 01′ 42″ N, 105° 51′ 15″ E")).toBeVisible();
  await expect(header.getByText("Portfolio ©2026")).toBeVisible();
  await expect(header.getByText(/^Local time \d{2}:\d{2} GMT\+7$/)).toBeVisible();
  await expect(header.getByRole("link", { name: "Available for projects" })).toHaveAttribute(
    "href",
    "#contact",
  );
  await expect(header.getByRole("button", { name: "Open menu" })).toBeHidden();
});

test("mobile menu opens, closes on Escape and returns focus", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "the menu button only exists on mobile");
  await page.goto("/");
  const header = page.getByRole("banner");

  await expect(header.getByText("21° 01′ N, 105° 51′ E")).toBeVisible();
  await expect(header.getByText(/^\d{2}:\d{2} GMT\+7$/)).toBeVisible();
  await expect(header.getByText("Available for projects")).toBeHidden();
  await expect(header.getByRole("navigation")).toBeHidden();

  const button = header.getByRole("button", { name: "Open menu" });
  await button.focus();
  await page.keyboard.press("Enter");
  await expect(header.getByRole("button", { name: "Close menu" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  const nav = header.getByRole("navigation", { name: "Primary" });
  await expect(nav).toBeVisible();

  await page.keyboard.press("Tab");
  await expect(nav.getByRole("link", { name: "Work" })).toBeFocused();
  await page.keyboard.press("Escape");
  await expect(nav).toBeHidden();
  await expect(header.getByRole("button", { name: "Open menu" })).toBeFocused();

  await page.keyboard.press("Enter");
  await nav.getByRole("link", { name: "About" }).click();
  await expect(nav).toBeHidden();
  await expect(page).toHaveURL(/#about$/);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("the status dot does not pulse", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "the status is in the hero on mobile");
    await page.goto("/");

    const animations = await statusAnimations(page);
    expect(animations.every((name) => name === "none")).toBe(true);
  });
});

test("the status dot pulses when motion is allowed", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "the status is in the hero on mobile");
  await page.goto("/");

  const animations = await statusAnimations(page);
  expect(animations).toContain("ping");
});
