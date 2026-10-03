import { siteConfig } from "@/shared/config";

import type { ChipId } from "./types";

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

/** Answer to free text that matches nothing the assistant knows. */
export const FALLBACK_ANSWER =
  "I can only answer questions about Johnny's work for now. Try asking about his projects, stack or availability.";

/** The visitor's message for "ask about this project". */
export function askAboutText(projectName: string): string {
  return `Tell me about ${projectName}`;
}
