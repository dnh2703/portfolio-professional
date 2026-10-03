import type { ComponentProps } from "react";

import { cn } from "@/shared/lib";

/**
 * A home-page section: full-bleed 1px top border, side gutter and section padding (20/56px on
 * mobile, 64/120px from md), with the content capped at `max-w-page`. Lay the content out with
 * the `page-grid` utility. Give it an accessible name with `aria-labelledby` pointing at its heading.
 */
export function Section({ className, children, ...props }: ComponentProps<"section">) {
  return (
    <section className={cn("border-t border-line px-gutter py-section", className)} {...props}>
      <div className="mx-auto max-w-page">{children}</div>
    </section>
  );
}
