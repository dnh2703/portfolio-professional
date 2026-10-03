"use client";

import { useEffect, useState } from "react";

import { siteConfig } from "@/shared/config";
import { cn, formatLocalTime } from "@/shared/lib";

/** How often the clock re-reads the current time. */
const TICK_MS = 15_000;

export type LocalTimeProps = {
  /**
   * Epoch ms the server rendered with. The first client render uses the same value, so hydration
   * matches; the clock then catches up to the real time.
   */
  initialTime: number;
  /** Text after the time, e.g. "GMT+7". Pass `""` for the bare time. */
  label?: string;
  /** IANA time zone. */
  timeZone?: string;
  className?: string;
};

/**
 * Live "HH:mm" clock in the site owner's time zone (from `siteConfig`), updated every 15 s. Not a
 * live region: announcing the time every tick would be noise.
 */
export function LocalTime({
  initialTime,
  label = siteConfig.timeZoneLabel,
  timeZone = siteConfig.timeZone,
  className,
}: LocalTimeProps) {
  const [time, setTime] = useState(initialTime);

  useEffect(() => {
    const tick = () => setTime(Date.now());
    tick();
    const id = setInterval(tick, TICK_MS);
    return () => clearInterval(id);
  }, []);

  const formatted = formatLocalTime(new Date(time), timeZone);

  return (
    <time dateTime={formatted} className={cn("tabular-nums", className)}>
      {formatted}
      {label ? ` ${label}` : null}
    </time>
  );
}
