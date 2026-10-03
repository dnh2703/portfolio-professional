import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getProject } from "@/entities/project";

import { CHIP_ANSWERS, FALLBACK_ANSWER, GREETING, TOPICS } from "../model/content";
import {
  alertMessage,
  answerTypedQuestion,
  CONFIDENCE_THRESHOLD,
  MAX_QUESTION_LENGTH,
  NO_TOPIC,
  topicAnswer,
  topicQuestion,
} from "./answer-question";
import type { AssistantServices, TopicPick } from "./answer-question";

// 14:40 UTC is 21:40 in Hanoi (GMT+7).
const NOW = new Date("2026-10-03T14:40:00Z");

/** Services with a fake Jev, an in-memory dedupe and a recorded Telegram. */
function services(classify: AssistantServices["classify"]) {
  const claimed = new Set<string>();
  const sendAlert = vi.fn(async (_message: string) => undefined);
  const value: AssistantServices = {
    classify,
    claimOnce: async (key) => {
      if (claimed.has(key)) return false;
      claimed.add(key);
      return true;
    },
    sendAlert,
    now: () => NOW,
  };
  return { value, sendAlert };
}

const picks = (pick: TopicPick) => vi.fn(async () => pick);

describe("topicQuestion", () => {
  it("offers every topic plus none, with only the visitor message as state", () => {
    const question = topicQuestion("Hello");
    expect(Object.keys(question.criteria)).toEqual([...TOPICS.map((topic) => topic.id), NO_TOPIC]);
    expect(Object.keys(question.criteria)).toHaveLength(19);
    expect(question.state).toEqual({ visitor_message: "Hello" });
  });

  it("reuses the project summaries for the project topics", () => {
    expect(TOPICS.find((topic) => topic.id === "p03")?.answer).toBe(
      getProject("p03")?.assistantSummary,
    );
  });
});

describe("topicAnswer", () => {
  it("answers a confident topic, at or above the threshold", () => {
    expect(topicAnswer({ choice: "build", confidence: 0.9 })).toBe(CHIP_ANSWERS.build);
    expect(topicAnswer({ choice: "greeting", confidence: CONFIDENCE_THRESHOLD })).toBe(GREETING);
  });

  it("gives nothing for none, low confidence or an unknown option", () => {
    expect(topicAnswer({ choice: NO_TOPIC, confidence: 1 })).toBeNull();
    expect(topicAnswer({ choice: "build", confidence: CONFIDENCE_THRESHOLD - 0.01 })).toBeNull();
    expect(topicAnswer({ choice: "made-up", confidence: 1 })).toBeNull();
  });
});

describe("alertMessage", () => {
  it("holds only the question and the time in GMT+7", () => {
    expect(alertMessage("Do you speak French?", NOW, false)).toBe(
      'Unanswered: "Do you speak French?" · 21:40 GMT+7',
    );
    expect(alertMessage("Hi", NOW, true)).toBe('Unanswered (Jev error): "Hi" · 21:40 GMT+7');
  });
});

describe("answerTypedQuestion", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("answers the topic Jev picks confidently, without an alert", async () => {
    const classify = picks({ choice: "testing", confidence: 0.92 });
    const { value, sendAlert } = services(classify);

    await expect(answerTypedQuestion("  How do you test?  ", value)).resolves.toMatch(/Vitest/);
    expect(classify).toHaveBeenCalledWith(topicQuestion("How do you test?"));
    expect(sendAlert).not.toHaveBeenCalled();
  });

  it("cuts the message to the maximum length before asking Jev", async () => {
    const classify = picks({ choice: "build", confidence: 1 });
    await answerTypedQuestion("a".repeat(MAX_QUESTION_LENGTH + 100), services(classify).value);
    expect(classify).toHaveBeenCalledWith(topicQuestion("a".repeat(MAX_QUESTION_LENGTH)));
  });

  it("falls back and alerts when Jev picks none", async () => {
    const { value, sendAlert } = services(picks({ choice: NO_TOPIC, confidence: 0.95 }));
    await expect(answerTypedQuestion("What are your rates?", value)).resolves.toBe(FALLBACK_ANSWER);
    expect(sendAlert).toHaveBeenCalledWith('Unanswered: "What are your rates?" · 21:40 GMT+7');
  });

  it("falls back and alerts when Jev is not confident", async () => {
    const { value, sendAlert } = services(picks({ choice: "build", confidence: 0.3 }));
    await expect(answerTypedQuestion("Hmm?", value)).resolves.toBe(FALLBACK_ANSWER);
    expect(sendAlert).toHaveBeenCalledTimes(1);
  });

  it("falls back and marks the alert when Jev fails", async () => {
    const classify = vi.fn(async (): Promise<TopicPick> => {
      throw new Error("503");
    });
    const { value, sendAlert } = services(classify);
    await expect(answerTypedQuestion("What do you build?", value)).resolves.toBe(FALLBACK_ANSWER);
    expect(sendAlert).toHaveBeenCalledWith(
      'Unanswered (Jev error): "What do you build?" · 21:40 GMT+7',
    );
  });

  it("uses the keyword matching without a key, and alerts on a miss", async () => {
    const { value, sendAlert } = services(null);
    await expect(answerTypedQuestion("Can I hire you?", value)).resolves.toBe(
      CHIP_ANSWERS.availability,
    );
    expect(sendAlert).not.toHaveBeenCalled();

    await expect(answerTypedQuestion("Tell me a joke", value)).resolves.toBe(FALLBACK_ANSWER);
    expect(sendAlert).toHaveBeenCalledWith('Unanswered: "Tell me a joke" · 21:40 GMT+7');
  });

  it("alerts once per identical question per day", async () => {
    const { value, sendAlert } = services(picks({ choice: NO_TOPIC, confidence: 1 }));
    await answerTypedQuestion("Do you relocate?", value);
    await answerTypedQuestion("  do you   RELOCATE? ", value);
    expect(sendAlert).toHaveBeenCalledTimes(1);

    await answerTypedQuestion("Do you work remotely?", value);
    expect(sendAlert).toHaveBeenCalledTimes(2);

    const nextDay = new Date(NOW.getTime() + 24 * 60 * 60 * 1000);
    await answerTypedQuestion("Do you relocate?", { ...value, now: () => nextDay });
    expect(sendAlert).toHaveBeenCalledTimes(3);
  });

  it("still replies when the alert fails", async () => {
    const { value } = services(picks({ choice: NO_TOPIC, confidence: 1 }));
    const failing = {
      ...value,
      sendAlert: async () => {
        throw new Error("Telegram down");
      },
    };
    await expect(answerTypedQuestion("Rates?", failing)).resolves.toBe(FALLBACK_ANSWER);
  });
});
