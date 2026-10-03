import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

const OPEN = "Open chat with Johnny’s assistant";
const BUILD_ANSWER = /Data-heavy web products/;
const FALLBACK = "I can't answer that one, but Johnny can. Email dnh2703@gmail.com.";

// Typed questions are rate limited per IP. Give each test its own, so parallel tests and retries
// never share a limit. CI has no TypeSafe key, so the route answers with its keyword matching.
test.beforeEach(async ({ page }, testInfo) => {
  await page.setExtraHTTPHeaders({ "x-forwarded-for": `e2e-${testInfo.testId}-${testInfo.retry}` });
});

function collectErrors(page: Page) {
  const errors: string[] = [];
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  page.on("pageerror", (error) => errors.push(error.message));
  return errors;
}

async function seriousViolations(page: Page) {
  const { violations } = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa", "wcag22aa"])
    .analyze();
  return violations
    .filter((v) => v.impact === "serious" || v.impact === "critical")
    .map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length }));
}

/** Presses Tab until the button named `name` has focus, at most `left` times. */
async function tabTo(page: Page, name: string, left = 8): Promise<void> {
  const target = page.getByRole("button", { name, exact: true });
  const focused = await target.evaluate((element) => element === document.activeElement);
  if (focused || left === 0) {
    await expect(target).toBeFocused();
    return;
  }
  await page.keyboard.press("Tab");
  await tabTo(page, name, left - 1);
}

/** Presses `key` `times` times, one after another. */
async function press(page: Page, key: string, times: number): Promise<void> {
  if (times === 0) return;
  await page.keyboard.press(key);
  await press(page, key, times - 1);
}

test("keyboard only: open the assistant, ask, close, focus returns to the launcher", async ({
  page,
}) => {
  const errors = collectErrors(page);
  await page.goto("/");
  await page.waitForLoadState("networkidle");

  // The launcher is the last control on the page, so Shift+Tab from the top reaches it.
  await page.keyboard.press("Shift+Tab");
  const launcher = page.getByRole("button", { name: OPEN });
  await expect(launcher).toBeFocused();
  await expect(page.getByText("Ask me anything")).toBeVisible();

  await page.keyboard.press("Enter");
  const dialog = page.getByRole("dialog", { name: "Johnny’s assistant" });
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAttribute("aria-modal", "true");
  await expect(page.getByRole("button", { name: "Close chat" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);

  await tabTo(page, "What do you build?");
  await page.keyboard.press("Enter");
  const conversation = dialog.getByRole("list", { name: "Conversation" });
  await expect(conversation).toContainText("What do you build?");
  // The chips are gone after the first question; focus moves to the message field.
  await expect(page.getByRole("button", { name: "What do you build?" })).toHaveCount(0);
  await expect(dialog.getByRole("textbox", { name: "Message" })).toBeFocused();
  await expect(conversation).toContainText(BUILD_ANSWER, { timeout: 5000 });
  // The assistant's polite live region (the footer has its own status region too).
  await expect(page.getByRole("status").filter({ hasText: BUILD_ANSWER })).toHaveCount(1);

  // Tab stays inside the panel.
  await press(page, "Tab", 10);
  expect(await dialog.evaluate((element) => element.contains(document.activeElement))).toBe(true);

  expect(await seriousViolations(page)).toEqual([]);

  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(launcher).toBeFocused();
  // The pill only shows until the first open, also after a reload.
  await expect(page.getByText("Ask me anything")).toBeHidden();
  await page.reload();
  await expect(page.getByRole("button", { name: OPEN })).toBeVisible();
  await expect(page.getByText("Ask me anything")).toBeHidden();

  expect(errors).toEqual([]);
});

test("a reply that lands while closed shows as unread", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: OPEN }).click();
  await page.getByRole("button", { name: "Show projects" }).click();
  await page.getByRole("button", { name: "Close chat" }).click();

  await expect(page.getByRole("button", { name: `${OPEN}, 1 unread` })).toBeVisible({
    timeout: 5000,
  });
});

test("typing dots and the panel entrance respect reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: OPEN }).click();

  const dialog = page.getByRole("dialog", { name: "Johnny’s assistant" });
  expect(await dialog.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");

  await page.getByRole("button", { name: "What do you build?" }).click();
  const dot = dialog.locator("li span[aria-hidden='true']").first();
  expect(await dot.evaluate((element) => getComputedStyle(element).animationName)).toBe("none");
});

/** Pixels of the last bubble hidden below the bottom edge of the scrolling conversation. */
function hiddenBelow(page: Page) {
  return page.getByRole("list", { name: "Conversation" }).evaluate((list) => {
    const last = list.lastElementChild;
    if (!last) return 0;
    const bottom =
      list.getBoundingClientRect().bottom - Number.parseFloat(getComputedStyle(list).paddingBottom);
    return Math.max(0, Math.round(last.getBoundingClientRect().bottom - bottom));
  });
}

