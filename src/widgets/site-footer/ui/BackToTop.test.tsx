import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { BackToTop } from "./BackToTop";

function mockReducedMotion(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn((query: string) => ({ matches: reduce && query.includes("reduce") })),
  );
}

function renderWithTarget() {
  render(
    <>
      <section id="top" aria-label="Intro" />
      <BackToTop />
    </>,
  );
  return screen.getByRole("link", { name: "Back to top" });
}

describe("BackToTop", () => {
  const scrollTo = vi.fn();

  beforeEach(() => {
    window.scrollTo = scrollTo;
  });

  afterEach(() => {
    scrollTo.mockReset();
    vi.unstubAllGlobals();
  });

  it("links to the first section", () => {
    render(<BackToTop />);

    expect(screen.getByRole("link", { name: "Back to top" })).toHaveAttribute("href", "#top");
  });

  it("scrolls smoothly and moves focus to the first section", () => {
    mockReducedMotion(false);
    const link = renderWithTarget();

    fireEvent.click(link);

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
    const target = screen.getByRole("region", { name: "Intro" });
    expect(target).toHaveFocus();
    expect(target).toHaveAttribute("tabindex", "-1");
  });

  it("jumps without smooth scrolling when reduced motion is preferred", () => {
    mockReducedMotion(true);
    const link = renderWithTarget();

    fireEvent.click(link);

    expect(scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});
