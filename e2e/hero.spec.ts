import { expect, test } from "@playwright/test";

const HEADLINE = "Frontend that feels inevitable, built end to end.";

test("hero owns the only h1 and the headline fits the viewport", async ({ page }) => {
  await page.goto("/");

  const heading = page.getByRole("heading", { level: 1 });
  await expect(heading).toHaveCount(1);
  await expect(heading).toHaveText(HEADLINE);
  await expect(page.getByRole("region", { name: HEADLINE })).toBeVisible();

  const overflow = await heading.evaluate((h1) => h1.scrollWidth - h1.clientWidth);
  expect(overflow).toBe(0);
});

test.describe("desktop", () => {
  test.skip(({ isMobile }) => isMobile, "facts and marquee only exist on the 1440 board");

  test("shows the facts and a pausable stack marquee", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText("Eastgate Software")).toBeVisible();
    await expect(page.getByRole("link", { name: "Available for projects" })).toBeHidden();

    const list = page.getByRole("list", { name: "Tech stack" });
    await expect(list.getByRole("listitem")).toHaveCount(12);
    const track = list.locator("..");
    const playState = () =>
      track.evaluate((element) => getComputedStyle(element).animationPlayState);
    await page.mouse.move(0, 0);
    expect(await playState()).toBe("running");

    // The track itself moves, so hover its clipping container.
    await track.locator("..").hover();
    expect(await playState()).toBe("paused");

    await page.mouse.move(0, 0);
    await page.getByRole("button", { name: "Pause Tech stack" }).click();
    await page.mouse.move(0, 0);
    expect(await playState()).toBe("paused");
    await expect(page.getByRole("button", { name: "Play Tech stack" })).toBeVisible();
  });

  test("marquee is static under reduced motion", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");

    const list = page.getByRole("list", { name: "Tech stack" });
    const animation = await list
      .locator("..")
      .evaluate((element) => getComputedStyle(element).animationName);
    expect(animation).toBe("none");
    await expect(page.getByRole("button", { name: "Pause Tech stack" })).toBeHidden();
    const last = list.getByRole("listitem").last();
    await last.scrollIntoViewIfNeeded();
    await expect(last).toBeInViewport({ ratio: 1 });
  });
});

test.describe("mobile", () => {
  test.skip(({ isMobile }) => !isMobile, "the 390 board swaps facts and marquee for the CTA");

  test("shows the short intro and the availability link instead", async ({ page }) => {
    await page.goto("/");

    await expect(page.getByText(/building enterprise platforms and marketplaces\.$/)).toBeVisible();
    await expect(page.getByRole("link", { name: "Available for projects" })).toBeVisible();
    await expect(page.getByRole("list", { name: "Tech stack" })).toBeHidden();
    await expect(page.getByText("Eastgate Software")).toBeHidden();
  });
});
