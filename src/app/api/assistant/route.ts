import { answerTypedQuestion, LIMIT_ANSWER } from "@/features/ask-assistant";
import {
  checkRateLimit,
  clientIp,
  createChoiceClassifier,
  getKeyValueStore,
  sendTelegramMessage,
} from "@/shared/api";

/** The visitor's message from a `{ text }` JSON body, or `null` if there is none. */
async function readText(request: Request): Promise<string | null> {
  try {
    const body: unknown = await request.json();
    if (body && typeof body === "object" && "text" in body && typeof body.text === "string") {
      return body.text.trim() || null;
    }
  } catch {
    // Not JSON.
  }
  return null;
}

/** Answers a typed question from the assistant panel with `{ reply }`. */
export async function POST(request: Request) {
  const text = await readText(request);
  if (!text) return Response.json({ error: "Send { text }." }, { status: 400 });

  const store = getKeyValueStore();
  if (!(await checkRateLimit(clientIp(request.headers), store))) {
    return Response.json({ reply: LIMIT_ANSWER }, { status: 429 });
  }

  const reply = await answerTypedQuestion(text, {
    classify: createChoiceClassifier(),
    claimOnce: store.claimOnce,
    sendAlert: sendTelegramMessage,
  });
  return Response.json({ reply });
}
