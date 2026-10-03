import { siteConfig } from "@/shared/config";
import { formatLocalTime } from "@/shared/lib";

import { FALLBACK_ANSWER, TOPICS } from "../model/content";
import { answerFor } from "./get-reply";

/** Longest visitor message the server reads; the rest is cut off. */
export const MAX_QUESTION_LENGTH = 500;

/**
 * Lowest Jev confidence that still counts as a topic match. 0.5 is the TypeSafe docs' floor for
 * "genuinely unsure"; tune it with `bun run eval:assistant` and the owner's key.
 */
export const CONFIDENCE_THRESHOLD = 0.5;

/** The Choice option for questions no topic covers. */
export const NO_TOPIC = "none";

const ALERT_TTL_SECONDS = 24 * 60 * 60;

/** A Jev Choice over the topic catalog, in the shape `@typesafe-ai/sdk` takes. */
export type TopicQuestion = {
  instructions: string;
  criteria: Record<string, string>;
  state: { visitor_message: string };
};

/** The option Jev picked and how sure it is. */
export type TopicPick = { choice: string; confidence: number };

/** What `answerTypedQuestion` needs from the server. Injected so it can be tested without keys. */
export type AssistantServices = {
  /** Asks Jev. `null` when no TypeSafe key is set: the keyword matching answers instead. */
  classify: ((question: TopicQuestion) => Promise<TopicPick>) | null;
  /** `true` the first time `key` is claimed within `ttlSeconds`, `false` after. */
  claimOnce: (key: string, ttlSeconds: number) => Promise<boolean>;
  /** Sends a Telegram message to Johnny; a no-op when Telegram is not set up. */
  sendAlert: (message: string) => Promise<void>;
  now?: () => Date;
};

/** The single Choice Jev answers: which topic is this message about, or none of them. */
export function topicQuestion(text: string): TopicQuestion {
  const criteria: Record<string, string> = {};
  for (const topic of TOPICS) criteria[topic.id] = topic.description;
  criteria[NO_TOPIC] =
    "None of these: anything else, such as salary or rates, remote work or relocation, spoken languages, contact details other than email, questions about this website, or unrelated requests";
  return {
    instructions:
      "A visitor typed this message into the assistant on Johnny Dang's portfolio site. Which topic is the message about?",
    criteria,
    state: { visitor_message: text },
  };
}

/** The answer for Jev's pick, or `null` for "none", an unknown option or low confidence. */
export function topicAnswer(pick: TopicPick, threshold = CONFIDENCE_THRESHOLD): string | null {
  if (pick.confidence < threshold) return null;
  return TOPICS.find((topic) => topic.id === pick.choice)?.answer ?? null;
}

/** The Telegram alert: only the question and the time in Johnny's time zone. */
export function alertMessage(question: string, at: Date, jevError: boolean): string {
  const label = jevError ? "Unanswered (Jev error)" : "Unanswered";
  return `${label}: "${question}" · ${formatLocalTime(at, siteConfig.timeZone)} ${siteConfig.timeZoneLabel}`;
}

/** Same question on the same day (in Johnny's time zone) gives the same key. */
function alertKey(question: string, at: Date): string {
  const day = new Intl.DateTimeFormat("en-CA", { timeZone: siteConfig.timeZone }).format(at);
  return `assistant:alert:${day}:${question.toLowerCase().replaceAll(/\s+/g, " ")}`;
}

/** Alerts Johnny about an unanswered question, at most once per identical question per day. */
async function alertUnanswered(
  question: string,
  jevError: boolean,
  services: AssistantServices,
): Promise<void> {
  const at = services.now?.() ?? new Date();
  try {
    if (!(await services.claimOnce(alertKey(question, at), ALERT_TTL_SECONDS))) return;
    await services.sendAlert(alertMessage(question, at, jevError));
  } catch (error) {
    // A failed alert must never cost the visitor their reply.
    console.error("Assistant alert failed", error);
  }
}

/** Jev's answer, or `undefined` when Jev failed. */
async function askJev(
  classify: NonNullable<AssistantServices["classify"]>,
  question: string,
): Promise<string | null | undefined> {
  try {
    return topicAnswer(await classify(topicQuestion(question)));
  } catch (error) {
    console.error("Jev request failed", error);
    return undefined;
  }
}

/**
 * The reply to a typed question: one of Johnny's written answers, picked by Jev (or by keywords
 * without a key). Anything unanswered gets `FALLBACK_ANSWER` and a Telegram alert.
 */
export async function answerTypedQuestion(
  text: string,
  services: AssistantServices,
): Promise<string> {
  const question = text.trim().slice(0, MAX_QUESTION_LENGTH);
  if (!services.classify) {
    const answer = answerFor({ kind: "text", text: question });
    if (answer === FALLBACK_ANSWER) await alertUnanswered(question, false, services);
    return answer;
  }
  const answer = await askJev(services.classify, question);
  if (answer) return answer;
  await alertUnanswered(question, answer === undefined, services);
  return FALLBACK_ANSWER;
}
