import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Button } from "./Button";

describe("Button", () => {
  it("renders a type=button by default and handles clicks", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>Send</Button>);

    const button = screen.getByRole("button", { name: "Send" });
    expect(button).toHaveAttribute("type", "button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("keeps an explicit type", () => {
    render(<Button type="submit">Submit</Button>);
    expect(screen.getByRole("button", { name: "Submit" })).toHaveAttribute("type", "submit");
  });

  it("does not fire clicks when disabled", () => {
    const onClick = vi.fn();
    render(
      <Button disabled onClick={onClick}>
        Send
      </Button>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Send" }));
    expect(onClick).not.toHaveBeenCalled();
  });
});
