import { describe, expect, it } from "vitest";

import { cn } from "./cn";

describe("cn", () => {
  it("joins class names with a space", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("skips falsy values", () => {
    const off = false;
    expect(cn("a", off && "b", null, undefined, "", "c")).toBe("a c");
  });
});
