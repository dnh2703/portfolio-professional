import { cn } from "@/shared/lib";

import { Avatar } from "./Avatar";

/** Disc, text and gap per stacked size. The avatar sits 3px inside the disc (38 / 46px). */
const stackedSizes = {
  sm: { disc: 44, gap: "gap-2.5", first: "text-logo-first", last: "text-logo-last" },
  lg: { disc: 52, gap: "gap-3", first: "text-logo-first-lg", last: "text-logo-last-lg" },
} as const;

export type LogoProps = {
  /**
   * `inline`: avatar, then "Johnny Dang" on one line. `stacked`: the disc with "Johnny" above
   * "Dang" (site header).
   */
  variant?: "inline" | "stacked";
  /** Stacked lockup size: `sm` (44px disc, mobile) or `lg` (52px disc, desktop). */
  size?: keyof typeof stackedSizes;
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
export function Logo({
  variant = "inline",
  size = "sm",
  avatarSize = 28,
  preload,
  className,
}: LogoProps) {
  if (variant === "stacked") {
    const stacked = stackedSizes[size];
    return (
      <span className={cn("inline-flex items-center text-fg", stacked.gap, className)}>
        <Avatar size={stacked.disc} preload={preload} className="p-0.75" />
        <span className="flex flex-col">
          <span className={cn("font-medium", stacked.first)}>Johnny</span>{" "}
          <span className={cn("font-serif italic", stacked.last)}>
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
