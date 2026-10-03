import { expect, test } from "@playwright/test";

const STEP_TITLES = [
  "What the user touches",
  "What the app remembers",
  "What checks the request",
  "Where it lands",
  "How it stays working",
];

test("stack section shows the five request-flow steps for the viewport", async ({
  page,
}, testInfo) => {
  const desktop = testInfo.project.name === "desktop";
  await page.goto("/");

  // Hidden halves of the heading drop out of its accessible name, and the count is aria-hidden.
  const section = page.getByRole("region", {
    name: desktop ? "The stack, end to end" : "The stack",
    exact: true,
  });
  await expect(section).toHaveId("stack");
  await expect(section.getByText("(05)")).toBeVisible({ visible: !desktop });
  await expect(section.getByText("(Stack) · Request flow")).toBeVisible({ visible: desktop });

  const steps = section.locator("ol > li");
  await expect(steps).toHaveCount(5);
  await expect(section.getByRole("heading", { level: 3 })).toHaveText(STEP_TITLES);
  await expect(steps.first()).toContainText("01 · Interface");

  const fullText = section.getByText("CI blocks the merge if anything breaks");
  const shortText = section.getByText("CI blocks a broken merge");
  await expect(fullText).toBeVisible({ visible: desktop });
  await expect(shortText).toBeVisible({ visible: !desktop });

  // Desktop lays the steps out in one row; mobile stacks them.
  const tops = await steps.evaluateAll((items) =>
    items.map((item) => Math.round(item.getBoundingClientRect().top)),
  );
  expect(new Set(tops).size).toBe(desktop ? 1 : 5);
});
