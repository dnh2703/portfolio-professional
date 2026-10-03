import Link from "next/link";

import { siteConfig } from "@/shared/config";
import { LocalTime, Logo } from "@/shared/ui";

import { navItems } from "../config/nav-items";
import { AvailabilityStatus } from "./AvailabilityStatus";
import { MobileMenu } from "./MobileMenu";

/** Year shown in the meta row. */
const PORTFOLIO_YEAR = 2026;

/**
 * When this module was loaded on the server, i.e. when the static page was rendered. The clock
 * hydrates with this value, then catches up to the visitor's current time.
 */
const RENDERED_AT = Date.now();

/**
 * Top bar: logo, primary nav and availability, then a meta row with coordinates, the portfolio year
 * and the live local time. Below `md` the logo is smaller, the nav moves into the "Open menu" disclosure,
 * and the status and year are left out (the hero shows the status on mobile). No bottom padding or
 * border: the header block continues into the hero, which closes it.
 */
export function SiteHeader() {
  return (
    <header className="relative px-gutter pt-5 md:pt-8">
      <div className="mx-auto max-w-page">
        <div className="flex h-13 items-center justify-between gap-6 md:h-14">
          <Link href="/" aria-label={`${siteConfig.shortName} · home`} className="rounded-full">
            <Logo variant="stacked" size="sm" preload className="md:hidden" />
            <Logo variant="stacked" size="lg" preload className="max-md:hidden" />
          </Link>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-10">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-sm text-body text-fg transition-colors hover:text-accent"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="hidden md:block">
            <AvailabilityStatus />
          </div>
          <MobileMenu items={navItems} className="md:hidden" />
        </div>

        <div className="mt-14 flex items-center justify-between gap-4 text-meta text-muted uppercase md:mt-30 md:text-small md:tracking-meta">
          <p>
            <span className="md:hidden">{siteConfig.coordinatesShort}</span>
            <span className="hidden md:inline">{siteConfig.coordinates}</span>
          </p>
          <p className="hidden md:block">Portfolio ©{PORTFOLIO_YEAR}</p>
          <p>
            <span className="sr-only md:not-sr-only">Local time </span>
            <LocalTime initialTime={RENDERED_AT} />
          </p>
        </div>
      </div>
    </header>
  );
}
