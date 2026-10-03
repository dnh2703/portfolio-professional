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

  it("reads the same in the stacked variant", () => {
    render(
      <a href="#top">
        <Logo variant="stacked" />
      </a>,
    );
    expect(screen.getByRole("link")).toHaveAccessibleName("Johnny Dang");
  });
});
