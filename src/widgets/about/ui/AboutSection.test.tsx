import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AboutSection } from "./AboutSection";

describe("AboutSection", () => {
  it("is a region named by its h2", () => {
    render(<AboutSection />);
    const region = screen.getByRole("region", { name: "About" });
    expect(region).toHaveAttribute("id", "about");
    expect(screen.getByRole("heading", { level: 2 })).toHaveAccessibleName("About");
  });

  it("names every group with an h3", () => {
    render(<AboutSection />);
    const groups = screen
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent);
    expect(groups).toEqual([
      "Experience",
      "Education",
      "How I work",
      "Off-screen",
      "Experience and education",
      "Stack",
    ]);
  });

  it("emphasises “first paint” in the lead", () => {
    render(<AboutSection />);
    expect(screen.getByText("first paint").tagName).toBe("EM");
  });

  it("lists the roles with their periods and the degrees", () => {
    render(<AboutSection />);
    const [roles, degrees] = screen.getAllByRole("list");
    if (!roles || !degrees) throw new Error("expected the experience and education lists");

    const roleItems = within(roles).getAllByRole("listitem");
    expect(roleItems.map((item) => item.textContent)).toEqual([
      "Eastgate SoftwareFrontend / Fullstack DeveloperOct 2025 – Now",
      "VMO HoldingsFrontend DeveloperDec 2023 – Oct 2025",
    ]);
    expect(within(degrees).getAllByRole("listitem")).toHaveLength(3);
  });

  it("shows the compact career list and the stack tags for mobile", () => {
    render(<AboutSection />);
    expect(screen.getByText("PTIT · Multimedia")).toBeInTheDocument();
    expect(screen.getByText("Claude Code")).toBeInTheDocument();
    expect(screen.getByText("TanStack Query")).toBeInTheDocument();
  });
});
