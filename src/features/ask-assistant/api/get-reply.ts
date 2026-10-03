import { getProject, projects } from "@/entities/project";

// Direct files, not ../model: the model's provider imports this module.
import { CHIP_ANSWERS, CHIPS, FALLBACK_ANSWER } from "../model/content";
import type { ChipId, Question } from "../model/types";

/** How long the assistant "types" before a reply appears. Typed questions wait at least this long. */
export const REPLY_DELAY_MS = 1300;

/** The route that answers typed questions (`app/api/assistant/route.ts`). */
export const ASSISTANT_ENDPOINT = "/api/assistant";

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

/**
 * The local reply to a question, without the delay. Free text uses keyword matching: the server's
 * answer when no TypeSafe key is set, and the client's when the server can't be reached.
 */
export function answerFor(question: Question): string {
  if (question.kind === "chip") return CHIP_ANSWERS[question.chip];
  if (question.kind === "project") {
    return getProject(question.projectId)?.assistantSummary ?? FALLBACK_ANSWER;
  }
  return answerText(question.text);
}

/** Asks the server about typed text. Falls back to the local answer if the request fails. */
async function fetchReply(text: string): Promise<string> {
  try {
    const response = await fetch(ASSISTANT_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    // The over-limit reply comes with a 429, so read the body whatever the status.
    const body: unknown = await response.json();
    if (body && typeof body === "object" && "reply" in body && typeof body.reply === "string") {
      return body.reply;
    }
  } catch {
    // Offline or the route failed: answer locally below.
  }
  return answerText(text);
}

/**
 * The assistant's reply. Quick replies and "ask about this project" answer locally after
 * `REPLY_DELAY_MS`; typed text goes to the server and takes at least that long, so fast replies
 * don't flash.
 */
export async function getReply(question: Question): Promise<string> {
  const delay = new Promise((resolve) => {
    setTimeout(resolve, REPLY_DELAY_MS);
  });
  const reply = question.kind === "text" ? fetchReply(question.text) : answerFor(question);
  const [answer] = await Promise.all([reply, delay]);
  return answer;
}
