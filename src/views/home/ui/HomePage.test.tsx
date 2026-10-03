import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { AssistantProvider } from "@/features/ask-assistant";

import { HomePage } from "./HomePage";

describe("HomePage", () => {
  it("renders the landmarks and every section in design order", () => {
    render(<HomePage />, { wrapper: AssistantProvider });

    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("main")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      "Frontend that feels inevitable, built end to end.",
    );

    const sections = screen.getAllByRole("region").map((region) => region.id);
    expect(sections).toEqual(["top", "work", "about", "stack"]);
  });
});
