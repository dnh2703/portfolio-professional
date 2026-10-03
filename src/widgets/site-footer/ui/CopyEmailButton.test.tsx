import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { CopyEmailButton } from "./CopyEmailButton";

const email = "dnh2703@gmail.com";

function mockClipboard(writeText: (text: string) => Promise<void>) {
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
}

async function click(button: HTMLElement) {
  await act(async () => {
    fireEvent.click(button);
  });
}

describe("CopyEmailButton", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    Object.defineProperty(navigator, "clipboard", { value: undefined, configurable: true });
  });

  it("copies the email, shows Copied and announces it", async () => {
    const writeText = vi.fn(() => Promise.resolve());
    mockClipboard(writeText);
    render(<CopyEmailButton email={email} />);
    expect(screen.getByRole("status")).toBeEmptyDOMElement();

    await click(screen.getByRole("button", { name: "Copy email" }));

    expect(writeText).toHaveBeenCalledWith(email);
    expect(screen.getByRole("button")).toHaveAccessibleName("Copied");
    expect(screen.getByRole("status")).toHaveTextContent("Email address copied to the clipboard.");
  });

  it("resets the label after two seconds", async () => {
    mockClipboard(() => Promise.resolve());
    render(<CopyEmailButton email={email} />);

    await click(screen.getByRole("button", { name: "Copy email" }));
    act(() => {
      vi.advanceTimersByTime(2_000);
    });

    expect(screen.getByRole("button")).toHaveAccessibleName("Copy email");
    expect(screen.getByRole("status")).toBeEmptyDOMElement();
  });

  it("reports a failure when the clipboard refuses", async () => {
    mockClipboard(() => Promise.reject(new Error("NotAllowedError")));
    render(<CopyEmailButton email={email} />);

    await click(screen.getByRole("button", { name: "Copy email" }));

    expect(screen.getByRole("button")).toHaveAccessibleName("Copy failed");
    expect(screen.getByRole("status")).toHaveTextContent(
      `Couldn't copy the email address. It is ${email}.`,
    );
  });

  it("reports a failure when the Clipboard API is missing", async () => {
    render(<CopyEmailButton email={email} />);

    await click(screen.getByRole("button", { name: "Copy email" }));

    expect(screen.getByRole("button")).toHaveAccessibleName("Copy failed");
  });
});
