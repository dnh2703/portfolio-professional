import type { Education } from "../model";

/** The one-line mobile form: `"PTIT · Multimedia"` (falls back to the full institution name). */
export function formatEducationShort({ institution, shortLabel, program }: Education): string {
  return `${shortLabel ?? institution} · ${program}`;
}
