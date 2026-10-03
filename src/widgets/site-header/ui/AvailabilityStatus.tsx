import { siteConfig } from "@/shared/config";
import { cn } from "@/shared/lib";

/**
 * Outlined pill linking to the contact section: "Available for projects" with a pulsing accent dot,
 * from `siteConfig.available`. The pulse is off under `prefers-reduced-motion`.
 */
export function AvailabilityStatus() {
  const { available } = siteConfig;
  return (
    <a
      href="#contact"
      className="inline-flex h-11 items-center gap-2.5 rounded-full border border-surface-7 px-5 text-ui text-fg transition-colors hover:border-line-hover"
    >
      <span aria-hidden="true" className="relative inline-flex size-2">
        {available ? (
          <span className="absolute inset-0 rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
        ) : null}
        <span className={cn("relative size-2 rounded-full", available ? "bg-accent" : "bg-dim")} />
      </span>
      {available ? "Available for projects" : "Booked for now"}
    </a>
  );
}
