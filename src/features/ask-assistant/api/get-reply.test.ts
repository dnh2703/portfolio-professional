import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getProject } from "@/entities/project";
import { siteConfig } from "@/shared/config";

import { CHIP_ANSWERS, FALLBACK_ANSWER } from "../model/content";
import { answerFor, ASSISTANT_ENDPOINT, getReply, REPLY_DELAY_MS } from "./get-reply";

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

  it("points unanswered questions to Johnny's email", () => {
    expect(FALLBACK_ANSWER).toContain(siteConfig.email);
  });
});

describe("getReply", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  it("resolves a chip locally after the typing delay, without a request", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    const onReply = vi.fn();
    void getReply({ kind: "chip", chip: "build" }).then(onReply);

    await vi.advanceTimersByTimeAsync(REPLY_DELAY_MS - 1);
    expect(onReply).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(onReply).toHaveBeenCalledWith(CHIP_ANSWERS.build);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts typed text to the assistant route and waits at least the typing delay", async () => {
    const fetchMock = vi.fn(async () => Response.json({ reply: "From Jev" }));
    vi.stubGlobal("fetch", fetchMock);
    const onReply = vi.fn();
    void getReply({ kind: "text", text: "What do you test with?" }).then(onReply);

    await vi.advanceTimersByTimeAsync(REPLY_DELAY_MS - 1);
    expect(onReply).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(onReply).toHaveBeenCalledWith("From Jev");
    expect(fetchMock).toHaveBeenCalledWith(
      ASSISTANT_ENDPOINT,
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ text: "What do you test with?" }),
      }),
    );
  });

  it("shows the over-limit reply that comes with a 429", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => Response.json({ reply: "Slow down" }, { status: 429 })),
    );
    const reply = getReply({ kind: "text", text: "Hi" });
    await vi.advanceTimersByTimeAsync(REPLY_DELAY_MS);
    await expect(reply).resolves.toBe("Slow down");
  });

  it("falls back to the local keyword answer when the request fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        throw new TypeError("offline");
      }),
    );
    const reply = getReply({ kind: "text", text: "Can I hire you?" });
    await vi.advanceTimersByTimeAsync(REPLY_DELAY_MS);
    await expect(reply).resolves.toBe(CHIP_ANSWERS.availability);
  });
});
