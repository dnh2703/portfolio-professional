import { siteConfig } from "@/shared/config";
import { cn } from "@/shared/lib";

/** "Available for projects" with a pulsing dot, from `siteConfig.available`. */
export function AvailabilityStatus() {
  const { available } = siteConfig;
  return (
    <p className="inline-flex items-center gap-2 font-mono text-meta text-secondary uppercase">
      <span aria-hidden="true" className="relative inline-flex size-2">
        {available ? (
          <span className="absolute inset-0 rounded-full bg-accent opacity-75 motion-safe:animate-ping" />
        ) : null}
        <span className={cn("relative size-2 rounded-full", available ? "bg-accent" : "bg-dim")} />
      </span>
      {available ? "Available for projects" : "Booked for now"}
    </p>
  );
}
