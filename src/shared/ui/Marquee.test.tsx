import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Marquee } from "./Marquee";

function renderMarquee() {
  return render(
    <Marquee label="Tech stack">
      <li>Next.js</li>
      <li>React</li>
    </Marquee>,
  );
}

describe("Marquee", () => {
  it("exposes one named list; the looping copy is inert", () => {
    renderMarquee();

    expect(screen.getAllByRole("list")).toHaveLength(1);
    const list = screen.getByRole("list", { name: "Tech stack" });
    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
    expect(screen.getAllByText("React")).toHaveLength(2);
  });

  it("toggles between pause and play", () => {
    renderMarquee();

    fireEvent.click(screen.getByRole("button", { name: "Pause Tech stack" }));
    expect(screen.getByRole("button", { name: "Play Tech stack" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Play Tech stack" }));
    expect(screen.getByRole("button", { name: "Pause Tech stack" })).toBeInTheDocument();
  });
});
