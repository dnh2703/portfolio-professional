"use client";

import { useEffect, useEffectEvent, useRef } from "react";
import type { ReactNode } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(",");

function focusableIn(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE));
}

/** Keeps Tab and Shift+Tab cycling inside `container`. */
function trapTab(event: KeyboardEvent, container: HTMLElement) {
  const items = focusableIn(container);
  const first = items[0];
  const last = items.at(-1);
  if (!first || !last) {
    event.preventDefault();
    container.focus();
    return;
  }
  const active = document.activeElement;
  const outside = !container.contains(active);
  if (event.shiftKey && (outside || active === first || active === container)) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && (outside || active === last)) {
    event.preventDefault();
    first.focus();
  }
}

export type DialogProps = {
  open: boolean;
  /** Called on Escape. The parent sets `open` to false. */
  onClose: () => void;
  children: ReactNode;
  /** Positioning and surface styles; the base has none so the assistant can sit anywhere. */
  className?: string;
} & ({ "aria-label": string } | { "aria-labelledby": string });

/**
 * Modal dialog base (controlled), rendered as `<dialog open aria-modal="true">`. While open, focus
 * moves to the first focusable element inside, Tab is trapped, and Escape calls `onClose`. When it
 * closes, focus returns to the element that had it before (the launcher). Renders nothing when
 * closed.
 */
export function Dialog({ open, onClose, children, className, ...labelProps }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null);

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    const container = ref.current;
    if (!container) return;
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
    } else if (event.key === "Tab") {
      trapTab(event, container);
    }
  });

  useEffect(() => {
    if (!open) return undefined;
    const previous = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const container = ref.current;
    if (container) (focusableIn(container)[0] ?? container).focus();
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previous?.focus();
    };
  }, [open]);

  if (!open) return null;

  return (
    // `open` shows it in place, without the native modal behaviour: the trap and Escape are handled
    // here so the panel can be positioned freely and behaves the same in jsdom tests.
    <dialog ref={ref} open aria-modal="true" tabIndex={-1} className={className} {...labelProps}>
      {children}
    </dialog>
  );
}
