import { useSyncExternalStore } from "react";

const STORAGE_KEY = "ask-assistant:pill-dismissed";
const listeners = new Set<() => void>();
/** Fallback when storage is blocked: the pill stays dismissed for this page view. */
let dismissedInMemory = false;

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

function isDismissed(): boolean {
  if (dismissedInMemory) return true;
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "1";
  } catch {
    return false;
  }
}

/** Remembers that the visitor has opened the assistant, so the first-visit pill stays hidden. */
export function dismissFirstVisitPill() {
  if (isDismissed()) return;
  dismissedInMemory = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, "1");
  } catch {
    // Storage blocked (private mode): the in-memory flag still hides the pill on this page.
  }
  for (const listener of listeners) listener();
}

/** Test helper: forget the dismissal. */
export function resetFirstVisitPill() {
  dismissedInMemory = false;
  window.localStorage.removeItem(STORAGE_KEY);
  for (const listener of listeners) listener();
}

/**
 * Whether to show the "Ask me anything" pill: only until the visitor first opens the assistant.
 * Hidden on the server and during hydration, so the markup always matches.
 */
export function useFirstVisitPill(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => !isDismissed(),
    () => false,
  );
}
