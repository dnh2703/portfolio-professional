import { describe, expect, it } from "vitest";

import { experience } from "../model";
import { formatPeriod, formatYearMonth } from "./format-period";

describe("formatYearMonth", () => {
  it("uses the short English month name", () => {
    expect(formatYearMonth({ year: 2025, month: 1 })).toBe("Jan 2025");
    expect(formatYearMonth({ year: 2023, month: 12 })).toBe("Dec 2023");
  });

  it("rejects a month outside 1–12", () => {
    expect(() => formatYearMonth({ year: 2025, month: 13 })).toThrow(RangeError);
    expect(() => formatYearMonth({ year: 2025, month: 0 })).toThrow(RangeError);
  });
});

describe("formatPeriod", () => {
  it("formats the experience periods as in the design", () => {
    expect(experience.map((item) => formatPeriod(item.period))).toEqual([
      "Oct 2025 – Now",
      "Dec 2023 – Oct 2025",
    ]);
  });
});
