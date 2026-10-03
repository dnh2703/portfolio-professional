import { cn } from "@/shared/lib";
import { Section } from "@/shared/ui";

import { flowSteps, stepTone } from "../model/steps";
import type { FlowStep, StepTone } from "../model/steps";

const HEADING_ID = "stack-heading";

/** Two-digit step number: 1 → "01". */
const pad = (value: number) => String(value).padStart(2, "0");

const subLine = "Follow one request: an admin lets Editors export reports";

/** Dot border per tone: cream for the first step, accent for the last. */
const dotClassName: Record<StepTone, string> = {
  start: "border-fg",
  middle: "border-dim",
  end: "border-accent",
};

const cardClassName: Record<StepTone, string> = {
  start: "border-fg bg-fg text-bg",
  middle: "border-line bg-surface-2",
  end: "border-accent bg-accent text-bg",
};

const labelClassName: Record<StepTone, string> = {
  start: "",
  middle: "text-muted",
  end: "",
};

const textClassName: Record<StepTone, string> = {
  start: "text-line-strong",
  middle: "text-secondary",
  end: "",
};

/**
 * "The stack, end to end": the tools, told as the path of one request through five ordered steps
 * (the request-flow board). On desktop a progress track runs above a row of five cards; on mobile
 * the cards stack beside a vertical track, the heading drops ", end to end" and the section label,
 * shows a step count, and the step text is shorter. The tracks are decorative.
 */
export function StackFlow() {
  return (
    <Section id="stack" aria-labelledby={HEADING_ID}>
      <div className="flex flex-col gap-6 md:gap-12">
        <div className="flex items-end justify-between gap-6">
          <div className="flex flex-col gap-5">
            <h2 id={HEADING_ID} className="text-display-xs font-medium md:text-display-sm">
              The <em className="font-serif font-normal">stack</em>
              <span className="hidden md:inline">, end to end</span>
            </h2>
            <p className="hidden text-small text-muted uppercase md:block">{subLine}</p>
          </div>
          <p className="hidden shrink-0 text-small text-muted uppercase md:block">
            (Stack) · Request flow
          </p>
          <span aria-hidden="true" className="text-meta text-muted md:hidden">
            ({pad(flowSteps.length)})
          </span>
        </div>
        <p className="text-meta leading-normal text-muted uppercase md:hidden">{subLine}</p>

        <div className="flex flex-col gap-5">
          <ProgressTrack />
          <ol className="relative flex flex-col gap-2.5 ps-7 before:absolute before:start-1.75 before:top-4.5 before:bottom-4.5 before:w-0.5 before:bg-line-strong md:grid md:grid-cols-5 md:gap-5 md:ps-0 md:before:hidden">
            {flowSteps.map((step, index) => (
              <FlowStepItem
                key={step.name}
                step={step}
                number={index + 1}
                tone={stepTone(index, flowSteps.length)}
              />
            ))}
          </ol>
        </div>
      </div>
    </Section>
  );
}

/** Desktop only: a line with one dot centred over each card column. */
function ProgressTrack() {
  return (
    <div aria-hidden="true" className="relative hidden h-4 md:block">
      <span className="absolute inset-x-1/10 top-1.75 h-0.5 bg-line-strong" />
      <div className="absolute inset-0 grid grid-cols-5 gap-5">
        {flowSteps.map((step, index) => (
          <span
            key={step.name}
            className={cn(
              "size-4 justify-self-center rounded-full border-2 bg-bg",
              dotClassName[stepTone(index, flowSteps.length)],
            )}
          />
        ))}
      </div>
    </div>
  );
}

type FlowStepItemProps = {
  step: FlowStep;
  number: number;
  tone: StepTone;
};

function FlowStepItem({ step, number, tone }: FlowStepItemProps) {
  return (
    <li
      className={cn(
        "relative flex flex-col gap-1.5 rounded-2xl border p-4 md:h-62.5 md:gap-3.5 md:rounded-3xl md:p-7",
        cardClassName[tone],
      )}
    >
      {/* Mobile track dot, beside the card on the vertical line. */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute -start-7 top-4.5 size-3.5 rounded-full border-2 bg-bg md:hidden",
          dotClassName[tone],
        )}
      />
      {/* The <ol> already announces the position, so the number is hidden from screen readers. */}
      <p className={cn("text-micro uppercase md:text-caption", labelClassName[tone])}>
        <span aria-hidden="true">{pad(number)} · </span>
        {step.name}
      </p>
      <h3 className="text-title font-medium md:text-h3-tight">{step.title}</h3>
      <p className={cn("text-small md:hidden", textClassName[tone])}>{step.shortText}</p>
      <p className={cn("hidden text-body leading-normal md:block", textClassName[tone])}>
        {step.text}
      </p>
    </li>
  );
}
