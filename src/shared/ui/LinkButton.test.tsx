import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LinkButton } from "./LinkButton";

describe("LinkButton", () => {
  it("renders an internal link in the same tab", () => {
    render(<LinkButton href="#work">See work</LinkButton>);

    const link = screen.getByRole("link", { name: "See work" });
    expect(link).toHaveAttribute("href", "#work");
    expect(link).not.toHaveAttribute("target");
  });

  it("opens http(s) links in a new tab with the external arrow", () => {
    render(<LinkButton href="https://github.com/dnh2703">GitHub</LinkButton>);

    const link = screen.getByRole("link", { name: /^GitHub\s?\(opens in a new tab\)$/ });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
    expect(link).toHaveTextContent("↗");
  });

  it("lets the caller opt out of the external style", () => {
    render(
      <LinkButton href="https://dnh2703.work" external={false}>
        Home
      </LinkButton>,
    );
    expect(screen.getByRole("link", { name: "Home" })).not.toHaveAttribute("target");
  });
});
