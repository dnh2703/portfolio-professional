// oxlint-disable-next-line import/no-unassigned-import -- marker import: a build error if a client module imports this file
import "server-only";

import type { KeyValueStore } from "./key-value-store";

export type RateLimits = { perMinute: number; perDay: number };

/** Starting limits per visitor. */
export const DEFAULT_RATE_LIMITS: RateLimits = { perMinute: 10, perDay: 50 };

const MINUTE_MS = 60 * 1000;
const DAY_MS = 24 * 60 * MINUTE_MS;

/**
 * Counts a request from `visitor` (an IP) in fixed one-minute and one-day windows. `false` when it
 * goes over either limit. If the store fails, the request is allowed: the limit only protects cost.
 */
export async function checkRateLimit(
  visitor: string,
  store: KeyValueStore,
  { limits = DEFAULT_RATE_LIMITS, now = Date.now() }: { limits?: RateLimits; now?: number } = {},
): Promise<boolean> {
  try {
    const [minute, day] = await Promise.all([
      store.increment(`ratelimit:m:${visitor}:${Math.floor(now / MINUTE_MS)}`, 60),
      store.increment(`ratelimit:d:${visitor}:${Math.floor(now / DAY_MS)}`, 24 * 60 * 60),
    ]);
    return minute <= limits.perMinute && day <= limits.perDay;
  } catch (error) {
    console.error("Rate limit check failed", error);
    return true;
  }
}

/** The visitor's IP from the proxy headers, or `"unknown"`. */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}
