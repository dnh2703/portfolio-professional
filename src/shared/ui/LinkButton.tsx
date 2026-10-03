import type { ComponentProps } from "react";

import { buttonClassName } from "./Button";
import type { ButtonSize, ButtonVariant } from "./Button";
import { VisuallyHidden } from "./VisuallyHidden";

export type LinkButtonProps = ComponentProps<"a"> & {
  href: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  /**
   * External style: opens in a new tab, adds the "↗" arrow and tells screen readers.
   * Defaults to true for `http(s)` URLs.
   */
  external?: boolean;
};

/** A link styled as a button. */
export function LinkButton({
  href,
  variant,
  size,
  external = /^https?:\/\//.test(href),
  className,
  children,
  ...props
}: LinkButtonProps) {
  return (
    <a
      href={href}
      className={buttonClassName(variant, size, className)}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    >
      {children}
      {external && (
        <>
          <span aria-hidden="true">↗</span>
          <VisuallyHidden>{" (opens in a new tab)"}</VisuallyHidden>
        </>
      )}
    </a>
  );
}
