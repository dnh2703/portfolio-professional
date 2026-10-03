export type MessageAuthor = "bot" | "user";

export type Message = {
  /** Unique within a conversation; also the React key. */
  id: number;
  from: MessageAuthor;
  text: string;
};

export type ChipId = "build" | "projects" | "availability";

/** Something a typed question can be about, with the description Jev sees and the answer. */
export type Topic = {
  /** Option label sent to Jev, e.g. `"frontend"` or a project id. */
  id: string;
  description: string;
  answer: string;
};

/** What the visitor asked. The reply source (`getReply`) answers each kind. */
export type Question =
  | { kind: "chip"; chip: ChipId }
  | { kind: "project"; projectId: string }
  | { kind: "text"; text: string };

export type AssistantState = {
  open: boolean;
  /** A reply is on its way. New questions are ignored until it arrives. */
  typing: boolean;
  /** Replies that arrived while the panel was closed. */
  unread: number;
  messages: readonly Message[];
  nextId: number;
  /** Id of the question waiting for a reply, so a reply that lands after a reset is dropped. */
  pendingId: number | null;
};

export type AssistantAction =
  | { type: "open" }
  | { type: "close" }
  | { type: "toggle" }
  | { type: "ask"; text: string }
  | { type: "askAbout"; text: string }
  | { type: "reply"; requestId: number; text: string }
  | { type: "reset" };
