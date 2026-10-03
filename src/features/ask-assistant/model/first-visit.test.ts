import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { dismissFirstVisitPill, resetFirstVisitPill, useFirstVisitPill } from "./first-visit";

describe("useFirstVisitPill", () => {
  afterEach(() => {
    resetFirstVisitPill();
  });

  it("shows the pill until it is dismissed, and remembers the dismissal", () => {
    const { result } = renderHook(() => useFirstVisitPill());
    expect(result.current).toBe(true);

    act(() => dismissFirstVisitPill());
    expect(result.current).toBe(false);
    expect(window.localStorage.getItem("ask-assistant:pill-dismissed")).toBe("1");
  });

  it("stays hidden when a previous visit dismissed it", () => {
    window.localStorage.setItem("ask-assistant:pill-dismissed", "1");
    const { result } = renderHook(() => useFirstVisitPill());
    expect(result.current).toBe(false);
  });
});
