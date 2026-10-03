import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { stack } from "../config";
import { Hero } from "./Hero";

describe("Hero", () => {
  it("is a region named by the page's only h1", () => {
    render(<Hero />);

    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent("Frontend that feels inevitable, built end to end.");
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("region")).toHaveAccessibleName(heading.textContent);
  });

  it("lists the facts as terms and values", () => {
    render(<Hero />);
    const terms = screen.getAllByRole("term").map((term) => term.textContent);
    const values = screen.getAllByRole("definition").map((value) => value.textContent);
    expect(terms).toEqual(["Role", "Currently", "Based"]);
    expect(values).toEqual(["Fullstack, frontend-focused", "Eastgate Software", "Hanoi, Vietnam"]);
  });

  it("announces the stack once, in order, without the separators", () => {
    render(<Hero />);

    const list = screen.getByRole("list", { name: "Tech stack" });
    const items = within(list)
      .getAllByRole("listitem")
      .map((item) => item.textContent?.replace("✦", "").trim());
    expect(items).toEqual([...stack]);
    expect(screen.getAllByRole("list")).toHaveLength(1);
    expect(screen.queryByRole("button", { name: /Tech stack/ })).not.toBeInTheDocument();
  });

  it("links the availability pill to the contact section", () => {
    render(<Hero />);

    expect(screen.getByRole("link", { name: "Available for projects" })).toHaveAttribute(
      "href",
      "#contact",
    );
  });
});
