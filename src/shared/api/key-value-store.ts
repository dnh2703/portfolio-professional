// oxlint-disable-next-line import/no-unassigned-import -- marker import: a build error if a client module imports this file
import "server-only";

/** Counters and one-time claims that expire, for rate limits and alert dedupe. */
export type KeyValueStore = {
  /** Adds 1 to `key` and returns the new count. The count expires `ttlSeconds` after it starts. */
  increment: (key: string, ttlSeconds: number) => Promise<number>;
  /** `true` the first time `key` is claimed, `false` until the claim expires after `ttlSeconds`. */
  claimOnce: (key: string, ttlSeconds: number) => Promise<boolean>;
};

/** In-process store. Resets on restart and isn't shared between server instances. */
export function createMemoryStore(now: () => number = Date.now): KeyValueStore {
  const entries = new Map<string, { value: number; expiresAt: number }>();

  function live(key: string) {
    const entry = entries.get(key);
    if (entry && entry.expiresAt <= now()) {
      entries.delete(key);
      return undefined;
    }
    return entry;
  }

  return {
    increment: async (key, ttlSeconds) => {
      const entry = live(key) ?? { value: 0, expiresAt: now() + ttlSeconds * 1000 };
      entry.value += 1;
      entries.set(key, entry);
      return entry.value;
    },
    claimOnce: async (key, ttlSeconds) => {
      if (live(key)) return false;
      entries.set(key, { value: 1, expiresAt: now() + ttlSeconds * 1000 });
      return true;
    },
  };
}

type UpstashResult = { result?: unknown; error?: string };

/** Store on Upstash Redis through its REST API: shared by every server instance. */
export function createUpstashStore(url: string, token: string): KeyValueStore {
  async function pipeline(commands: (string | number)[][]): Promise<unknown[]> {
    const response = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: JSON.stringify(commands),
      signal: AbortSignal.timeout(3000),
    });
    if (!response.ok) throw new Error(`Upstash responded ${response.status}`);
    const results: unknown = await response.json();
    if (!Array.isArray(results)) throw new Error("Upstash: unexpected response");
    return results.map((item: UpstashResult) => {
      if (item.error) throw new Error(`Upstash: ${item.error}`);
      return item.result;
    });
  }

  return {
    increment: async (key, ttlSeconds) => {
      // SET NX starts the count with its expiry; INCR then counts this request.
      const [, count] = await pipeline([
        ["SET", key, 0, "EX", ttlSeconds, "NX"],
        ["INCR", key],
      ]);
      return Number(count);
    },
    claimOnce: async (key, ttlSeconds) => {
      const [result] = await pipeline([["SET", key, 1, "EX", ttlSeconds, "NX"]]);
      return result === "OK";
    },
  };
}

let store: KeyValueStore | undefined;

/** Upstash when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, otherwise memory. */
export function getKeyValueStore(): KeyValueStore {
  if (!store) {
    const url = process.env.UPSTASH_REDIS_REST_URL;
    const token = process.env.UPSTASH_REDIS_REST_TOKEN;
    store = url && token ? createUpstashStore(url, token) : createMemoryStore();
  }
  return store;
}
