import { GREETING } from "./content";
import type { AssistantAction, AssistantState, Message } from "./types";

const greeting: Message = { id: 0, from: "bot", text: GREETING };

export const initialAssistantState: AssistantState = {
  open: false,
  typing: false,
  unread: 0,
  messages: [greeting],
  nextId: 1,
  pendingId: null,
};

/** Adds the visitor's message and starts typing. Ignored while a reply is on its way. */
function ask(state: AssistantState, text: string): AssistantState {
  if (state.typing) return state;
  const id = state.nextId;
  return {
    ...state,
    typing: true,
    messages: [...state.messages, { id, from: "user", text }],
    nextId: id + 1,
    pendingId: id,
  };
}

function reply(state: AssistantState, requestId: number, text: string): AssistantState {
  if (requestId !== state.pendingId) return state;
  return {
    ...state,
    typing: false,
    unread: state.open ? 0 : state.unread + 1,
    messages: [...state.messages, { id: state.nextId, from: "bot", text }],
    nextId: state.nextId + 1,
    pendingId: null,
  };
}

/** The id `ask`/`askAbout` would give the visitor's message, or `null` if it would be ignored. */
export function nextRequestId(state: AssistantState): number | null {
  return state.typing ? null : state.nextId;
}

export function assistantReducer(state: AssistantState, action: AssistantAction): AssistantState {
  switch (action.type) {
    case "open":
      return { ...state, open: true, unread: 0 };
    case "close":
      return { ...state, open: false };
    case "toggle":
      return state.open ? { ...state, open: false } : { ...state, open: true, unread: 0 };
    case "ask":
      return ask(state, action.text);
    case "askAbout":
      return ask({ ...state, open: true, unread: 0 }, action.text);
    case "reply":
      return reply(state, action.requestId, action.text);
    case "reset":
      return { ...state, typing: false, unread: 0, messages: [greeting], pendingId: null };
    default:
      return state;
  }
}
