import { describe, expect, it } from "vitest";

import { formatProjectIndex, formatProjectMeta, formatProjectYears } from "./format-project";

describe("formatProjectYears", () => {
  it("shows a single year on its own", () => {
    expect(formatProjectYears({ start: 2026 })).toBe("2026");
    expect(formatProjectYears({ start: 2026, end: 2026 })).toBe("2026");
  });

  it("shortens the end year of a range with an en dash", () => {
    expect(formatProjectYears({ start: 2025, end: 2026 })).toBe("2025–26");
    expect(formatProjectYears({ start: 2023, end: 2025 })).toBe("2023–25");
  });

  it("keeps the full end year across a century", () => {
    expect(formatProjectYears({ start: 1999, end: 2001 })).toBe("1999–2001");
  });
});

describe("formatProjectMeta", () => {
  it("joins the context and years with a middle dot", () => {
    expect(formatProjectMeta({ context: "VMO", years: { start: 2023, end: 2025 } })).toBe(
      "VMO · 2023–25",
    );
  });
});

describe("formatProjectIndex", () => {
  it("pads to two digits", () => {
    expect(formatProjectIndex(1)).toBe("01");
    expect(formatProjectIndex(12)).toBe("12");
  });
});
