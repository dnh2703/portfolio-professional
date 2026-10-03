import { describe, expect, it } from "vitest";

import { formatLocalTime } from "./format-local-time";

describe("formatLocalTime", () => {
  const instant = new Date("2026-01-15T20:05:00Z");

  it("formats the time in the given time zone", () => {
    expect(formatLocalTime(instant, "Asia/Ho_Chi_Minh")).toBe("03:05");
  });

  it("uses a 24-hour clock", () => {
    expect(formatLocalTime(instant, "UTC")).toBe("20:05");
  });
});
