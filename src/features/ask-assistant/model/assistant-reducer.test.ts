import { describe, expect, it } from "vitest";

import { assistantReducer, initialAssistantState, nextRequestId } from "./assistant-reducer";
import { GREETING } from "./content";
import type { AssistantAction, AssistantState } from "./types";

function run(actions: AssistantAction[], state: AssistantState = initialAssistantState) {
  return actions.reduce(assistantReducer, state);
}

describe("assistantReducer", () => {
  it("starts closed with the greeting", () => {
    expect(initialAssistantState).toMatchObject({ open: false, typing: false, unread: 0 });
    expect(initialAssistantState.messages).toEqual([{ id: 0, from: "bot", text: GREETING }]);
  });

  it("opens, closes and toggles", () => {
    expect(run([{ type: "open" }]).open).toBe(true);
    expect(run([{ type: "open" }, { type: "close" }]).open).toBe(false);
    expect(run([{ type: "toggle" }]).open).toBe(true);
    expect(run([{ type: "toggle" }, { type: "toggle" }]).open).toBe(false);
  });

  it("adds the question and starts typing", () => {
    const state = run([{ type: "ask", text: "Show projects" }]);
    expect(state.typing).toBe(true);
    expect(state.pendingId).toBe(1);
    expect(state.messages.at(-1)).toEqual({ id: 1, from: "user", text: "Show projects" });
  });

  it("ignores new questions while typing", () => {
    const typing = run([{ type: "ask", text: "Show projects" }]);
    expect(nextRequestId(typing)).toBeNull();
    expect(run([{ type: "ask", text: "Again" }], typing)).toBe(typing);
  });

  it("adds the reply and stops typing", () => {
    const state = run([
      { type: "open" },
      { type: "ask", text: "Show projects" },
      { type: "reply", requestId: 1, text: "Five recent ones." },
    ]);
    expect(state.typing).toBe(false);
    expect(state.pendingId).toBeNull();
    expect(state.unread).toBe(0);
    expect(state.messages.at(-1)).toEqual({ id: 2, from: "bot", text: "Five recent ones." });
  });

  it("counts replies that arrive while closed as unread, and clears them on open", () => {
    const closed = run([
      { type: "ask", text: "Show projects" },
      { type: "reply", requestId: 1, text: "Five recent ones." },
    ]);
    expect(closed.unread).toBe(1);
    expect(run([{ type: "toggle" }], closed).unread).toBe(0);
    expect(run([{ type: "open" }], closed).unread).toBe(0);
  });

  it("drops a reply to a question that is no longer pending", () => {
    const reset = run([{ type: "ask", text: "Show projects" }, { type: "reset" }]);
    expect(run([{ type: "reply", requestId: 1, text: "Late" }], reset)).toBe(reset);
  });

  it("askAbout opens the panel and asks, or only opens while typing", () => {
    const asked = run([{ type: "askAbout", text: "Tell me about Parking Application" }]);
    expect(asked.open).toBe(true);
    expect(asked.typing).toBe(true);
    expect(asked.messages.at(-1)?.text).toBe("Tell me about Parking Application");

    const closedWhileTyping = run([{ type: "close" }, { type: "askAbout", text: "Other" }], asked);
    expect(closedWhileTyping.open).toBe(true);
    expect(closedWhileTyping.messages).toHaveLength(asked.messages.length);
  });

  it("reset goes back to the greeting and stops typing but keeps the panel open", () => {
    const state = run([
      { type: "open" },
      { type: "ask", text: "Show projects" },
      { type: "reset" },
    ]);
    expect(state).toMatchObject({ open: true, typing: false, pendingId: null, unread: 0 });
    expect(state.messages).toEqual(initialAssistantState.messages);
  });
});
