import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { projects } from "../model";
import { ProjectCard } from "./ProjectCard";

const project = projects[1];

// jsdom loads no CSS, so both the mobile and the desktop copy are in the DOM here; which one
// shows is decided by `md:` utilities in the browser.
describe("ProjectCard", () => {
  it("is an article named by its heading, with the desktop and mobile copy and the meta", () => {
    render(<ProjectCard project={project} />);

    const heading = screen.getByRole("heading", { level: 3 });
    expect(heading).toHaveTextContent("Event Marketplace");
    expect(heading).toHaveTextContent("Event Planning Marketplace");
    expect(screen.getByRole("article")).toHaveAccessibleName(heading.textContent);
    expect(screen.getByText(project.description)).toBeInTheDocument();
    expect(screen.getByText("EN / Arabic RTL booking portals")).toBeInTheDocument();
    expect(screen.getByText("Eastgate · 2026")).toBeInTheDocument();
  });

  it("falls back to the name on mobile when there is no short name", () => {
    render(<ProjectCard project={projects[3]} />);

    expect(screen.getAllByText("Performance Tracking")).toHaveLength(2);
  });

  it("adds the number and an arrow in the mobile row variant", () => {
    const { rerender } = render(<ProjectCard project={projects[4]} />);
    expect(screen.getAllByText("05")).toHaveLength(1);
    expect(screen.queryByText("→")).not.toBeInTheDocument();

    rerender(<ProjectCard project={projects[4]} mobileVariant="row" />);
    expect(screen.getAllByText("05")).toHaveLength(2);
    expect(screen.getByText("→")).toBeInTheDocument();
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
