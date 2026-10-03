import type { Period, YearMonth } from "../model";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** `{ year: 2025, month: 10 }` → `"Oct 2025"`. Locale- and time-zone-independent. */
export function formatYearMonth({ year, month }: YearMonth): string {
  const name = MONTHS[month - 1];
  if (name === undefined) throw new RangeError(`month must be 1–12, got ${month}`);
  return `${name} ${year}`;
}

/** `"Dec 2023 – Oct 2025"`, or `"Oct 2025 – Now"` while there is no end. */
export function formatPeriod({ start, end }: Period): string {
  return `${formatYearMonth(start)} – ${end ? formatYearMonth(end) : "Now"}`;
}
