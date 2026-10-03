// oxlint-disable-next-line import/no-unassigned-import -- marker import: a build error if a client module imports this file
import "server-only";

import { choice, TypeSafeClient } from "@typesafe-ai/sdk";
import type { JsonValue } from "@typesafe-ai/sdk";

/** One Choice question for Jev: the instructions, the options with descriptions, and the state. */
export type ChoiceRequest = {
  instructions: string;
  criteria: Record<string, string>;
  state: { [key: string]: JsonValue };
};

export type ChoicePick = { choice: string; confidence: number };

export type ChoiceClassifier = (request: ChoiceRequest) => Promise<ChoicePick>;

/**
 * Asks Jev (TypeSafe System One) one Choice and returns the option it picked and its confidence.
 * `null` when `TYPESAFE_API_KEY` is not set, so callers can fall back to something local.
 */
export function createChoiceClassifier(
  apiKey = process.env.TYPESAFE_API_KEY,
): ChoiceClassifier | null {
  if (!apiKey) return null;
  // A visitor is waiting: one quick retry, then give up and fall back.
  const client = new TypeSafeClient({ apiKey, timeout: 5000, retry: { maxRetries: 1 } });
  return async ({ instructions, criteria, state }) => {
    const { answers } = await client.systemOne({
      state,
      questions: { topic: choice(instructions, criteria) },
    });
    return { choice: answers.topic.choice, confidence: answers.topic.confidence };
  };
}
