import { AboutSlot } from "./slots/AboutSlot";
import { AssistantSlot } from "./slots/AssistantSlot";
import { FooterSlot } from "./slots/FooterSlot";
import { HeaderSlot } from "./slots/HeaderSlot";
import { HeroSlot } from "./slots/HeroSlot";
import { StackSlot } from "./slots/StackSlot";
import { WorkSlot } from "./slots/WorkSlot";

/**
 * The home page in design order. Each section is rendered by its own slot file under `slots/`, so
 * a change to one section stays in its slot.
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
