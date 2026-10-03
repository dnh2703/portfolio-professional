import { describe, expect, it } from "vitest";

import { education } from "../model";
import { formatEducationShort } from "./format-education";

describe("formatEducationShort", () => {
  it("uses the short label when there is one", () => {
    expect(education.map((item) => formatEducationShort(item))).toEqual([
      "PTIT · Multimedia",
      "FPT Software Academy · ReactJS Frontend Developer Program",
      "CS50, Harvard · Introduction to Computer Science",
    ]);
  });
});
