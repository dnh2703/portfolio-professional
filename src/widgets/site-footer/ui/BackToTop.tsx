"use client";

import type { MouseEvent } from "react";

import { cn } from "@/shared/lib";

/** Id of the first section on the page (the hero). */
const TARGET_ID = "top";

export type BackToTopProps = {
  className?: string;
};

/**
 * "Back to top ↑". Scrolls to the top (smoothly unless the visitor prefers reduced motion) and
 * moves focus to the first section, so the next Tab continues from there. Without JavaScript it is
 * a plain `#top` link.
 */
export function BackToTop({ className }: BackToTopProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    const target = document.getElementById(TARGET_ID);
    if (!target) return;
    event.preventDefault();

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
    if (!target.hasAttribute("tabindex")) target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }

  return (
    <a
      href={`#${TARGET_ID}`}
      onClick={handleClick}
      className={cn(
        "rounded-sm text-small text-fg uppercase transition-colors hover:text-accent",
        className,
      )}
    >
      Back to top <span aria-hidden="true">↑</span>
    </a>
  );
}
