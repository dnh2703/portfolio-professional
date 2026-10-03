"use client";

import { useEffect } from "react";

import { cn } from "@/shared/lib";

import { dismissFirstVisitPill, useAssistant, useFirstVisitPill } from "../model";
import { AssistantPanel } from "./AssistantPanel";
import { LauncherAvatar } from "./LauncherAvatar";

function CloseIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className="size-5 md:size-6"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function launcherLabel(open: boolean, unread: number): string {
  if (open) return "Close chat";
  const base = "Open chat with Johnny’s assistant";
  return unread > 0 ? `${base}, ${unread} unread` : base;
}

/** What the polite live region says: typing, then the latest reply (not the greeting). */
function announcement(typing: boolean, messages: readonly { from: string; text: string }[]) {
  if (typing) return "Johnny’s assistant is typing";
  const last = messages.at(-1);
  return messages.length > 1 && last?.from === "bot" ? last.text : "";
}

/**
 * The fixed chat launcher (bottom right) with its first-visit pill, the assistant panel above it
 * and a polite live region that stays mounted. Needs `AssistantProvider` above it.
 */
export function AssistantLauncher() {
  const { state, toggle } = useAssistant();
  const { open, typing, unread, messages } = state;
  const showPill = useFirstVisitPill() && !open;

  useEffect(() => {
    if (open) dismissFirstVisitPill();
  }, [open]);

  return (
    <div className="pointer-events-none fixed inset-4 z-50 flex flex-col items-end justify-end gap-4 md:inset-6">
      <output aria-live="polite" className="sr-only">
        {announcement(typing, messages)}
      </output>
      <AssistantPanel />
      <div className="flex items-center gap-3">
        {showPill ? (
          <span
            aria-hidden="true"
            className="pointer-events-auto flex h-10 items-center rounded-full bg-fg px-4 text-ui font-medium text-bg"
          >
            Ask me anything
          </span>
        ) : null}
        <button
          type="button"
          aria-label={launcherLabel(open, unread)}
          aria-expanded={open}
          aria-haspopup="dialog"
          onClick={toggle}
          className={cn(
            // 40 / 48 px, smaller than the header logo; the ::before keeps a 44 px tap target on mobile.
            "pointer-events-auto relative size-10 shrink-0 rounded-full shadow-launcher before:absolute before:-inset-0.5 before:content-[''] md:size-12",
            unread > 0 && !open && "motion-safe:animate-ring",
          )}
        >
          {open ? (
            <span className="flex size-10 items-center justify-center rounded-full bg-accent text-bg md:size-12">
              <CloseIcon />
            </span>
          ) : (
            <LauncherAvatar typing={typing} unread={unread} />
          )}
        </button>
      </div>
    </div>
  );
}
