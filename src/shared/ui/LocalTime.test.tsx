import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { LocalTime } from "./LocalTime";

// 03:05 in Hanoi (GMT+7).
const start = new Date("2026-01-15T20:05:00Z");

describe("LocalTime", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(start);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the time in the site time zone with its label", () => {
    render(<LocalTime initialTime={start.getTime()} />);

    expect(screen.getByText("03:05 GMT+7")).toHaveAttribute("datetime", "03:05");
  });

  it("catches up to the current time after mounting", () => {
    // Rendered at build time, hours earlier.
    render(<LocalTime initialTime={start.getTime() - 3 * 60 * 60 * 1000} />);

    expect(screen.getByText("03:05 GMT+7")).toBeInTheDocument();
  });

  it("updates every 15 seconds", () => {
    render(<LocalTime initialTime={start.getTime()} label="" />);
    expect(screen.getByText("03:05")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(45_000);
    });
    expect(screen.getByText("03:05")).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(15_000);
    });
    expect(screen.getByText("03:06")).toBeInTheDocument();
  });

  it("stops ticking when unmounted", () => {
    const { unmount } = render(<LocalTime initialTime={start.getTime()} />);
    unmount();

    expect(vi.getTimerCount()).toBe(0);
  });
});
