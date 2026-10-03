import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const OPEN = "Open chat with Johnny’s assistant";

/** Console errors and warnings plus uncaught page errors, collected for the whole test. */
function collectConsole(page: Page) {
  const messages: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error" || message.type() === "warning") {
      messages.push(`${message.type()}: ${message.text()}`);
    }
  });
  page.on("pageerror", (error) => messages.push(`pageerror: ${error.message}`));
  return messages;
}

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length }));
}

/** Scrolls each section into view so lazy images and observers run, then back to the top. */
async function scrollThrough(page: Page) {
  const parts = await page.locator("main > section, body > footer").all();
  await parts.reduce<Promise<void>>(
    (previous, part) => previous.then(() => part.scrollIntoViewIfNeeded()),
    Promise.resolve(),
  );
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
  await page.waitForLoadState("networkidle");
}

type FocusStop = {
  /** `header`, a section id, `footer` or `assistant`. */
  area: string;
  name: string;
  ringVisible: boolean;
  inLayout: boolean;
  /** Position in document order, to check that Tab follows it. */
  order: number;
};

/** Presses Tab until the assistant launcher has focus, recording every stop on the way. */
async function tabToLauncher(page: Page, stops: FocusStop[] = []): Promise<FocusStop[]> {
  await page.keyboard.press("Tab");
  const stop = await page.evaluate(() => {
    const element = document.activeElement ?? document.body;
    const area = element.closest("body > header")
      ? "header"
      : (element.closest("main > section")?.id ??
        (element.closest("body > footer") ? "footer" : "assistant"));
    const rect = element.getBoundingClientRect();
    return {
      area,
      name: element.getAttribute("aria-label") ?? element.textContent?.trim() ?? element.tagName,
      ringVisible: getComputedStyle(element).outlineStyle !== "none",
      inLayout: rect.width > 0 && rect.height > 0,
      order: Array.from(document.querySelectorAll("*")).indexOf(element),
    };
  });
  stops.push(stop);
  if (stop.name.startsWith(OPEN) || stops.length > 80) return stops;
  return tabToLauncher(page, stops);
}

/** Names of the CSS animations that are running (transitions of color are not motion). */
function runningAnimations(page: Page) {
  return page.evaluate(() =>
    document
      .getAnimations()
      .filter((animation) => animation.playState === "running" && "animationName" in animation)
      .map((animation) => ("animationName" in animation ? animation.animationName : "")),
  );
}

test("metadata, Open Graph image, robots and sitemap", async ({ page, request }) => {
  await page.goto("/");

  await expect(page).toHaveTitle("Johnny Dang · Frontend-focused fullstack developer");
  await expect(page.locator('meta[name="description"]')).toHaveAttribute(
    "content",
    /frontend-focused fullstack developer in Hanoi/,
  );
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    "https://dnh2703.work",
  );
  await expect(page.locator('meta[property="og:image:width"]')).toHaveAttribute("content", "1200");

  const ogImage = await page.locator('meta[property="og:image"]').getAttribute("content");
  const image = await request.get(new URL(ogImage ?? "").pathname);
  expect(image.ok()).toBe(true);
  expect(image.headers()["content-type"]).toBe("image/png");

  expect((await request.get("/robots.txt")).ok()).toBe(true);
  expect((await request.get("/sitemap.xml")).ok()).toBe(true);
});

test("full page: no console output, axe clean, one h1 and no skipped heading levels", async ({
  page,
}) => {
  const messages = collectConsole(page);
  await page.goto("/");
  await scrollThrough(page);

  const levels = await page
    .getByRole("heading")
    .evaluateAll((headings) => headings.map((heading) => Number(heading.tagName.slice(1))));
  expect(levels[0]).toBe(1);
  expect(levels.filter((level) => level === 1)).toHaveLength(1);
  const jumps = levels.filter((level, i) => i > 0 && level - (levels[i - 1] ?? 0) > 1);
  expect(jumps).toEqual([]);

  expect(await seriousViolations(page)).toEqual([]);
  expect(messages).toEqual([]);
});

/** Follows each `[label, section id]` nav link in turn, through the menu on mobile. */
async function followNavLinks(
  page: Page,
  isMobile: boolean,
  links: (readonly [string, string])[],
): Promise<void> {
  const [link, ...rest] = links;
  if (!link) return;
  const [label, id] = link;
  const header = page.getByRole("banner");
  if (isMobile) await header.getByRole("button", { name: "Open menu" }).click();
  await header
    .getByRole("navigation", { name: "Primary" })
    .getByRole("link", { name: label })
    .click();
  await expect(page).toHaveURL(new RegExp(`#${id}$`));
  await expect(page.locator(`#${id}`)).toBeInViewport();
  await followNavLinks(page, isMobile, rest);
}

test("nav links reach every section", async ({ page, isMobile }) => {
  await page.goto("/");
  await followNavLinks(page, isMobile, [
    ["Work", "work"],
    ["About", "about"],
    ["Stack", "stack"],
    ["Contact", "contact"],
  ]);
});

test("keyboard only: Tab walks header, sections, footer and the assistant in order", async ({
  page,
  isMobile,
}) => {
  const messages = collectConsole(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  const stops = await tabToLauncher(page);
  const areas = stops.map((stop) => stop.area).filter((area, i, all) => area !== all[i - 1]);
  // About and Stack are text only, so they have no tab stops of their own. On desktop the hero is
  // text only too (the marquee has no pause control); on mobile it has the "Available" link.
  const hero = isMobile ? ["top"] : [];
  expect(areas).toEqual(["header", ...hero, "work", "footer", "assistant"]);
  expect(stops.filter((stop) => !stop.ringVisible || !stop.inLayout)).toEqual([]);
  const outOfOrder = stops.filter((stop, i) => i > 0 && stop.order < (stops[i - 1]?.order ?? 0));
  expect(outOfOrder).toEqual([]);

  // Into the assistant and back out with the keyboard only.
  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Johnny’s assistant" });
  await expect(dialog).toBeVisible();
  await page.keyboard.press("Tab");
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(page.getByRole("button", { name: OPEN })).toBeFocused();

  expect(messages).toEqual([]);
});

test.describe("with reduced motion", () => {
  test.use({ reducedMotion: "reduce" });

  test("nothing animates and the page stays axe clean", async ({ page }) => {
    const messages = collectConsole(page);
    await page.goto("/");
    await scrollThrough(page);

    expect(await runningAnimations(page)).toEqual([]);

    await page.getByRole("button", { name: OPEN }).click();
    await page.getByRole("button", { name: "What do you build?" }).click();
    expect(await runningAnimations(page)).toEqual([]);

    expect(await seriousViolations(page)).toEqual([]);
    expect(messages).toEqual([]);
  });
});

test("the assistant panel and the project mock-ups keep their own radii", async ({ page }) => {
  await page.goto("/");
  const radii = await page
    .locator("#work *")
    .evaluateAll((elements) => elements.map((element) => getComputedStyle(element).borderRadius));
  // 14px: app window mock-up and booking option tiles (`rounded-panel`).
  expect(radii).toContain("14px");

  await page.getByRole("button", { name: OPEN }).click();
  const dialog = page.getByRole("dialog", { name: "Johnny’s assistant" });
  expect(await dialog.evaluate((element) => getComputedStyle(element).borderRadius)).toBe("20px");
});
