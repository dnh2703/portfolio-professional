import { fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";

import { Dialog } from "./Dialog";

function Demo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open assistant
      </button>
      <Dialog open={open} onClose={() => setOpen(false)} aria-label="Assistant">
        <input aria-label="Message" />
        <button type="button">Send</button>
      </Dialog>
    </>
  );
}

function openDemo() {
  render(<Demo />);
  const trigger = screen.getByRole("button", { name: "Open assistant" });
  trigger.focus();
  fireEvent.click(trigger);
  return trigger;
}

describe("Dialog", () => {
  it("renders nothing when closed", () => {
    render(<Demo />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("is a named modal dialog and focuses its first control", () => {
    openDemo();

    const dialog = screen.getByRole("dialog", { name: "Assistant" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveFocus();
  });

  it("traps Tab and Shift+Tab inside", () => {
    openDemo();
    const input = screen.getByRole("textbox", { name: "Message" });
    const send = screen.getByRole("button", { name: "Send" });

    send.focus();
    fireEvent.keyDown(document, { key: "Tab" });
    expect(input).toHaveFocus();

    fireEvent.keyDown(document, { key: "Tab", shiftKey: true });
    expect(send).toHaveFocus();
  });

  it("closes on Escape and returns focus to the trigger", () => {
    const trigger = openDemo();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });

  it("does not re-run focus handling when onClose changes identity", () => {
    const { rerender } = render(
      <Dialog open onClose={vi.fn()} aria-label="Assistant">
        <button type="button">First</button>
        <button type="button">Second</button>
      </Dialog>,
    );
    const second = screen.getByRole("button", { name: "Second" });
    second.focus();

    const onClose = vi.fn();
    rerender(
      <Dialog open onClose={onClose} aria-label="Assistant">
        <button type="button">First</button>
        <button type="button">Second</button>
      </Dialog>,
    );
    expect(second).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
