import { AboutSlot } from "./slots/AboutSlot";
import { AssistantSlot } from "./slots/AssistantSlot";
import { FooterSlot } from "./slots/FooterSlot";
import { HeaderSlot } from "./slots/HeaderSlot";
import { HeroSlot } from "./slots/HeroSlot";
import { StackSlot } from "./slots/StackSlot";
import { WorkSlot } from "./slots/WorkSlot";

/**
 * The home page in design order. Each section lives in its own slot file under `slots/`, so a
 * section ticket only edits its slot to render its widget and never touches this file.
 */
export function HomePage() {
  return (
    <>
      <HeaderSlot />
      <main id="main">
        <HeroSlot />
        <WorkSlot />
        <AboutSlot />
        <StackSlot />
      </main>
      <FooterSlot />
      <AssistantSlot />
    </>
  );
}
