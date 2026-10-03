import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { getProject } from "@/entities/project";

import { REPLY_DELAY_MS } from "../api";
import { AssistantProvider } from "../model";
import { AskAboutProject } from "./AskAboutProject";
import { AssistantLauncher } from "./AssistantLauncher";

describe("AskAboutProject", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("opens the assistant, asks about the project and returns focus on Escape", async () => {
    render(
      <AssistantProvider>
        <AskAboutProject projectId="p01" aria-label="Ask about Enterprise Web Platform" />
        <AssistantLauncher />
      </AssistantProvider>,
    );
    const trigger = screen.getByRole("button", { name: "Ask about Enterprise Web Platform" });
    expect(trigger).toHaveAttribute("type", "button");
    trigger.focus();
    fireEvent.click(trigger);

    const log = screen.getByRole("list", { name: "Conversation" });
    expect(log).toHaveTextContent("Tell me about Enterprise Web Platform");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(REPLY_DELAY_MS);
    });
    expect(log).toHaveTextContent(getProject("p01")?.assistantSummary ?? "");

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(trigger).toHaveFocus();
  });
});
