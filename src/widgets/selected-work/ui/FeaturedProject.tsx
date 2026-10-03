import type { ReactNode } from "react";

import { formatProjectIndex, formatProjectMeta, type Project } from "@/entities/project";
import { cn } from "@/shared/lib";

type FeaturedProjectProps = {
  project: Project;
  /** Id for the name, so the card's action can point at it with `aria-describedby`. */
  nameId: string;
  /** Decorative mock-up shown in the preview box. */
  preview: ReactNode;
  /**
   * `dark`: surface box with a border on desktop (accent on mobile). `accent`: orange box on
   * every viewport.
   */
  tone: "dark" | "accent";
  /** Stretched over the whole card, so the card works as one button. */
  action: ReactNode;
  className?: string;
};

/** Large card with a preview, used for the first projects (two on desktop, one on mobile). */
export function FeaturedProject({
  project,
  nameId,
  preview,
  tone,
  action,
  className,
}: FeaturedProjectProps) {
  return (
    <li className={cn("relative flex-col gap-3.5 md:gap-5", className)}>
      <div
        aria-hidden="true"
        className={cn(
          "relative flex h-75 items-center justify-center overflow-hidden rounded-tile bg-accent md:h-140 md:rounded-3xl",
          tone === "dark" && "md:border md:border-line md:bg-surface-2",
        )}
      >
        {preview}
        <span
          className={cn(
            "absolute top-6 left-6 hidden text-caption md:block",
            tone === "dark" ? "text-muted" : "text-bg",
          )}
        >
          {formatProjectIndex(project.index)}
        </span>
      </div>
      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1 md:gap-1.5">
          <h3 id={nameId} className="text-h4 font-medium md:text-h2">
            <span className="md:hidden">{project.shortName ?? project.name}</span>
            <span className="hidden md:inline">{project.name}</span>
          </h3>
          <p className="text-body text-muted md:text-body-lg">
            <span className="md:hidden">{project.shortDescription}</span>
            <span className="hidden md:inline">{project.description}</span>
          </p>
        </div>
        <span className="hidden shrink-0 rounded-full border border-surface-7 px-3 py-2 text-caption text-muted uppercase md:block">
          {formatProjectMeta(project)}
        </span>
      </div>
      <div className="absolute inset-0 *:size-full *:rounded-tile md:*:rounded-3xl">{action}</div>
    </li>
  );
}
