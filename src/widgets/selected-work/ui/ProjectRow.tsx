import type { ReactNode } from "react";

import { formatProjectIndex, formatProjectMeta, type Project } from "@/entities/project";
import { cn } from "@/shared/lib";

type ProjectRowProps = {
  project: Project;
  /** Id for the name, so the row's action can point at it with `aria-describedby`. */
  nameId: string;
  /** Stretched over the whole row, so the row works as one button. */
  action: ReactNode;
  className?: string;
};

/**
 * One line of the project list: number, name, line, meta (desktop only) and "→". Mobile stacks
 * `shortName ?? name` over `shortDescription`.
 */
export function ProjectRow({ project, nameId, action, className }: ProjectRowProps) {
  return (
    <li
      className={cn(
        "relative min-h-19 items-center gap-3.5 border-b border-line md:min-h-28 md:gap-0",
        className,
      )}
    >
      <span aria-hidden="true" className="w-5 shrink-0 text-meta text-muted md:w-20 md:text-small">
        {formatProjectIndex(project.index)}
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5 md:contents">
        <h3
          id={nameId}
          className="text-list-title font-medium md:min-w-0 md:flex-5 md:pe-6 md:text-h1"
        >
          <span className="md:hidden">{project.shortName ?? project.name}</span>
          <span className="hidden md:inline">{project.name}</span>
        </h3>
        <p className="text-small text-muted md:min-w-0 md:flex-6 md:pe-6 md:text-body-lg">
          <span className="md:hidden">{project.shortDescription}</span>
          <span className="hidden md:inline">{project.description}</span>
        </p>
      </div>
      <span className="hidden w-50 shrink-0 text-caption text-muted uppercase md:block">
        {formatProjectMeta(project)}
      </span>
      <span
        aria-hidden="true"
        className="text-list-title md:w-12 md:shrink-0 md:text-end md:text-h2"
      >
        →
      </span>
      <div className="absolute inset-0 *:size-full">{action}</div>
    </li>
  );
}
