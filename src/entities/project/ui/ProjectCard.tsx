import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

import { formatProjectIndex, formatProjectMeta } from "../lib";
import type { Project } from "../model";

export type ProjectCardProps = {
  project: Project;
  /**
   * Mobile layout (desktop is the same for both): `feature` shows only the name and the short
   * line (cards 01–02); `row` adds the number in front and a "→" after (cards 03–05).
   */
  mobileVariant?: "feature" | "row";
  /**
   * Control at the end of the card, e.g. the "Ask about this project" trigger from
   * `features/ask-assistant`. Entities can't import features, so the widget passes it in.
   */
  action?: ReactNode;
  /** Optional visual under the text, e.g. an interactive demo. */
  preview?: ReactNode;
  className?: string;
};

/**
 * Display-only project card. Desktop: number, `Employer · years` meta, name and description.
 * Mobile: `shortName ?? name` and `shortDescription` (which carries the meta), plus the number
 * and an arrow in the `row` variant. A Server Component; interactive parts come in through
 * `action` and `preview`. Named by its `h3`, so place it under a section `h2`.
 */
export function ProjectCard({
  project,
  mobileVariant = "feature",
  action,
  preview,
  className,
}: ProjectCardProps) {
  const headingId = `project-${project.id}-title`;
  const row = mobileVariant === "row";
  const index = formatProjectIndex(project.index);

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-line bg-surface-1 p-5 md:p-6",
        className,
      )}
    >
      <div className="hidden items-baseline justify-between gap-4 font-mono text-meta tracking-wide text-muted uppercase md:flex">
        <span aria-hidden="true">{index}</span>
        <span>{formatProjectMeta(project)}</span>
      </div>
      <div className="flex items-start gap-3">
        {row ? (
          <span
            aria-hidden="true"
            className="pt-1 font-mono text-meta tracking-wide text-muted md:hidden"
          >
            {index}
          </span>
        ) : null}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h3 id={headingId} className="text-title font-medium text-fg">
            <span className="md:hidden">{project.shortName ?? project.name}</span>
            <span className="hidden md:inline">{project.name}</span>
          </h3>
          <p className="text-small text-secondary">
            <span className="md:hidden">{project.shortDescription}</span>
            <span className="hidden md:inline">{project.description}</span>
          </p>
        </div>
        {row ? (
          <span aria-hidden="true" className="text-title text-muted md:hidden">
            →
          </span>
        ) : null}
      </div>
      {preview}
      {action ? <div className="mt-auto flex">{action}</div> : null}
    </article>
  );
}
