import { expect, test } from "@playwright/test";

const label = "Ask my assistant about this project";

test("every project is one visible button that Enter activates", async ({ page }) => {
  await page.goto("/");

  const work = page.getByRole("region", { name: "Selected work" });
  const buttons = work.getByRole("button", { name: label });
  // Hidden copies (card 02 as a card on mobile, as a row on desktop) are not in the a11y tree.
  await expect(buttons).toHaveCount(5);

  await Promise.all((await buttons.all()).map((button) => expect(button).toBeVisible()));

  const first = buttons.first();
  await first.evaluate((button) => {
    button.addEventListener("click", () => button.setAttribute("data-activated", ""));
  });
  await first.focus();
  await page.keyboard.press("Enter");
  await expect(first).toHaveAttribute("data-activated", "");
  expect(await first.evaluate((button) => getComputedStyle(button).outlineStyle)).toBe("solid");
});

test("only the first card has a preview on mobile", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name !== "mobile", "the card layout differs on the 390 board");
  await page.goto("/");

  const work = page.locator("#work");
  await expect(work.getByText("Roles & permissions")).toHaveCount(2);
  await expect(work.getByText("Roles & permissions").last()).toBeVisible();
  await expect(work.getByText("Choose a package")).toBeHidden();
});
