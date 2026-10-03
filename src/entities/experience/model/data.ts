import type { Education, Experience } from "./types";

/** Work history, most recent first. */
export const experience = [
  {
    id: "eastgate",
    company: "Eastgate Software",
    role: "Frontend / Fullstack Developer",
    period: { start: { year: 2025, month: 10 } },
  },
  {
    id: "vmo",
    company: "VMO Holdings",
    role: "Frontend Developer",
    period: { start: { year: 2023, month: 12 }, end: { year: 2025, month: 10 } },
  },
] as const satisfies readonly Experience[];

/** Degrees and courses, in display order. */
export const education = [
  { id: "ptit", institution: "PTIT", program: "Multimedia" },
  {
    id: "fpt-software-academy",
    institution: "FPT Software Academy",
    program: "ReactJS Frontend Developer Program",
  },
  { id: "cs50", institution: "CS50, Harvard", program: "Introduction to Computer Science" },
] as const satisfies readonly Education[];
