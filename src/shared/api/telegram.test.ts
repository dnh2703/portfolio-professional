import { afterEach, describe, expect, it, vi } from "vitest";

import { sendTelegramMessage } from "./telegram";

vi.mock("server-only", () => ({}));

describe("sendTelegramMessage", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("is skipped without a bot token or chat id", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "");
    vi.stubEnv("TELEGRAM_CHAT_ID", "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    await sendTelegramMessage("Hi");
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the text to the chat with the Bot API", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "123:abc");
    vi.stubEnv("TELEGRAM_CHAT_ID", "42");
    const fetchMock = vi.fn(async () => Response.json({ ok: true }));
    vi.stubGlobal("fetch", fetchMock);

    await sendTelegramMessage('Unanswered: "Hi" · 21:40 GMT+7');
    expect(fetchMock).toHaveBeenCalledWith(
      "https://api.telegram.org/bot123:abc/sendMessage",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ chat_id: "42", text: 'Unanswered: "Hi" · 21:40 GMT+7' }),
      }),
    );
  });

  it("throws when Telegram refuses the message", async () => {
    vi.stubEnv("TELEGRAM_BOT_TOKEN", "123:abc");
    vi.stubEnv("TELEGRAM_CHAT_ID", "42");
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response("", { status: 400 })),
    );
    await expect(sendTelegramMessage("Hi")).rejects.toThrow(/400/);
  });
});
