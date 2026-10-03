import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { navItems } from "../config/nav-items";
import { MobileMenu } from "./MobileMenu";

function openMenu() {
  render(<MobileMenu items={navItems} />);
  const button = screen.getByRole("button", { name: "Open menu" });
  button.focus();
  fireEvent.click(button);
  return button;
}

describe("MobileMenu", () => {
  it("starts closed with the nav hidden", () => {
    render(<MobileMenu items={navItems} />);

    expect(screen.getByRole("button", { name: "Open menu" })).toHaveAttribute(
      "aria-expanded",
      "false",
    );
    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });

  it("opens the primary nav with every section link", () => {
    const button = openMenu();

    expect(button).toHaveAttribute("aria-expanded", "true");
    expect(button).toHaveAccessibleName("Close menu");
    const nav = screen.getByRole("navigation", { name: "Primary" });
    expect(button).toHaveAttribute("aria-controls", nav.id);
    expect(screen.getAllByRole("link").map((link) => link.getAttribute("href"))).toEqual([
      "#work",
      "#about",
      "#stack",
      "#contact",
    ]);
  });

  it("closes on Escape and returns focus to the button", () => {
    const button = openMenu();
    screen.getByRole("link", { name: "About" }).focus();

    fireEvent.keyDown(document, { key: "Escape" });

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
    expect(button).toHaveFocus();
    expect(button).toHaveAccessibleName("Open menu");
  });

  it("closes when a link is chosen", () => {
    openMenu();

    fireEvent.click(screen.getByRole("link", { name: "Stack" }));

    expect(screen.queryByRole("navigation")).not.toBeInTheDocument();
  });
});
