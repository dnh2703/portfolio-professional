import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { siteConfig } from "@/shared/config";

import { SiteFooter } from "./SiteFooter";

describe("SiteFooter", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // 14:30 in Hanoi.
    vi.setSystemTime(new Date("2026-10-03T07:30:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("is the contact landmark named by its headline", () => {
    render(<SiteFooter />);

    const footer = screen.getByRole("contentinfo", { name: /^Let.s build\s?something good\.$/ });
    expect(footer).toHaveAttribute("id", "contact");
    expect(screen.getByText("(Contact) · Open to new opportunities")).toBeInTheDocument();
  });

  it("links the email address", () => {
    render(<SiteFooter />);

    expect(screen.getByRole("link", { name: "dnh2703@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:dnh2703@gmail.com",
    );
    expect(screen.getByRole("button", { name: "Copy email" })).toBeInTheDocument();
  });

  it("opens the profile links safely in a new tab", () => {
    render(<SiteFooter />);

    const links = within(screen.getByRole("list")).getAllByRole("link");
    expect(links.map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["GitHub ↗ (opens in a new tab)", siteConfig.links.github],
      ["LinkedIn ↗ (opens in a new tab)", siteConfig.links.linkedin],
      ["X ↗ (opens in a new tab)", siteConfig.links.x],
      ["dnh2703.work ↗ (opens in a new tab)", siteConfig.links.site],
    ]);
    for (const link of links) {
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("shows the copyright with the local time and the mobile location", () => {
    render(<SiteFooter />);

    expect(screen.getByText("14:30")).toBeInTheDocument();
    expect(screen.getByText("Hanoi, Vietnam")).toBeInTheDocument();
    expect(screen.getByText(/© 2026 Dang Nhat Huy/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Back to top" })).toHaveAttribute("href", "#top");
  });
});
