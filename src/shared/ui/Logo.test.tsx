import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Logo } from "./Logo";

describe("Logo", () => {
  it("reads as the name, with a decorative avatar", () => {
    render(
      <a href="#top">
        <Logo />
      </a>,
    );
    expect(screen.getByRole("link")).toHaveAccessibleName("Johnny Dang");
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
  });

  it.each(["sm", "lg"] as const)("reads the same in the stacked variant (%s)", (size) => {
    render(
      <a href="#top">
        <Logo variant="stacked" size={size} />
      </a>,
    );
    expect(screen.getByRole("link")).toHaveAccessibleName("Johnny Dang");
  });
});
