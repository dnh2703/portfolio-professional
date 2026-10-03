import { afterEach, describe, expect, it, vi } from "vitest";

import { createMemoryStore, createUpstashStore } from "./key-value-store";

vi.mock("server-only", () => ({}));

describe("createMemoryStore", () => {
  it("counts until the window expires", async () => {
    let now = 0;
    const store = createMemoryStore(() => now);
    expect(await store.increment("k", 60)).toBe(1);
    expect(await store.increment("k", 60)).toBe(2);
    now = 60_000;
    expect(await store.increment("k", 60)).toBe(1);
  });

  it("claims a key once until it expires", async () => {
    let now = 0;
    const store = createMemoryStore(() => now);
    expect(await store.claimOnce("k", 10)).toBe(true);
    expect(await store.claimOnce("k", 10)).toBe(false);
    expect(await store.claimOnce("other", 10)).toBe(true);
    now = 10_000;
    expect(await store.claimOnce("k", 10)).toBe(true);
  });
});

describe("createUpstashStore", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("sends SET NX with the expiry, then INCR, in one pipeline", async () => {
    const fetchMock = vi.fn(async () => Response.json([{ result: "OK" }, { result: 3 }]));
    vi.stubGlobal("fetch", fetchMock);
    const store = createUpstashStore("https://redis.example", "token");

    expect(await store.increment("k", 60)).toBe(3);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://redis.example/pipeline",
      expect.objectContaining({
        method: "POST",
        headers: { Authorization: "Bearer token" },
        body: JSON.stringify([
          ["SET", "k", 0, "EX", 60, "NX"],
          ["INCR", "k"],
        ]),
      }),
    );
  });

  it("claims with SET NX", async () => {
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce(Response.json([{ result: "OK" }]))
        .mockResolvedValueOnce(Response.json([{ result: null }])),
    );
    const store = createUpstashStore("https://redis.example", "token");
    expect(await store.claimOnce("k", 60)).toBe(true);
    expect(await store.claimOnce("k", 60)).toBe(false);
  });

  it("throws on an error response", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("no", { status: 401 })),
    );
    await expect(
      createUpstashStore("https://redis.example", "bad").claimOnce("k", 60),
    ).rejects.toThrow(/401/);
  });
});
