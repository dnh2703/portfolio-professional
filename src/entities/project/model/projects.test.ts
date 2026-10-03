import { describe, expect, it } from "vitest";

import { formatProjectIndex, formatProjectMeta } from "../lib";
import { getProject, projects } from "./projects";

describe("projects", () => {
  it("lists the five projects in order with the design's numbers and meta", () => {
    expect(
      projects.map((project) => [
        formatProjectIndex(project.index),
        project.name,
        formatProjectMeta(project),
      ]),
    ).toEqual([
      ["01", "Enterprise Web Platform", "Eastgate · 2026"],
      ["02", "Event Planning Marketplace", "Eastgate · 2026"],
      ["03", "Appointment Booking", "Fullstack · 2025–26"],
      ["04", "Performance Tracking", "VMO · 2025"],
      ["05", "Parking Application", "VMO · 2023–25"],
    ]);
  });

  it("has unique ids and non-empty copy, with a mobile line shorter than the desktop one", () => {
    expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length);
    for (const project of projects) {
      expect(project.assistantSummary.length).toBeGreaterThan(0);
      expect(project.shortDescription.length).toBeLessThan(project.description.length);
    }
  });
});

describe("getProject", () => {
  it("finds a project by id", () => {
    expect(getProject("p02")?.name).toBe("Event Planning Marketplace");
  });

  it("returns undefined for an unknown id", () => {
    expect(getProject("p99")).toBeUndefined();
  });
});
