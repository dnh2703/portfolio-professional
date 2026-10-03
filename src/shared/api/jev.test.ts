import { describe, expect, it, vi } from "vitest";

import { createChoiceClassifier } from "./jev";

vi.mock("server-only", () => ({}));

const systemOne = vi.fn();
vi.mock("@typesafe-ai/sdk", () => ({
  choice: (instructions: unknown, criteria: unknown) => ({
    type: "choice",
    instructions,
    criteria,
  }),
  TypeSafeClient: class {
    systemOne = systemOne;
  },
}));

describe("createChoiceClassifier", () => {
  it("is null without an API key", () => {
    expect(createChoiceClassifier("")).toBeNull();
  });

  it("asks one Choice and returns the pick and its confidence", async () => {
    systemOne.mockResolvedValue({
      answers: { topic: { type: "choice", choice: "build", confidence: 0.8, probabilities: {} } },
    });
    const classify = createChoiceClassifier("test-key");
    const pick = await classify?.({
      instructions: "Which topic?",
      criteria: { build: "What he builds", none: "None" },
      state: { visitor_message: "What do you build?" },
    });

    expect(pick).toEqual({ choice: "build", confidence: 0.8 });
    expect(systemOne).toHaveBeenCalledWith({
      state: { visitor_message: "What do you build?" },
      questions: {
        topic: {
          type: "choice",
          instructions: "Which topic?",
          criteria: { build: "What he builds", none: "None" },
        },
      },
    });
  });
});
