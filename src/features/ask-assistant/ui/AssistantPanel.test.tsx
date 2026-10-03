import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { REPLY_DELAY_MS } from "../api";
import { AssistantProvider, resetFirstVisitPill } from "../model";
import { AssistantLauncher } from "./AssistantLauncher";

/** Opens the panel and gives the conversation list a fake content height (jsdom has no layout). */
function openConversation(height: number) {
  render(<AssistantLauncher />, { wrapper: AssistantProvider });
  fireEvent.click(screen.getByRole("button", { name: "Open chat with Johnny’s assistant" }));
  const list = screen.getByRole("list", { name: "Conversation" });
  let scrollHeight = height;
  Object.defineProperty(list, "scrollHeight", { get: () => scrollHeight });
  return {
    list,
    grow: (by: number) => {
      scrollHeight += by;
    },
  };
}

describe("AssistantPanel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    resetFirstVisitPill();
  });

  it("scrolls to the typing indicator when a question is sent", () => {
    const { list } = openConversation(400);
    list.scrollTop = 0;

    fireEvent.click(screen.getByRole("button", { name: "What do you build?" }));

    expect(list.scrollTop).toBe(400);
  });

  it("scrolls to the end of the reply that replaces the typing indicator", async () => {
    const { list, grow } = openConversation(400);
    fireEvent.click(screen.getByRole("button", { name: "What do you build?" }));
    expect(list.scrollTop).toBe(400);

    // The reply swaps one bubble for another, so the bubble count stays the same but the list grows.
    grow(160);
    await act(async () => {
      await vi.advanceTimersByTimeAsync(REPLY_DELAY_MS);
    });

    expect(list.scrollTop).toBe(560);
  });
});
