import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { projects } from "@/entities/project";
import { AssistantProvider } from "@/features/ask-assistant";
import { siteConfig } from "@/shared/config";

import { SelectedWork } from "./SelectedWork";

const label = "Ask my assistant about this project";

// jsdom loads no CSS, so the desktop and mobile copies (card 02 as a card and as a row) are both
// in the DOM here; `md:` utilities decide which one shows in the browser.
describe("SelectedWork", () => {
  it("is the #work region named by its heading, with the hint and project count", () => {
    render(<SelectedWork />, { wrapper: AssistantProvider });

    const region = screen.getByRole("region", { name: "Selected work" });
    expect(region).toHaveAttribute("id", "work");
    expect(screen.getByText("Tap a project to ask my assistant · (05)")).toBeInTheDocument();
    expect(screen.getByText("Tap to ask · (05)")).toBeInTheDocument();
  });

  it("lists every project by name", () => {
    render(<SelectedWork />, { wrapper: AssistantProvider });

    const names = screen.getAllByRole("heading", { level: 3 }).map((h) => h.textContent);
    for (const project of projects) {
      expect(names.some((name) => name?.includes(project.name))).toBe(true);
    }
  });

  it("gives every card an ask-assistant button described by the project name", () => {
    render(<SelectedWork />, { wrapper: AssistantProvider });

    const buttons = screen.getAllByRole("button", { name: label });
    // Two cards on desktop + card 02 again as a mobile row + rows 03–05.
    expect(buttons).toHaveLength(6);
    expect(buttons[0]).toHaveAccessibleDescription(/Enterprise Web Platform/);
    expect(buttons.at(-1)).toHaveAccessibleDescription(/Parking Application/);
  });

  it("calls the action for the project of the card that is clicked", () => {
    const onAsk = vi.fn();
    render(
      <SelectedWork
        renderAction={(project, { describedBy }) => (
          <button
            type="button"
            aria-label={label}
            aria-describedby={describedBy}
            onClick={() => onAsk(project.id)}
          />
        )}
      />,
    );

    const [, second, ...rest] = screen.getAllByRole("button", { name: label });
    const last = rest.at(-1);
    if (!second || !last) throw new Error("expected project buttons");
    fireEvent.click(second);
    expect(onAsk).toHaveBeenCalledWith("p02");
    fireEvent.click(last);
    expect(onAsk).toHaveBeenLastCalledWith("p05");
  });

  it("hides the previews from assistive tech and marks the Arabic label", () => {
    render(<SelectedWork />, { wrapper: AssistantProvider });

    for (const text of ["Bulk import", "Choose a package", siteConfig.amount]) {
      expect(screen.getByText(text).closest("[aria-hidden='true']")).not.toBeNull();
    }
    const arabic = screen.getByText("عربي");
    expect(arabic).toHaveAttribute("lang", "ar");
    expect(arabic).toHaveAttribute("dir", "rtl");
    const region = screen.getByRole("region", { name: "Selected work" });
    expect(within(region).queryByRole("heading", { name: /Roles/ })).not.toBeInTheDocument();
  });
});
