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

  it("has the mobile names and lines from the design", () => {
    expect(
      projects.map((project): [string, string] => [
        "shortName" in project ? project.shortName : project.name,
        project.shortDescription,
      ]),
    ).toEqual([
      ["Enterprise Web Platform", "Role-based admin app with SSO · Eastgate 2026"],
      ["Event Marketplace", "EN / Arabic RTL booking portals"],
      ["Appointment Booking", "Next.js 16 admin + NestJS API"],
      ["Performance Tracking", "Micro-frontends · VMO"],
      ["Parking Application", "Mapbox GL & deck.gl maps · VMO"],
    ]);
  });

  it("has unique ids and an assistant summary for each project", () => {
    expect(new Set(projects.map((project) => project.id)).size).toBe(projects.length);
    for (const project of projects) {
      expect(project.assistantSummary.length).toBeGreaterThan(0);
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
