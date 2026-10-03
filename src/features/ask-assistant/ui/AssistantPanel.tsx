"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { FormEvent } from "react";

import { Avatar, Dialog, VisuallyHidden } from "@/shared/ui";
import { cn } from "@/shared/lib";

import { CHIPS, useAssistant } from "../model";
import type { Message } from "../model";

function ResetIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-4.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 12a9 9 0 1 0 3-6.7L3 8" />
      <path d="M3 3v5h5" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 19V5" />
      <path d="m5 12 7-7 7 7" />
    </svg>
  );
}

function Bubble({ message }: { message: Message }) {
  const bot = message.from === "bot";
  return (
    <li
      className={cn(
        "max-w-4/5 rounded-2xl px-3.5 py-2.5 text-ui",
        bot
          ? "self-start rounded-bl-sm bg-surface-3 text-fg"
          : "self-end rounded-br-sm bg-fg text-bg",
      )}
    >
      <VisuallyHidden>{bot ? "Assistant: " : "You: "}</VisuallyHidden>
      {message.text}
    </li>
  );
}

function TypingBubble() {
  return (
    <li className="flex gap-1.25 self-start rounded-2xl rounded-bl-sm bg-surface-3 px-4 py-3.5">
      <VisuallyHidden>Assistant is typing</VisuallyHidden>
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          aria-hidden="true"
          className="size-1.5 rounded-full bg-muted motion-safe:animate-bop"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </li>
  );
}

/**
 * The assistant panel: header, conversation, quick replies and the message form, in the shared
 * `Dialog` (focus trap, Escape, focus return). Announcements go through the launcher's live region,
 * which stays mounted while this panel is closed.
 */
export function AssistantPanel() {
  const { state, close, ask, reset } = useAssistant();
  const [draft, setDraft] = useState("");
  const titleId = useId();
  const log = useRef<HTMLOListElement>(null);
  const { messages, typing } = state;

  // Keep the newest message in view. A reply replaces the typing bubble, so the bubble count can
  // stay the same while the list grows: scroll on every change to the conversation, not the count.
  // `motion-safe:scroll-smooth` on the list makes this jump instantly under reduced motion.
  useEffect(() => {
    const list = log.current;
    if (!list || !state.open || (messages.length === 0 && !typing)) return;
    list.scrollTop = list.scrollHeight;
  }, [messages, typing, state.open]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || typing) return;
    ask({ kind: "text", text }, text);
    setDraft("");
  }

  return (
    <Dialog
      open={state.open}
      onClose={close}
      aria-labelledby={titleId}
      className="pointer-events-auto relative m-0 flex h-130 min-h-0 w-full flex-col overflow-hidden rounded-panel border border-surface-7 bg-bg p-0 text-fg motion-safe:animate-pop md:w-95"
    >
      <div className="flex items-center gap-3 border-b border-line p-4">
        <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-fg">
          <Avatar size={36} variant="chat" />
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <h2 id={titleId} className="text-body font-medium">
            Johnny&rsquo;s assistant
          </h2>
          <span className="flex items-center gap-1.5 text-meta text-muted">
            <span aria-hidden="true" className="size-1.5 rounded-full bg-accent" />
            AI · answers about my work
          </span>
        </span>
        <button
          type="button"
          aria-label="Reset conversation"
          onClick={reset}
          className="flex size-11 shrink-0 items-center justify-center rounded-full border border-surface-7 text-secondary transition-colors hover:border-line-hover hover:text-fg"
        >
          <ResetIcon />
        </button>
      </div>

      <ol
        ref={log}
        aria-label="Conversation"
        // oxlint-disable-next-line jsx-a11y/no-noninteractive-tabindex -- a scrollable region must be focusable so keyboard users can scroll it (axe scrollable-region-focusable)
        tabIndex={0}
        className="flex min-h-0 flex-1 flex-col gap-2.5 overflow-auto p-4 motion-safe:scroll-smooth"
      >
        {messages.map((message) => (
          <Bubble key={message.id} message={message} />
        ))}
        {typing ? <TypingBubble /> : null}
      </ol>

      <div className="flex flex-wrap gap-2 px-4 pb-3">
        {CHIPS.map((chip) => (
          <button
            key={chip.id}
            type="button"
            onClick={() => ask({ kind: "chip", chip: chip.id }, chip.label)}
            className="h-9 rounded-full border border-surface-7 px-3.5 text-small text-fg transition-colors hover:bg-surface-3"
          >
            {chip.label}
          </button>
        ))}
      </div>

      <form onSubmit={onSubmit} className="flex gap-2 border-t border-line px-4 pt-3 pb-4">
        <label className="flex flex-1">
          <VisuallyHidden>Message</VisuallyHidden>
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Ask about my work"
            autoComplete="off"
            className="h-11 w-full flex-1 rounded-full border border-surface-7 bg-surface-2 px-4 text-ui text-fg placeholder:text-muted"
          />
        </label>
        <button
          type="submit"
          aria-label="Send"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-accent text-bg transition-colors hover:bg-fg"
        >
          <SendIcon />
        </button>
      </form>
    </Dialog>
  );
}
