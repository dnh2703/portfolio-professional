import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getProject } from "@/entities/project";

import { REPLY_DELAY_MS } from "../api";
import { AssistantProvider, useAssistant } from "./assistant-provider";
import { CHIP_ANSWERS } from "./content";

const noop = () => undefined;

function renderAssistant() {
  return renderHook(() => useAssistant(), { wrapper: AssistantProvider });
}

async function finishTyping() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(REPLY_DELAY_MS);
  });
}

describe("AssistantProvider", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("throws outside the provider", () => {
    const silence = vi.spyOn(console, "error").mockImplementation(noop);
    expect(() => renderHook(useAssistant)).toThrow(/AssistantProvider/);
    silence.mockRestore();
  });

  it("types for the reply delay, then answers", async () => {
    const { result } = renderAssistant();
    act(() => result.current.ask({ kind: "chip", chip: "build" }, "What do you build?"));
    expect(result.current.state.typing).toBe(true);

    await finishTyping();
    expect(result.current.state.typing).toBe(false);
    expect(result.current.state.messages.at(-1)?.text).toBe(CHIP_ANSWERS.build);
  });

  it("ignores questions while typing", async () => {
    const { result } = renderAssistant();
    act(() => result.current.ask({ kind: "chip", chip: "build" }, "What do you build?"));
    act(() => result.current.ask({ kind: "chip", chip: "projects" }, "Show projects"));
    await finishTyping();

    const texts = result.current.state.messages.map((message) => message.text);
    expect(texts).toEqual([texts[0], "What do you build?", CHIP_ANSWERS.build]);
  });

  it("drops the pending reply on reset", async () => {
    const { result } = renderAssistant();
    act(() => result.current.ask({ kind: "chip", chip: "build" }, "What do you build?"));
    act(() => result.current.reset());
    await finishTyping();

    expect(result.current.state.messages).toHaveLength(1);
    expect(result.current.state.typing).toBe(false);
  });

  it("asks about a project and opens the panel", async () => {
    const { result } = renderAssistant();
    act(() => result.current.askAboutProject("p02"));
    expect(result.current.state.open).toBe(true);
    expect(result.current.state.messages.at(-1)?.text).toBe(
      "Tell me about Event Planning Marketplace",
    );

    await finishTyping();
    expect(result.current.state.messages.at(-1)?.text).toBe(getProject("p02")?.assistantSummary);
  });
});
