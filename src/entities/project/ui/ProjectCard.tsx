import type { ReactNode } from "react";

import { cn } from "@/shared/lib";

import { formatProjectIndex, formatProjectMeta } from "../lib";
import type { Project } from "../model";

export type ProjectCardProps = {
  project: Project;
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
 * Display-only project card: number, name, one-line description (a shorter line on mobile) and
 * the `Employer · years` meta. A Server Component; interactive parts come in through `action`
 * and `preview`. Named by its `h3`, so place it under a section `h2`.
 */
export function ProjectCard({ project, action, preview, className }: ProjectCardProps) {
  const headingId = `project-${project.id}-title`;

  return (
    <article
      aria-labelledby={headingId}
      className={cn(
        "flex flex-col gap-4 rounded-2xl border border-line bg-surface-1 p-5 md:p-6",
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-4 font-mono text-meta tracking-wide text-muted uppercase">
        <span aria-hidden="true">{formatProjectIndex(project.index)}</span>
        <span>{formatProjectMeta(project)}</span>
      </div>
      <div className="flex flex-col gap-1">
        <h3 id={headingId} className="text-title font-medium text-fg">
          {project.name}
        </h3>
        <p className="text-small text-secondary">
          <span className="md:hidden">{project.shortDescription}</span>
          <span className="hidden md:inline">{project.description}</span>
        </p>
      </div>
      {preview}
      {action ? <div className="mt-auto flex">{action}</div> : null}
    </article>
  );
}
