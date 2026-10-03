import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { REPLY_DELAY_MS } from "../api";
import { AssistantProvider, CHIP_ANSWERS, resetFirstVisitPill } from "../model";
import { AssistantLauncher } from "./AssistantLauncher";

const OPEN = "Open chat with Johnny’s assistant";

function renderLauncher() {
  render(<AssistantLauncher />, { wrapper: AssistantProvider });
  return screen.getByRole("button", { name: OPEN });
}

async function finishTyping() {
  await act(async () => {
    await vi.advanceTimersByTimeAsync(REPLY_DELAY_MS);
  });
}

describe("AssistantLauncher", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
    resetFirstVisitPill();
  });

  it("opens the named panel and becomes a close button", () => {
    const launcher = renderLauncher();
    expect(launcher).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(launcher);
    const dialog = screen.getByRole("dialog", { name: "Johnny’s assistant" });
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(launcher).toHaveAccessibleName("Close chat");
    expect(launcher).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(launcher);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes on Escape and returns focus to the launcher", () => {
    const launcher = renderLauncher();
    launcher.focus();
    fireEvent.click(launcher);
    expect(screen.getByRole("button", { name: "Reset conversation" })).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(launcher).toHaveFocus();
  });

  it("answers a chip after the typing state and announces it", async () => {
    fireEvent.click(renderLauncher());
    fireEvent.click(screen.getByRole("button", { name: "What do you build?" }));

    expect(screen.getByRole("status")).toHaveTextContent("Johnny’s assistant is typing");
    expect(screen.queryByText(CHIP_ANSWERS.build)).not.toBeInTheDocument();

    await finishTyping();
    const log = screen.getByRole("list", { name: "Conversation" });
    expect(log).toHaveTextContent("What do you build?");
    expect(log).toHaveTextContent(CHIP_ANSWERS.build);
    expect(screen.getByRole("status")).toHaveTextContent(CHIP_ANSWERS.build);
  });

  it("sends free text from the message field", async () => {
    fireEvent.click(renderLauncher());
    const input = screen.getByRole("textbox", { name: "Message" });
    fireEvent.change(input, { target: { value: "Are you available?" } });
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(input).toHaveValue("");

    await finishTyping();
    expect(screen.getByRole("list", { name: "Conversation" })).toHaveTextContent(
      CHIP_ANSWERS.availability,
    );
  });

  it("resets the conversation", async () => {
    fireEvent.click(renderLauncher());
    fireEvent.click(screen.getByRole("button", { name: "Show projects" }));
    await finishTyping();

    fireEvent.click(screen.getByRole("button", { name: "Reset conversation" }));
    expect(screen.getAllByRole("listitem")).toHaveLength(1);
  });

  it("shows the unread count in its name when a reply lands while closed", async () => {
    const launcher = renderLauncher();
    fireEvent.click(launcher);
    fireEvent.click(screen.getByRole("button", { name: "Show projects" }));
    fireEvent.click(launcher);

    await finishTyping();
    expect(launcher).toHaveAccessibleName(`${OPEN}, 1 unread`);

    fireEvent.click(launcher);
    fireEvent.click(launcher);
    expect(launcher).toHaveAccessibleName(OPEN);
  });

  it("shows the first-visit pill until the panel is opened once", () => {
    const launcher = renderLauncher();
    expect(screen.getByText("Ask me anything")).toBeInTheDocument();

    fireEvent.click(launcher);
    fireEvent.click(launcher);
    expect(screen.queryByText("Ask me anything")).not.toBeInTheDocument();
  });
});
