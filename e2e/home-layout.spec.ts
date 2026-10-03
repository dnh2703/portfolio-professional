import { expect, test } from "@playwright/test";

const SECTIONS = ["top", "work", "about", "stack"];

test("home page renders the section shells in order with the layout tokens", async ({
  page,
}, testInfo) => {
  await page.goto("/");

  await expect(page.getByRole("banner")).toBeVisible();
  await expect(page.getByRole("contentinfo")).toBeVisible();
  const ids = await page
    .getByRole("main")
    .locator(":scope > section")
    .evaluateAll((sections) => sections.map((section) => section.id));
  expect(ids).toEqual(SECTIONS);

  const desktop = testInfo.project.name === "desktop";
  const work = page.locator("#work");
  const styles = await work.evaluate((section) => {
    const style = getComputedStyle(section);
    return {
      paddingLeft: style.paddingLeft,
      paddingTop: style.paddingTop,
      borderTopWidth: style.borderTopWidth,
    };
  });
  expect(styles).toEqual({
    paddingLeft: desktop ? "64px" : "20px",
    paddingTop: desktop ? "120px" : "72px",
    borderTopWidth: "1px",
  });

  const columns = await work.evaluate((section) => {
    const grid = Array.from(section.querySelectorAll("*")).find(
      (element) => getComputedStyle(element).display === "grid",
    );
    return grid ? getComputedStyle(grid).gridTemplateColumns.split(" ").length : 0;
  });
  expect(columns).toBe(desktop ? 12 : 4);
});

test("the page never scrolls horizontally", async ({ page }) => {
  await page.goto("/");
  const overflow = await page.evaluate(
    () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
  );
  expect(overflow).toBe(0);
});

test("keyboard focus starts on the logo link with a visible ring", async ({ page }) => {
  await page.goto("/");
  await page.keyboard.press("Tab");

  const logo = page.getByRole("link", { name: "Johnny Dang, back to top" });
  await expect(logo).toBeFocused();
  const outline = await logo.evaluate((link) => getComputedStyle(link).outlineStyle);
  expect(outline).toBe("solid");
});
