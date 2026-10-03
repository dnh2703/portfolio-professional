import { Section } from "@/shared/ui";

import { flowSteps } from "../model/steps";
import type { FlowStep } from "../model/steps";

const HEADING_ID = "stack-heading";

/** Two-digit step number: 1 → "01". */
const pad = (value: number) => String(value).padStart(2, "0");

/**
 * "The stack, end to end": the tools, told as the path of one request through five ordered steps
 * (the request-flow board). Desktop and mobile differ only in copy: the 390 board drops the
 * section label and the "end to end" half of the heading, shows a step count, and uses shorter
 * step text.
 */
export function StackFlow() {
  return (
    <Section id="stack" aria-labelledby={HEADING_ID}>
      <div className="flex flex-col gap-6 md:gap-12">
        <div className="page-grid gap-y-4">
          <p className="hidden font-mono text-meta text-muted md:col-span-3 md:block">
            (Stack) · Request flow
          </p>
          <div className="col-span-full md:col-span-9">
            <h2 id={HEADING_ID} className="text-h2 md:text-h1">
              The stack
              <span className="hidden md:inline">
                , <em className="font-serif font-normal">end to end</em>
              </span>
              <span
                aria-hidden="true"
                className="ms-2 align-top font-mono text-meta text-muted md:hidden"
              >
                ({pad(flowSteps.length)})
              </span>
            </h2>
            <p className="mt-3 text-body text-secondary md:text-lead">
              Follow one request: an admin lets Editors export reports
            </p>
          </div>
        </div>

        <ol className="grid gap-3 md:grid-cols-5">
          {flowSteps.map((step, index) => (
            <FlowStepItem key={step.name} step={step} number={index + 1} />
          ))}
        </ol>
      </div>
    </Section>
  );
}

type FlowStepItemProps = {
  step: FlowStep;
  number: number;
};

function FlowStepItem({ step, number }: FlowStepItemProps) {
  return (
    <li className="flex flex-col gap-3 rounded-lg border border-line bg-surface-1 p-5">
      {/* The <ol> already announces the position, so the number is hidden from screen readers. */}
      <p className="font-mono text-meta text-muted">
        <span aria-hidden="true">{pad(number)} · </span>
        {step.name}
      </p>
      <h3 className="text-title font-medium">{step.title}</h3>
      <p className="text-small text-secondary md:hidden">{step.shortText}</p>
      <p className="hidden text-small text-secondary md:block">{step.text}</p>
    </li>
  );
}
