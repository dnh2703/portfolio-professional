import { siteConfig } from "@/shared/config";
import { Marquee } from "@/shared/ui";

import { facts, intro, stack } from "../config";
import { AvailabilityLink } from "./AvailabilityLink";

const headingId = "hero-heading";

/**
 * Intro block that continues the site header: the page's only `<h1>`, the intro, key facts and
 * the full-bleed stack marquee. The 390 board shows the short intro and the availability link
 * instead of the facts and the marquee.
 */
export function Hero() {
  return (
    <section id="top" aria-labelledby={headingId}>
      <div className="border-b border-line px-gutter pt-5 pb-12 md:pt-9 md:pb-18">
        <div className="mx-auto max-w-page">
          <h1
            id={headingId}
            className="text-display-xs font-medium sm:text-display-sm lg:text-display"
          >
            Frontend that feels{" "}
            <em className="font-serif font-normal tracking-tight text-accent">inevitable</em>, built
            <br className="hidden lg:inline" /> end to end.
          </h1>

          <p className="mt-7 text-lead leading-normal font-light text-secondary md:hidden">
            {intro.short}
          </p>
          {siteConfig.available && <AvailabilityLink className="mt-7 md:hidden" />}

          <div className="page-grid mt-18 hidden items-end md:grid">
            <p className="col-span-5 text-h4 leading-normal font-light tracking-normal text-secondary">
              {intro.long}
            </p>
            <dl className="col-span-6 col-start-7 grid grid-cols-3 gap-6">
              {facts.map((fact) => (
                <div
                  key={fact.label}
                  className="flex flex-col gap-2 border-t border-surface-7 pt-4"
                >
                  <dt className="text-caption text-muted uppercase">{fact.label}</dt>
                  <dd className="text-body-lg text-fg">{fact.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <Marquee
        label="Tech stack"
        className="hidden min-h-21 border-b border-line pe-gutter md:flex motion-reduce:py-6 motion-reduce:ps-gutter"
      >
        {stack.map((item) => (
          <li
            key={item}
            className="flex items-center gap-12 pe-4 text-body tracking-wider whitespace-nowrap text-muted uppercase"
          >
            {item}
            <span aria-hidden="true" className="text-accent">
              ✦
            </span>
          </li>
        ))}
      </Marquee>
    </section>
  );
}
