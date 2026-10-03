"use client";

import { createContext, use, useReducer } from "react";
import type { ReactNode } from "react";

import { getProject } from "@/entities/project";

import { getReply } from "../api";
import { assistantReducer, initialAssistantState, nextRequestId } from "./assistant-reducer";
import { askAboutText } from "./content";
import type { AssistantState, Question } from "./types";

export type AssistantContextValue = {
  state: AssistantState;
  toggle: () => void;
  close: () => void;
  /** Sends a question; ignored while a reply is on its way. `text` is the visitor's message. */
  ask: (question: Question, text: string) => void;
  /** Opens the panel and asks about a project from `entities/project`. */
  askAboutProject: (projectId: string) => void;
  reset: () => void;
};

const AssistantContext = createContext<AssistantContextValue | null>(null);

/**
 * Shared assistant state (open, typing, unread, messages) for the launcher, the panel and the
 * project-card triggers. Mounted once in `app/_providers`.
 */
export function AssistantProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(assistantReducer, initialAssistantState);

  function request(question: Question, text: string, type: "ask" | "askAbout") {
    const requestId = nextRequestId(state);
    dispatch({ type, text });
    if (requestId === null) return;
    void getReply(question).then((reply) => {
      dispatch({ type: "reply", requestId, text: reply });
    });
  }

  const value: AssistantContextValue = {
    state,
    toggle: () => dispatch({ type: "toggle" }),
    close: () => dispatch({ type: "close" }),
    ask: (question, text) => request(question, text, "ask"),
    askAboutProject: (projectId) => {
      const project = getProject(projectId);
      if (!project) return;
      request({ kind: "project", projectId }, askAboutText(project.name), "askAbout");
    },
    reset: () => dispatch({ type: "reset" }),
  };

  // oxlint-disable-next-line react/jsx-no-constructed-context-values -- the React Compiler memoizes `value`
  return <AssistantContext value={value}>{children}</AssistantContext>;
}

export function useAssistant(): AssistantContextValue {
  const value = use(AssistantContext);
  if (!value) throw new Error("useAssistant must be used inside <AssistantProvider>.");
  return value;
}
