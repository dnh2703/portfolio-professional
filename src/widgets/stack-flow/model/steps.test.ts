import { describe, expect, it } from "vitest";

import { flowSteps, stepTone } from "./steps";

describe("stepTone", () => {
  it("marks the first step as start, the last as end and the rest as middle", () => {
    expect(flowSteps.map((_, index) => stepTone(index, flowSteps.length))).toEqual([
      "start",
      "middle",
      "middle",
      "middle",
      "end",
    ]);
  });
});
