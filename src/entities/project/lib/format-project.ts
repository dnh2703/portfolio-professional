import type { Project, ProjectYears } from "../model";

/** `{ start: 2025, end: 2026 }` → `"2025–26"`; a single year → `"2026"`. */
export function formatProjectYears({ start, end }: ProjectYears): string {
  if (end === undefined || end === start) return String(start);
  const sameCentury = Math.floor(start / 100) === Math.floor(end / 100);
  return `${start}–${sameCentury ? String(end).slice(-2) : end}`;
}

/** The meta line under a project, e.g. `"Eastgate · 2026"` or `"VMO · 2023–25"`. */
export function formatProjectMeta(project: Pick<Project, "context" | "years">): string {
  return `${project.context} · ${formatProjectYears(project.years)}`;
}

/** The list number, zero-padded to two digits: `1` → `"01"`. */
export function formatProjectIndex(index: number): string {
  return String(index).padStart(2, "0");
}
