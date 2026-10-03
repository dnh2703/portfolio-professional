import { cn } from "@/shared/lib";

import { Avatar } from "./Avatar";

export type LogoProps = {
  /**
   * `inline`: avatar, then "Johnny Dang" on one line. `stacked`: a 44px disc with "Johnny" above
   * "Dang" (mobile header).
   */
  variant?: "inline" | "stacked";
  /** Avatar diameter in px for the inline lockup. */
  avatarSize?: number;
  /** Preload the avatar image when the logo is above the fold. */
  preload?: boolean;
  className?: string;
};

/**
 * Logo lockup: avatar on the cream disc, "Johnny" in Geist 500, "Dang" in Instrument Serif italic
 * and an accent dot (a "." in the stacked lockup). Not a link by itself; wrap it in one where it navigates.
 */
export function Logo({ variant = "inline", avatarSize = 28, preload, className }: LogoProps) {
  if (variant === "stacked") {
    return (
      <span className={cn("inline-flex items-center gap-2.5 text-fg", className)}>
        {/* 38px image inside the 44px disc. */}
        <Avatar size={44} preload={preload} className="p-0.75" />
        <span className="flex flex-col">
          <span className="text-logo-first font-medium">Johnny</span>{" "}
          <span className="font-serif text-logo-last italic">
            Dang
            <span aria-hidden="true" className="text-accent">
              .
            </span>
          </span>
        </span>
      </span>
    );
  }

  return (
    <span className={cn("inline-flex items-center gap-2.5 text-title text-fg", className)}>
      <Avatar size={avatarSize} preload={preload} />
      <span className="leading-none">
        <span className="font-medium tracking-tight">Johnny</span>{" "}
        <span className="font-serif italic">Dang</span>
        <span aria-hidden="true" className="ms-0.5 inline-block size-1.5 rounded-full bg-accent" />
      </span>
    </span>
  );
}
