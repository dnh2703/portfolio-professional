import { projects } from "@/entities/project";
import { siteConfig } from "@/shared/config";

import type { ChipId, Topic } from "./types";

export const GREETING =
  "Hey, I'm Johnny's assistant. Ask me about his projects, stack or availability.";

/** Quick replies under the conversation, in display order. */
export const CHIPS: readonly { id: ChipId; label: string }[] = [
  { id: "build", label: "What do you build?" },
  { id: "projects", label: "Show projects" },
  { id: "availability", label: "Are you available?" },
];

export const CHIP_ANSWERS: Record<ChipId, string> = {
  build:
    "Data-heavy web products like enterprise admin platforms and booking marketplaces. Mostly React, Next.js and TypeScript, with NestJS and PostgreSQL behind when needed.",
  projects:
    "Five recent ones: Enterprise Web Platform, Event Planning Marketplace, Appointment Booking (Eastgate), Performance Tracking and Parking Application (VMO). See Selected work.",
  availability: `Open to new opportunities. Email ${siteConfig.email} and he'll reply within ${siteConfig.responseTime}.`,
};

/** Answer to a question the assistant can't answer. The server also alerts Johnny on Telegram. */
export const FALLBACK_ANSWER = `I can't answer that one, but Johnny can. Email ${siteConfig.email}.`;

/** Answer when a visitor is over the rate limit. */
export const LIMIT_ANSWER = `You're asking a lot. Try again later or email ${siteConfig.email}.`;

/**
 * Everything a typed question can be about. Jev sees the `id` and `description` and picks one
 * topic (or "none"); the visitor gets the `answer`. Rates, remote work or relocation, spoken
 * languages, contact details beyond email and this website are left out on purpose, so they get
 * `FALLBACK_ANSWER` and reach Johnny on Telegram.
 */
export const TOPICS: readonly Topic[] = [
  {
    id: "build",
    description: "What kind of products he builds and what he works on in general",
    answer: CHIP_ANSWERS.build,
  },
  {
    id: "projects",
    description: "His projects or portfolio as a whole: which projects he has done",
    answer: CHIP_ANSWERS.projects,
  },
  {
    id: "availability",
    description:
      "Whether he is available, open to a new job, freelance work or being hired, and how to email him. Not salary, rates, remote work or relocation",
    answer: CHIP_ANSWERS.availability,
  },
  {
    id: "frontend",
    description: "His frontend stack: languages, frameworks and libraries for the UI",
    answer: "TypeScript, React and Next.js, with TanStack Query, Tailwind and Radix UI.",
  },
  {
    id: "backend",
    description: "Backend or fullstack work: APIs, servers, databases",
    answer: "NestJS and PostgreSQL. He built the API behind Appointment Booking himself.",
  },
  {
    id: "experience",
    description: "His work experience, current job, employers and years of experience",
    answer:
      "Frontend / Fullstack Developer at Eastgate Software since Oct 2025. Before that, Frontend Developer at VMO Holdings (Dec 2023 – Oct 2025). Nearly three years shipping data-heavy products.",
  },
  {
    id: "education",
    description: "His education: university, degree, courses and certificates",
    answer:
      "Multimedia at PTIT and the ReactJS Frontend Developer Program at FPT Software Academy, plus a CS50 certificate from Harvard.",
  },
  {
    id: "location",
    description: "Where he lives or is based, and his time zone. Not relocation or remote work",
    answer: `Hanoi, Vietnam (${siteConfig.timeZoneLabel}).`,
  },
  {
    id: "ai_workflow",
    description: "How he uses AI tools and coding agents in his workflow",
    answer:
      "Spec-driven and AI-assisted: Claude Code from requirements to verification, parallel agents in git worktrees, and a human approval at every stage.",
  },
  {
    id: "architecture",
    description: "How he structures and architects frontend code",
    answer:
      "Feature-Sliced and feature-based structures. Screens run on mock data and switch to real APIs unchanged.",
  },
  {
    id: "testing",
    description: "Testing, code quality, CI and static analysis",
    answer:
      "Vitest, Playwright and Storybook, from unit tests to visual checks, with static analysis in CI.",
  },
  {
    id: "hobbies",
    description: "What he does off-screen: hobbies, sports, free time",
    answer: "Running, badminton, gaming.",
  },
  {
    id: "greeting",
    description: "A greeting, thanks or small talk with no real question",
    answer: GREETING,
  },
  ...projects.map((project) => ({
    id: project.id,
    description: `The ${project.name} project: ${project.description}`,
    answer: project.assistantSummary,
  })),
];

/** The visitor's message for "ask about this project". */
export function askAboutText(projectName: string): string {
  return `Tell me about ${projectName}`;
}
