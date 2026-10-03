import { siteConfig } from "@/shared/config";
import { LocalTime, VisuallyHidden } from "@/shared/ui";

import { copyrightName, copyrightYear, footerLinks } from "../config";
import { BackToTop } from "./BackToTop";
import { CopyEmailButton } from "./CopyEmailButton";

/**
 * When this module was loaded on the server, i.e. when the static page was rendered. The clock
 * hydrates with this value, then catches up to the visitor's current time.
 */
const RENDERED_AT = Date.now();

const headingId = "contact-heading";

/**
 * Contact footer (`#contact`): headline, email link and copy button, profile links and the
 * copyright line with the live Hanoi time. The 390 board drops the label, the copy button, the
 * clock and "Back to top", stretches the email link and puts the links in two columns.
 */
export function SiteFooter() {
  return (
    <footer
      id="contact"
      aria-labelledby={headingId}
      className="border-t border-line px-gutter pt-section pb-7 md:pb-10"
    >
      <div className="mx-auto flex max-w-page flex-col gap-8 md:gap-12">
        <p className="hidden text-small text-muted uppercase md:block">
          (Contact) · Open to new opportunities
        </p>
        <h2
          id={headingId}
          className="text-contact-mobile font-medium md:text-display-sm lg:text-display xl:text-contact"
        >
          {"Let's build"}
          <br />
          <em className="font-serif font-normal md:tracking-tight">something</em>{" "}
          <span className="text-accent">good.</span>
        </h2>
        <div className="flex items-center gap-4">
          <a
            href={`mailto:${siteConfig.email}`}
            className="flex h-14 grow items-center justify-between gap-3 rounded-full bg-fg px-5.5 text-body font-medium text-bg transition-colors hover:bg-secondary md:h-16 md:grow-0 md:px-8 md:text-cta"
          >
            {siteConfig.email}
            <span aria-hidden="true">↗</span>
          </a>
          <CopyEmailButton email={siteConfig.email} className="hidden md:inline-flex" />
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-page flex-col gap-8 md:mt-30 md:flex-row md:items-center md:justify-between md:border-t md:border-line md:pt-8">
        <ul className="grid grid-cols-2 gap-3 text-body md:flex md:gap-8">
          {footerLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block border-b border-line py-3 text-fg transition-colors hover:text-accent md:rounded-sm md:border-b-0 md:py-0"
              >
                {link.label} <span aria-hidden="true">↗</span>
                <VisuallyHidden> (opens in a new tab)</VisuallyHidden>
              </a>
            </li>
          ))}
        </ul>
        <p className="text-meta text-muted md:text-small">
          © {copyrightYear} {copyrightName} · <span className="md:hidden">Hanoi, Vietnam</span>
          <span className="hidden md:inline">
            <LocalTime initialTime={RENDERED_AT} label="" /> in Hanoi
          </span>
        </p>
        <BackToTop className="hidden md:inline" />
      </div>
    </footer>
  );
}
