import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

export type MarqueeProps = {
  /** Accessible name of the scrolling list, e.g. "Tech stack". */
  label: string;
  /** The items, each a `<li>`. */
  children: ReactNode;
  /** Seconds for one full loop. */
  duration?: number;
  className?: string;
};

/**
 * Endlessly scrolling row of items. Pauses on hover and keyboard focus. With
 * `prefers-reduced-motion` it doesn't move: the items wrap as a static list. The second copy of
 * the items that makes the loop seamless is `inert`.
 */
export function Marquee({ label, children, duration = 40, className }: MarqueeProps) {
  const listClassName =
    "flex shrink-0 items-center gap-x-8 pe-8 motion-reduce:flex-wrap motion-reduce:gap-y-2";

  return (
    <div className={cn("group min-w-0 overflow-hidden", className)}>
      <div
        className="flex w-max motion-safe:animate-marquee group-hover:paused group-focus-within:paused motion-reduce:w-auto"
        // Inline so it wins over the `animation` shorthand of `animate-marquee`.
        style={{ animationDuration: `${duration}s` }}
      >
        <ul aria-label={label} className={listClassName}>
          {children}
        </ul>
        <ul inert aria-hidden="true" className={cn(listClassName, "motion-reduce:hidden")}>
          {children}
        </ul>
      </div>
    </div>
  );
}
