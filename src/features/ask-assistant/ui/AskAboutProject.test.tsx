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

  it("opens the assistant and asks about the project", async () => {
    render(
      <AssistantProvider>
        <AskAboutProject projectId="p01" />
        <AssistantLauncher />
      </AssistantProvider>,
    );
    const trigger = screen.getByRole("button", {
      name: "Ask about this project (Enterprise Web Platform)",
    });
    fireEvent.click(trigger);

    const log = screen.getByRole("list", { name: "Conversation" });
    expect(log).toHaveTextContent("Tell me about Enterprise Web Platform");

    await act(async () => {
      await vi.advanceTimersByTimeAsync(REPLY_DELAY_MS);
    });
    expect(log).toHaveTextContent(getProject("p01")?.assistantSummary ?? "");
  });

  it("renders nothing for an unknown project", () => {
    const { container } = render(<AskAboutProject projectId="nope" />, {
      wrapper: AssistantProvider,
    });
    expect(container).toBeEmptyDOMElement();
  });
});
