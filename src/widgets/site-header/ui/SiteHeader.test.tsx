import { render, screen, within } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { SiteHeader } from "./SiteHeader";

describe("SiteHeader", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    // 14:30 in Hanoi.
    vi.setSystemTime(new Date("2026-10-03T07:30:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("links the logo home", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("link", { name: "Johnny Dang · home" })).toHaveAttribute("href", "/");
  });

  it("has a primary nav to the home sections", () => {
    render(<SiteHeader />);

    // The menu panel is closed, so only the desktop nav is exposed.
    const nav = screen.getByRole("navigation", { name: "Primary" });
    const links = within(nav).getAllByRole("link");
    expect(links.map((link) => [link.textContent, link.getAttribute("href")])).toEqual([
      ["Work", "#work"],
      ["About", "#about"],
      ["Stack", "#stack"],
      ["Contact", "#contact"],
    ]);
  });

  it("shows availability, coordinates, the year and the local time", () => {
    render(<SiteHeader />);

    expect(screen.getByText("Available for projects")).toBeInTheDocument();
    expect(screen.getByText("21° 01′ 42″ N, 105° 51′ 15″ E")).toBeInTheDocument();
    expect(screen.getByText("21° 01′ N, 105° 51′ E")).toBeInTheDocument();
    expect(screen.getByText("Portfolio ©2026")).toBeInTheDocument();
    expect(screen.getByText("14:30 GMT+7")).toBeInTheDocument();
  });

  it("has a menu button for narrow screens", () => {
    render(<SiteHeader />);

    expect(screen.getByRole("button", { name: "Open menu" })).toBeInTheDocument();
  });
});
