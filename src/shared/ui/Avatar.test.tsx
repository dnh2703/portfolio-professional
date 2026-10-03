import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Avatar } from "./Avatar";

describe("Avatar", () => {
  it("is decorative by default", () => {
    const { container } = render(<Avatar size={32} />);
    expect(screen.queryByRole("img")).not.toBeInTheDocument();
    expect(container.querySelector("img")).toHaveAttribute("alt", "");
  });

  it("uses the given alt text and variant image", () => {
    render(<Avatar size={40} variant="chat" alt="Johnny's assistant" />);

    const image = screen.getByRole("img", { name: "Johnny's assistant" });
    expect(image.getAttribute("src")).toContain("avatar-chat.png");
    expect(image).toHaveAttribute("width", "40");
  });
});
