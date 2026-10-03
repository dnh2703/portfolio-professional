import { expect, test } from "@playwright/test";

test("about section shows the board's layout for each viewport", async ({ page }, testInfo) => {
  await page.goto("/");
  const about = page.getByRole("region", { name: "About" });
  await expect(about.getByRole("heading", { level: 2, name: "About" })).toBeVisible();
  await expect(about.getByText("first paint")).toBeVisible();

  const desktop = testInfo.project.name === "desktop";
  const desktopOnly = [
    about.getByRole("heading", { level: 3, name: "How I work" }),
    about.getByRole("heading", { level: 3, name: "Off-screen" }),
    about.getByText("Posts & Telecommunications Institute of Technology"),
    about.getByText("for enterprise teams"),
  ];
  const mobileOnly = [about.getByText("PTIT · Multimedia"), about.getByText("TanStack Query")];

  const visible = desktop ? desktopOnly : mobileOnly;
  const hidden = desktop ? mobileOnly : desktopOnly;
  await Promise.all([
    ...visible.map((locator) => expect(locator).toBeVisible()),
    ...hidden.map((locator) => expect(locator).toBeHidden()),
  ]);

  const leadSize = await about
    .getByText(/Nearly three years/)
    .evaluate((lead) => getComputedStyle(lead).fontSize);
  expect(leadSize).toBe(desktop ? "52px" : "28px");
});
