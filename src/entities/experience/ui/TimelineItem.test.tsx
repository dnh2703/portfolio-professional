import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { formatEducationShort, formatPeriod } from "../lib";
import { education, experience } from "../model";
import { TimelineItem } from "./TimelineItem";

describe("TimelineItem", () => {
  it("renders experience as list items with title, role and period", () => {
    render(
      <ol>
        {experience.map((item) => (
          <TimelineItem
            key={item.id}
            title={item.company}
            detail={item.role}
            hideDetailOnMobile
            period={formatPeriod(item.period)}
          />
        ))}
      </ol>,
    );

    const [eastgate, vmo] = screen.getAllByRole("listitem");
    expect(eastgate).toHaveTextContent("Eastgate Software");
    expect(eastgate).toHaveTextContent("Frontend / Fullstack Developer");
    expect(eastgate).toHaveTextContent("Oct 2025 – Now");
    expect(vmo).toHaveTextContent("Dec 2023 – Oct 2025");
  });

  it("leaves the period out for undated entries", () => {
    const cs50 = education[2];
    render(
      <ol>
        <TimelineItem title={cs50.institution} detail={cs50.program} />
      </ol>,
    );

    const item = screen.getByRole("listitem");
    expect(within(item).getByText("CS50, Harvard")).toBeInTheDocument();
    expect(item).toHaveTextContent(/^CS50, HarvardIntroduction to Computer Science$/);
  });

  it("shows the short form on mobile next to the full institution name", () => {
    const ptit = education[0];
    render(
      <ol>
        <TimelineItem
          title={ptit.institution}
          mobileTitle={formatEducationShort(ptit)}
          detail={ptit.program}
          hideDetailOnMobile
        />
      </ol>,
    );

    const item = screen.getByRole("listitem");
    expect(within(item).getByText("PTIT · Multimedia")).toBeInTheDocument();
    expect(
      within(item).getByText("Posts & Telecommunications Institute of Technology"),
    ).toBeInTheDocument();
    expect(within(item).getByText("Multimedia")).toBeInTheDocument();
  });
});
