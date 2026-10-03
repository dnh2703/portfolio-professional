import { describe, expect, it, vi } from "vitest";

import { createMemoryStore } from "./key-value-store";
import type { KeyValueStore } from "./key-value-store";
import { checkRateLimit, clientIp, DEFAULT_RATE_LIMITS } from "./rate-limit";

vi.mock("server-only", () => ({}));

/** Sends `count` requests from `visitor` at `now` and returns the last result. */
async function hit(store: KeyValueStore, visitor: string, count: number, now: number) {
  const results = [];
  for (let index = 0; index < count; index += 1) {
    // Sequential on purpose: each request sees the counts of the ones before it.
    // oxlint-disable-next-line no-await-in-loop -- requests must be counted in order
    results.push(await checkRateLimit(visitor, store, { now }));
  }
  return results;
}

describe("checkRateLimit", () => {
  it("allows 10 requests a minute per visitor", async () => {
    const store = createMemoryStore(() => 0);
    const results = await hit(store, "1.1.1.1", DEFAULT_RATE_LIMITS.perMinute + 1, 0);
    expect(results.slice(0, -1).every(Boolean)).toBe(true);
    expect(results.at(-1)).toBe(false);
    // Another visitor has their own count.
    expect(await checkRateLimit("2.2.2.2", store, { now: 0 })).toBe(true);
    // The next minute starts a new window.
    expect(await checkRateLimit("1.1.1.1", store, { now: 60_000 })).toBe(true);
  });

  it("allows 50 requests a day per visitor", async () => {
    let clock = 0;
    const store = createMemoryStore(() => clock);
    const minutes = DEFAULT_RATE_LIMITS.perDay / DEFAULT_RATE_LIMITS.perMinute;
    const allowed = [];
    for (let minute = 0; minute < minutes; minute += 1) {
      clock = minute * 60_000;
      // oxlint-disable-next-line no-await-in-loop -- requests must be counted in order
      allowed.push(...(await hit(store, "1.1.1.1", DEFAULT_RATE_LIMITS.perMinute, clock)));
    }
    expect(allowed.every(Boolean)).toBe(true);
    clock = minutes * 60_000;
    expect(await checkRateLimit("1.1.1.1", store, { now: clock })).toBe(false);
  });

  it("allows the request when the store fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);
    const broken: KeyValueStore = {
      increment: async () => {
        throw new Error("down");
      },
      claimOnce: async () => true,
    };
    expect(await checkRateLimit("1.1.1.1", broken)).toBe(true);
  });
});

describe("clientIp", () => {
  it("reads the first forwarded address, then the real IP", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "1.1.1.1, 10.0.0.1" }))).toBe("1.1.1.1");
    expect(clientIp(new Headers({ "x-real-ip": "2.2.2.2" }))).toBe("2.2.2.2");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
