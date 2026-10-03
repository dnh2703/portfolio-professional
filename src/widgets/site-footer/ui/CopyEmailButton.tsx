"use client";

import { useEffect, useState } from "react";

import { cn } from "@/shared/lib";

/** How long the "Copied" / "Copy failed" label stays before it resets. */
const RESET_MS = 2_000;

type CopyStatus = "idle" | "copied" | "failed";

const labels: Record<CopyStatus, string> = {
  idle: "Copy email",
  copied: "Copied",
  failed: "Copy failed",
};

export type CopyEmailButtonProps = {
  email: string;
  className?: string;
};

/**
 * Copies `email` to the clipboard. The label switches to "Copied" (or "Copy failed" when the
 * Clipboard API is missing or refuses) and resets after 2 s. The result is also announced through
 * a polite live region that stays mounted.
 */
export function CopyEmailButton({ email, className }: CopyEmailButtonProps) {
  const [status, setStatus] = useState<CopyStatus>("idle");

  useEffect(() => {
    if (status === "idle") return undefined;
    const id = setTimeout(() => setStatus("idle"), RESET_MS);
    return () => clearTimeout(id);
  }, [status]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("copied");
    } catch {
      setStatus("failed");
    }
  }

  const announcement = {
    idle: "",
    copied: "Email address copied to the clipboard.",
    failed: `Couldn't copy the email address. It is ${email}.`,
  }[status];

  return (
    <>
      <button
        type="button"
        onClick={() => void copy()}
        className={cn(
          "h-16 items-center rounded-full border border-surface-7 px-7 text-body-lg font-medium whitespace-nowrap text-fg transition-colors hover:border-fg hover:bg-surface-3",
          className,
        )}
      >
        {labels[status]}
      </button>
      <output aria-live="polite" className="sr-only">
        {announcement}
      </output>
    </>
  );
}
