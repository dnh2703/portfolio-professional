import type { ComponentProps } from "react";

import { cn } from "@/shared/lib";

/** Hides content visually but keeps it for screen readers, e.g. extra context on an icon link. */
export function VisuallyHidden({ className, ...props }: ComponentProps<"span">) {
  return <span className={cn("sr-only", className)} {...props} />;
}
