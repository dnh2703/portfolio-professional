import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { LauncherAvatar } from "./LauncherAvatar";

function badge(container: HTMLElement) {
  return container.querySelector("[data-badge]");
}

describe("LauncherAvatar", () => {
  it("is decorative", () => {
    const { container } = render(<LauncherAvatar />);
    expect(container.firstElementChild).toHaveAttribute("aria-hidden", "true");
  });

  it("shows idle dots, animated dots while typing, and the unread count", () => {
    const idle = render(<LauncherAvatar />).container;
    expect(badge(idle)).toHaveAttribute("data-badge", "idle");
    expect(badge(idle)?.children).toHaveLength(3);

    const typing = render(<LauncherAvatar typing />).container;
    expect(badge(typing)).toHaveAttribute("data-badge", "typing");

    const unread = render(<LauncherAvatar typing unread={2} />).container;
    expect(badge(unread)).toHaveAttribute("data-badge", "unread");
    expect(badge(unread)).toHaveTextContent("2");
  });

  it("drops the dots on the 40px light variant", () => {
    const { container } = render(<LauncherAvatar variant="light-40" />);
    expect(badge(container)?.children).toHaveLength(0);
  });
});
