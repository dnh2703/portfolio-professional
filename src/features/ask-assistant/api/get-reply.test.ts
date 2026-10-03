import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getProject } from "@/entities/project";
import { siteConfig } from "@/shared/config";

import { CHIP_ANSWERS, FALLBACK_ANSWER } from "../model/content";
import { answerFor, getReply, REPLY_DELAY_MS } from "./get-reply";

describe("answerFor", () => {
  it("answers each chip", () => {
    expect(answerFor({ kind: "chip", chip: "build" })).toBe(CHIP_ANSWERS.build);
    expect(answerFor({ kind: "chip", chip: "availability" })).toContain(siteConfig.email);
    expect(answerFor({ kind: "chip", chip: "availability" })).toContain(siteConfig.responseTime);
  });

  it("answers a project with its assistant summary", () => {
    expect(answerFor({ kind: "project", projectId: "p05" })).toBe(
      getProject("p05")?.assistantSummary,
    );
    expect(answerFor({ kind: "project", projectId: "nope" })).toBe(FALLBACK_ANSWER);
  });

  it("matches free text to a chip, a project or a keyword", () => {
    expect(answerFor({ kind: "text", text: "  show PROJECTS " })).toBe(CHIP_ANSWERS.projects);
    expect(answerFor({ kind: "text", text: "What about appointment booking?" })).toBe(
      getProject("p03")?.assistantSummary,
    );
    expect(answerFor({ kind: "text", text: "Can I hire you?" })).toBe(CHIP_ANSWERS.availability);
    expect(answerFor({ kind: "text", text: "What's your stack" })).toBe(CHIP_ANSWERS.build);
    expect(answerFor({ kind: "text", text: "Tell me a joke" })).toBe(FALLBACK_ANSWER);
  });
});

describe("getReply", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves with the answer after the typing delay", async () => {
    const onReply = vi.fn();
    void getReply({ kind: "chip", chip: "build" }).then(onReply);

    await vi.advanceTimersByTimeAsync(REPLY_DELAY_MS - 1);
    expect(onReply).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(onReply).toHaveBeenCalledWith(CHIP_ANSWERS.build);
  });
});