/**
 * Asks each question in turn and checks its whole reply ends up in view. The first one is a quick
 * reply; the chips are gone after that, so the rest are typed into the message field.
 */
async function askAndCheckScroll(page: Page, questions: string[], first = true): Promise<void> {
  const [question, ...rest] = questions;
  if (!question) return;
  if (first) {
    await page.getByRole("button", { name: question }).click();
  } else {
    await page.getByRole("textbox", { name: "Message" }).fill(question);
    await page.getByRole("button", { name: "Send" }).click();
  }
  const conversation = page.getByRole("list", { name: "Conversation" });
  await expect(conversation.getByText("Assistant is typing")).toHaveCount(0, { timeout: 5000 });
  await expect.poll(() => hiddenBelow(page)).toBe(0);
  await askAndCheckScroll(page, rest, false);
}

test("every reply scrolls fully into view above the message field", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("button", { name: OPEN }).click();
  const conversation = page.getByRole("list", { name: "Conversation" });

  // Enough long replies that the conversation has to scroll.
  await askAndCheckScroll(page, ["What do you build?", "Show projects", "What do you build?"]);
  expect(await conversation.evaluate((list) => list.scrollHeight > list.clientHeight)).toBe(true);
  expect(await conversation.evaluate((list) => getComputedStyle(list).scrollBehavior)).toBe(
    "smooth",
  );
});

test("the conversation jumps without smooth scrolling under reduced motion", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.getByRole("button", { name: OPEN }).click();
  const conversation = page.getByRole("list", { name: "Conversation" });
  expect(await conversation.evaluate((list) => getComputedStyle(list).scrollBehavior)).toBe("auto");
});

test("the launcher is smaller than the header logo and idles on a plain dot", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");

  const launcher = page.getByRole("button", { name: OPEN });
  const logoDisc = page
    .getByRole("link", { name: "Johnny Dang · home" })
    .locator("img")
    .filter({ visible: true })
    .first()
    .locator("..");
  const launcherBox = await launcher.boundingBox();
  const logoBox = await logoDisc.boundingBox();

  // 48 px on desktop, 40 px on mobile; the header logo disc is 52 / 44 px.
  expect(Math.round(launcherBox?.width ?? 0)).toBe(isMobile ? 40 : 48);
  expect(launcherBox?.width ?? 0).toBeLessThan(logoBox?.width ?? 0);

  const badge = launcher.locator("[data-badge]").filter({ visible: true });
  await expect(badge).toHaveAttribute("data-badge", "idle");
  await expect(badge.locator("span")).toHaveCount(0);
});

/** Types `text` into the message field and sends it. */
async function send(page: Page, text: string) {
  await page.getByRole("textbox", { name: "Message" }).fill(text);
  await page.getByRole("button", { name: "Send" }).click();
}

test("a typed question is answered by the assistant route", async ({ page }) => {
  const errors = collectErrors(page);
  await page.goto("/");
  await page.getByRole("button", { name: OPEN }).click();
  const conversation = page.getByRole("list", { name: "Conversation" });

  const request = page.waitForRequest(
    (req) => req.url().endsWith("/api/assistant") && req.method() === "POST",
  );
  await send(page, "Can I hire you?");
  expect((await request).postDataJSON()).toEqual({ text: "Can I hire you?" });
  await expect(conversation).toContainText(/Open to new opportunities/, { timeout: 5000 });

  // Nothing matches: the honest fallback with Johnny's email.
  await send(page, "Tell me a joke");
  await expect(conversation.getByText(FALLBACK)).toBeVisible({ timeout: 5000 });

  expect(errors).toEqual([]);
});

test("quick replies answer locally, without the assistant route", async ({ page }) => {
  const requests: string[] = [];
  page.on("request", (req) => {
    if (req.url().endsWith("/api/assistant")) requests.push(req.url());
  });
  await page.goto("/");
  await page.getByRole("button", { name: OPEN }).click();
  await page.getByRole("button", { name: "Show projects" }).click();
  await expect(page.getByRole("list", { name: "Conversation" })).toContainText(/Five recent/, {
    timeout: 5000,
  });
  expect(requests).toEqual([]);
});

test("shows the route's reply, including the over-limit one", async ({ page }) => {
  // Stands in for Jev and the rate limiter, so no key is needed.
  await page.route("**/api/assistant", (route) =>
    route.fulfill({
      status: 429,
      json: { reply: "You're asking a lot. Try again later or email dnh2703@gmail.com." },
    }),
  );
  await page.goto("/");
  await page.getByRole("button", { name: OPEN }).click();
  await send(page, "What do you build?");
  await expect(page.getByRole("list", { name: "Conversation" })).toContainText(
    /You're asking a lot/,
    { timeout: 5000 },
  );
});
