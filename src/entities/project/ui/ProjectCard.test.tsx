import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { projects } from "../model";
import { ProjectCard } from "./ProjectCard";

const project = projects[1];

describe("ProjectCard", () => {
  it("is an article named by the project, with both description lines and the meta", () => {
    render(<ProjectCard project={project} />);

    expect(screen.getByRole("article")).toHaveAccessibleName("Event Planning Marketplace");
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Event Planning Marketplace",
    );
    expect(screen.getByText(project.description)).toBeInTheDocument();
    expect(screen.getByText(project.shortDescription)).toBeInTheDocument();
    expect(screen.getByText("Eastgate · 2026")).toBeInTheDocument();
  });

  it("renders the action and preview slots", () => {
    render(
      <ProjectCard
        project={project}
        action={<button type="button">Ask about this project</button>}
        preview={<p>Booking demo</p>}
      />,
    );

    expect(screen.getByRole("button", { name: "Ask about this project" })).toBeInTheDocument();
    expect(screen.getByText("Booking demo")).toBeInTheDocument();
  });
});
