import { getProject, projects } from "@/entities/project";

// Direct files, not ../model: the model's provider imports this module.
import { CHIP_ANSWERS, CHIPS, FALLBACK_ANSWER } from "../model/content";
import type { ChipId, Question } from "../model/types";

/** How long the assistant "types" before a reply appears. */
export const REPLY_DELAY_MS = 1300;

const KEYWORDS: readonly [ChipId, RegExp][] = [
  ["availability", /\b(available|availability|hire|hiring|contact|email|freelance|job)\b/],
  ["projects", /\b(projects?|portfolio|work)\b/],
  ["build", /\b(build|stack|tech|react|next|typescript|nestjs)\b/],
];

/** Canned answer to free text: a chip label, a project name, then a few keywords. */
function answerText(text: string): string {
  const query = text.trim().toLowerCase();
  const chip = CHIPS.find((item) => item.label.toLowerCase() === query);
  if (chip) return CHIP_ANSWERS[chip.id];
  const project = projects.find((item) => query.includes(item.name.toLowerCase()));
  if (project) return project.assistantSummary;
  const match = KEYWORDS.find(([, pattern]) => pattern.test(query));
  return match ? CHIP_ANSWERS[match[0]] : FALLBACK_ANSWER;
}

/** The reply to a question, without the delay. */
export function answerFor(question: Question): string {
  if (question.kind === "chip") return CHIP_ANSWERS[question.chip];
  if (question.kind === "project") {
    return getProject(question.projectId)?.assistantSummary ?? FALLBACK_ANSWER;
  }
  return answerText(question.text);
}

/**
 * The assistant's reply. Answers are canned and arrive after `REPLY_DELAY_MS`; this is the one
 * place to swap in a real API later.
 */
export async function getReply(question: Question): Promise<string> {
  await new Promise((resolve) => {
    setTimeout(resolve, REPLY_DELAY_MS);
  });
  return answerFor(question);
}
