import type { Project } from "./types";

/** The five projects in "Selected work", in display order. */
export const projects = [
  {
    id: "p01",
    index: 1,
    name: "Enterprise Web Platform",
    description: "Admin app with role-based access, SSO and a drag-and-drop dashboard",
    shortDescription: "Admin app with roles, SSO and dashboards",
    context: "Eastgate",
    years: { start: 2026 },
    assistantSummary:
      "At Eastgate, Huy is the main frontend developer on an enterprise admin app built with React 19, TypeScript and Vite. He built user and access management, activity logs and a drag-and-drop dashboard, plus SSO with permission-based navigation. Screens run on mock data and switch to real APIs with no changes.",
  },
  {
    id: "p02",
    index: 2,
    name: "Event Planning Marketplace",
    description: "English and Arabic (RTL) portals with booking, payments and live chat",
    shortDescription: "EN / Arabic RTL booking portals",
    context: "Eastgate",
    years: { start: 2026 },
    assistantSummary:
      "Customer and vendor portals for an English and Arabic marketplace, with full right-to-left support. Highlights: a 5-step booking flow with saved drafts, a payment gateway with installments and deposits, and real-time chat over WebSocket. Built with Next.js App Router, TanStack Query and Zustand.",
  },
  {
    id: "p03",
    index: 3,
    name: "Appointment Booking",
    description: "Scheduling admin on Next.js 16 with a NestJS API",
    shortDescription: "Next.js 16 admin, NestJS API",
    context: "Fullstack",
    years: { start: 2025, end: 2026 },
    assistantSummary:
      "A fullstack project: an admin for appointments, rosters and waitlists on Next.js 16 and Bun, backed by a NestJS and PostgreSQL API he built. The frontend follows Feature-Sliced Design, with Figma design tokens for color and type.",
  },
  {
    id: "p04",
    index: 4,
    name: "Performance Tracking",
    description: "Micro-frontend app and design system on Tailwind + Ant Design",
    shortDescription: "Micro-frontends and a design system",
    context: "VMO",
    years: { start: 2025 },
    assistantSummary:
      "At VMO, Huy built React and TypeScript interfaces on a micro-frontend architecture so several teams could ship large features in parallel. He also built the design system on Tailwind CSS and Ant Design.",
  },
  {
    id: "p05",
    index: 5,
    name: "Parking Application",
    description: "Map interfaces with Mapbox GL & deck.gl, GraphQL via Apollo",
    shortDescription: "Mapbox GL & deck.gl maps",
    context: "VMO",
    years: { start: 2023, end: 2025 },
    assistantSummary:
      "Map interfaces built with Mapbox GL and deck.gl, connected to GraphQL through Apollo. Huy added accessible Radix UI components and fixed frontend performance issues.",
  },
] as const satisfies readonly Project[];

export type ProjectId = (typeof projects)[number]["id"];

/** The project with this id, or `undefined`. */
export function getProject(id: string): Project | undefined {
  return projects.find((project) => project.id === id);
}
