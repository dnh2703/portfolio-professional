import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

type GroupHeadingProps = {
  children: ReactNode;
  className?: string;
};

/** The small uppercase label above each group ("Experience", "How I work", ...). */
export function GroupHeading({ children, className }: GroupHeadingProps) {
  return (
    <h3 className={cn("text-caption font-normal text-muted uppercase", className)}>{children}</h3>
  );
}
