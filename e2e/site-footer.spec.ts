import { expect, test } from "@playwright/test";

test("desktop footer shows the label, copy button, clock and back to top", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "the 390 board drops these");
  await page.goto("/");
  const footer = page.getByRole("contentinfo");

  await expect(footer.getByText("(Contact) · Open to new opportunities")).toBeVisible();
  await expect(footer.getByRole("button", { name: "Copy email" })).toBeVisible();
  // innerText leaves out the hidden mobile location.
  expect(await footer.getByText(/^© 2026/).innerText()).toMatch(
    /^© 2026 Dang Nhat Huy · \d{2}:\d{2} in Hanoi$/,
  );
  await expect(footer.getByRole("link", { name: "Back to top" })).toBeVisible();
  await expect(footer.getByText("Hanoi, Vietnam")).toBeHidden();
});

test("mobile footer shows the stretched email link and the location", async ({
  page,
}, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "only the 390 board differs");
  await page.goto("/");
  const footer = page.getByRole("contentinfo");

  await expect(footer.getByText("© 2026 Dang Nhat Huy · Hanoi, Vietnam")).toBeVisible();
  await expect(footer.getByText("(Contact) · Open to new opportunities")).toBeHidden();
  await expect(footer.getByRole("button", { name: "Copy email" })).toBeHidden();
  await expect(footer.getByRole("link", { name: "Back to top" })).toBeHidden();

  const email = footer.getByRole("link", { name: "dnh2703@gmail.com" });
  const box = await email.boundingBox();
  expect(box?.width).toBe(350);
  expect(box?.height).toBe(56);
});

test("profile links open safely in a new tab", async ({ page }) => {
  await page.goto("/");
  const links = page.getByRole("contentinfo").getByRole("list").getByRole("link");

  await expect(links).toHaveText([/^GitHub/, /^LinkedIn/, /^X/, /^dnh2703\.work/]);
  await Promise.all(
    (await links.all()).map(async (link) => {
      await expect(link).toHaveAttribute("target", "_blank");
      await expect(link).toHaveAttribute("rel", "noopener noreferrer");
      await expect(link).toHaveAccessibleName(/\(opens in a new tab\)$/);
    }),
  );
});

test("copy button copies the email and announces it", async ({ page, context }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "the copy button is desktop only");
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  const footer = page.getByRole("contentinfo");

  await footer.getByRole("button", { name: "Copy email" }).click();
  await expect(footer.getByRole("button", { name: "Copied" })).toBeVisible();
  await expect(footer.getByRole("status")).toHaveText("Email address copied to the clipboard.");
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe("dnh2703@gmail.com");
  await expect(footer.getByRole("button", { name: "Copy email" })).toBeVisible();
});

test("back to top scrolls up and moves focus to the hero", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "desktop", "back to top is desktop only");
  await page.goto("/");

  const backToTop = page.getByRole("contentinfo").getByRole("link", { name: "Back to top" });
  await backToTop.focus();
  await page.keyboard.press("Enter");

  await expect(page.locator("#top")).toBeFocused();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("back to top jumps instantly", async ({ page }, testInfo) => {
    test.skip(testInfo.project.name !== "desktop", "back to top is desktop only");
    await page.goto("/");

    await page.getByRole("contentinfo").getByRole("link", { name: "Back to top" }).click();

    // No smooth scroll: the page is at the top straight after the click.
    expect(await page.evaluate(() => window.scrollY)).toBe(0);
    await expect(page.locator("#top")).toBeFocused();
  });
});
