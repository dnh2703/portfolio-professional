import { beforeEach, describe, expect, it, vi } from "vitest";

import { LIMIT_ANSWER } from "@/features/ask-assistant";

import { POST } from "./route";

const mocks = vi.hoisted(() => ({
  allowed: true,
  classify: vi.fn(),
  sendAlert: vi.fn(async () => undefined),
}));

vi.mock("@/shared/api", () => ({
  checkRateLimit: async () => mocks.allowed,
  clientIp: () => "1.1.1.1",
  createChoiceClassifier: () => mocks.classify,
  getKeyValueStore: () => ({ increment: async () => 1, claimOnce: async () => true }),
  sendTelegramMessage: mocks.sendAlert,
}));

function post(body: unknown) {
  return POST(
    new Request("http://localhost/api/assistant", {
      method: "POST",
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
  );
}

describe("POST /api/assistant", () => {
  beforeEach(() => {
    mocks.allowed = true;
    mocks.classify.mockReset();
    mocks.sendAlert.mockClear();
  });

  it("answers with the topic Jev picks", async () => {
    mocks.classify.mockResolvedValue({ choice: "hobbies", confidence: 0.9 });
    const response = await post({ text: "What do you do for fun?" });
    expect(response.status).toBe(200);
    expect(await response.json()).toEqual({ reply: "Running, badminton, gaming." });
  });

  it("replies with the limit message over the limit, without Jev or an alert", async () => {
    mocks.allowed = false;
    const response = await post({ text: "What do you do for fun?" });
    expect(response.status).toBe(429);
    expect(await response.json()).toEqual({ reply: LIMIT_ANSWER });
    expect(mocks.classify).not.toHaveBeenCalled();
    expect(mocks.sendAlert).not.toHaveBeenCalled();
  });

  it("rejects a body without text", async () => {
    expect((await post({})).status).toBe(400);
    expect((await post({ text: "   " })).status).toBe(400);
    expect((await post("not json")).status).toBe(400);
  });
});
