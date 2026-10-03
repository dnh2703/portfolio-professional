import Link from "next/link";

import { siteConfig } from "@/shared/config";
import { LocalTime, Logo, VisuallyHidden } from "@/shared/ui";

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
 * and the live local time. Below `md` the nav moves into the "Open menu" disclosure, and the status
 * and year are left out (the hero shows the status on mobile).
 */
export function SiteHeader() {
  return (
    <header className="relative border-b border-line px-gutter pt-5 pb-12 md:py-0">
      <div className="mx-auto max-w-page">
        <div className="flex items-center justify-between gap-6 md:h-16">
          <Link href="/" aria-label={`${siteConfig.shortName} · home`} className="rounded-full">
            <Logo preload />
          </Link>
          <nav aria-label="Primary" className="hidden md:block">
            <ul className="flex items-center gap-8">
              {navItems.map((item) => (
                <li key={item.href}>
                  <a
                    href={item.href}
                    className="rounded-sm text-ui text-secondary transition-colors hover:text-fg"
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

        <div className="mt-10 flex items-center justify-between gap-4 font-mono text-meta text-muted uppercase md:mt-0 md:h-10 md:border-t md:border-line">
          <p>
            <span className="md:hidden">{siteConfig.coordinatesShort}</span>
            <span className="hidden md:inline">{siteConfig.coordinates}</span>
          </p>
          <p className="hidden md:block">Portfolio ©{PORTFOLIO_YEAR}</p>
          <p>
            <VisuallyHidden>Local time: </VisuallyHidden>
            <LocalTime initialTime={RENDERED_AT} />
          </p>
        </div>
      </div>
    </header>
  );
}
