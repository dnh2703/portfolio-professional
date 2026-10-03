import type { ComponentProps } from "react";

import { cn } from "@/shared/lib";

export type ButtonVariant = "primary" | "secondary" | "ghost";
export type ButtonSize = "sm" | "md";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors disabled:pointer-events-none disabled:opacity-50";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-accent text-bg hover:bg-fg",
  secondary: "border border-line-strong text-fg hover:border-fg hover:bg-surface-3",
  ghost: "text-secondary hover:bg-surface-3 hover:text-fg",
};

const sizes: Record<ButtonSize, string> = {
  sm: "h-8 px-3 text-small",
  md: "h-10 px-4 text-ui",
};

/** Class names shared by `Button` and `LinkButton`. */
export function buttonClassName(
  variant: ButtonVariant = "primary",
  size: ButtonSize = "md",
  className?: string,
): string {
  return cn(base, variants[variant], sizes[size], className);
}

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
};

/** A `<button>` (`type="button"` unless set). For navigation use `LinkButton`. */
export function Button({ variant, size, className, type = "button", ...props }: ButtonProps) {
  return <button type={type} className={buttonClassName(variant, size, className)} {...props} />;
}
