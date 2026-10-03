"use client";

import { useState } from "react";
import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

export type MarqueeProps = {
  /** Accessible name of the scrolling list, e.g. "Tech stack". Also names the pause button. */
  label: string;
  /** The items, each a `<li>`. */
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
};

/**
 * Endlessly scrolling row of items. Pauses on hover and keyboard focus, and has a Pause/Play
 * button. With `prefers-reduced-motion` it doesn't move: the items wrap as a static list and the
 * button is hidden. The second copy of the items that makes the loop seamless is `inert`.
 */
export function Marquee({ label, children, duration = 40, className }: MarqueeProps) {
  const [paused, setPaused] = useState(false);
  const listClassName =
    "flex shrink-0 items-center gap-x-8 pe-8 motion-reduce:flex-wrap motion-reduce:gap-y-2";

  return (
    <div className={cn("flex items-center gap-4", className)}>
      <div className="group min-w-0 flex-1 overflow-hidden">
        <div
          className="flex w-max motion-safe:animate-marquee group-hover:paused group-focus-within:paused motion-reduce:w-auto"
          // Inline so it wins over the `animation` shorthand of `animate-marquee`.
          style={{
            animationDuration: `${duration}s`,
            animationPlayState: paused ? "paused" : undefined,
          }}
        >
          <ul aria-label={label} className={listClassName}>
            {children}
          </ul>
          <ul inert aria-hidden="true" className={cn(listClassName, "motion-reduce:hidden")}>
            {children}
          </ul>
        </div>
      </div>
      <button
        type="button"
        aria-label={`${paused ? "Play" : "Pause"} ${label}`}
        onClick={() => setPaused(!paused)}
        className="shrink-0 rounded-full border border-line-strong px-3 py-1 font-mono text-meta text-secondary uppercase transition-colors hover:border-line-hover hover:text-fg motion-reduce:hidden"
      >
        {paused ? "Play" : "Pause"}
      </button>
    </div>
  );
}
