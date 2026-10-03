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

  it("shows a plain dot when idle, animated dots only while typing, and the unread count", () => {
    const idle = render(<LauncherAvatar />).container;
    expect(badge(idle)).toHaveAttribute("data-badge", "idle");
    expect(badge(idle)?.children).toHaveLength(0);
    expect(badge(idle)).toHaveTextContent("");

    const typing = render(<LauncherAvatar typing />).container;
    expect(badge(typing)).toHaveAttribute("data-badge", "typing");
    expect(badge(typing)?.children).toHaveLength(3);

    const unread = render(<LauncherAvatar typing unread={2} />).container;
    expect(badge(unread)).toHaveAttribute("data-badge", "unread");
    expect(badge(unread)).toHaveTextContent("2");
    expect(badge(unread)?.children).toHaveLength(0);
  });

  it("drops the dots on the 40px light variant", () => {
    const { container } = render(<LauncherAvatar variant="light-40" />);
    expect(badge(container)?.children).toHaveLength(0);
  });

  it("rings the badge in cream on the live launcher, in every state", () => {
    for (const props of [{}, { typing: true }, { unread: 3 }]) {
      const { container } = render(<LauncherAvatar {...props} />);
      expect(badge(container)).toHaveClass("border-fg");
      expect(badge(container)).not.toHaveClass("border-bg");
    }
  });
});
