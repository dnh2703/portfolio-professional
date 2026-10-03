"use client";

import type { ReactNode } from "react";

import { getProject } from "@/entities/project";
import { Button, VisuallyHidden } from "@/shared/ui";

import { useAssistant } from "../model";

export type AskAboutProjectProps = {
  /** A project id from `entities/project`, e.g. `"p01"`. */
  projectId: string;
  /** Visible label. */
  children?: ReactNode;
  className?: string;
};

/**
 * "Ask about this project" trigger for a project card: opens the assistant and asks about the
 * project. The project name is added for screen readers so the five triggers are distinct.
 */
export function AskAboutProject({
  projectId,
  children = "Ask about this project",
  className,
}: AskAboutProjectProps) {
  const { askAboutProject } = useAssistant();
  const project = getProject(projectId);
  if (!project) return null;

  return (
    <Button
      variant="secondary"
      size="sm"
      aria-haspopup="dialog"
      className={className}
      onClick={() => askAboutProject(projectId)}
    >
      {children} <VisuallyHidden>({project.name})</VisuallyHidden>
    </Button>
  );
}
