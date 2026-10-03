import type { ReactNode } from "react";

import { AssistantProvider } from "@/features/ask-assistant";

/** App-wide client providers, mounted once in the root layout. */
export function Providers({ children }: { children: ReactNode }) {
  return <AssistantProvider>{children}</AssistantProvider>;
}
