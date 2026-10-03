import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Section } from "./Section";

describe("Section", () => {
  it("renders a region named by its heading", () => {
    render(
      <Section id="work" aria-labelledby="work-heading">
        <h2 id="work-heading">Selected work</h2>
      </Section>,
    );
    expect(screen.getByRole("region", { name: "Selected work" })).toHaveAttribute("id", "work");
  });
});
