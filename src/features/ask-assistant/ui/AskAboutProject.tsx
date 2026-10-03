"use client";

import type { ComponentProps } from "react";

import { useAssistant } from "../model";

export type AskAboutProjectProps = Omit<ComponentProps<"button">, "type" | "onClick"> & {
  /** A project id from `entities/project`, e.g. `"p01"`. */
  projectId: string;
};

/**
 * "Ask about this project" trigger: an unstyled `<button>` that opens the assistant and asks about
 * the project. The caller gives it an accessible name and its look (project cards stretch it over
 * the whole card).
 */
export function AskAboutProject({ projectId, ...props }: AskAboutProjectProps) {
  const { askAboutProject } = useAssistant();
  return (
    <button
      type="button"
      aria-haspopup="dialog"
      {...props}
      onClick={() => askAboutProject(projectId)}
    />
  );
}
