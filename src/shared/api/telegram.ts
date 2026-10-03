// oxlint-disable-next-line import/no-unassigned-import -- marker import: a build error if a client module imports this file
import "server-only";

/**
 * Sends `text` to Johnny's chat with the Bot API `sendMessage`. Skipped silently when
 * `TELEGRAM_BOT_TOKEN` or `TELEGRAM_CHAT_ID` is missing; throws if Telegram refuses it.
 */
export async function sendTelegramMessage(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text }),
    signal: AbortSignal.timeout(3000),
  });
  if (!response.ok) throw new Error(`Telegram responded ${response.status}`);
}
