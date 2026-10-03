import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StackFlow } from "./StackFlow";

describe("StackFlow", () => {
  it("renders the stack region with its heading, label and sub line", () => {
    render(<StackFlow />);

    expect(screen.getByRole("region")).toHaveAttribute("id", "stack");
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("The stack, end to end");
    expect(screen.getByText("(Stack) · Request flow")).toBeInTheDocument();
    // One copy sits under the heading on desktop, the other below the heading row on mobile.
    expect(
      screen.getAllByText("Follow one request: an admin lets Editors export reports"),
    ).toHaveLength(2);
  });

  it("lists the five steps in order as an ordered list with headings", () => {
    render(<StackFlow />);

    const steps = screen.getByRole("list");
    expect(steps.tagName).toBe("OL");
    const items = within(steps).getAllByRole("listitem");
    expect(
      items.map((item) => within(item).getByRole("heading", { level: 3 }).textContent),
    ).toEqual([
      "What the user touches",
      "What the app remembers",
      "What checks the request",
      "Where it lands",
      "How it stays working",
    ]);
    expect(items[0]).toHaveTextContent("01 · Interface");
    expect(items[4]).toHaveTextContent("05 · Ship");
  });

  it("has the desktop and the shorter mobile text for each step", () => {
    render(<StackFlow />);

    expect(
      screen.getByText(
        "Playwright replays the flow, CI blocks the merge if anything breaks, then it deploys.",
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Playwright replays the flow, CI blocks a broken merge, then it deploys."),
    ).toBeInTheDocument();
  });
});
