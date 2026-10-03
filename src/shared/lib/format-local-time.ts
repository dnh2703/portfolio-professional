/**
 * Formats `date` as a 24-hour `HH:mm` clock time in the given IANA time zone.
 */
export function formatLocalTime(date: Date, timeZone: string): string {
  return new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    timeZone,
  }).format(date);
}
