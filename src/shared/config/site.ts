/**
 * Site-wide constants: owner, contact, location and links. Import from `@/shared/config`.
 *
 * Values marked `TODO(owner)` are placeholders until the owner provides them. Keep them here only,
 * never inline in a component, so filling them in is a one-line change.
 */
export const siteConfig = {
  /** Full name, as in the page title and footer. */
  name: "Dang Nhat Huy (Johnny Dang)",
  /** Short name used by the logo lockup and headings. */
  shortName: "Johnny Dang",
  url: "https://dnh2703.work",
  email: "dnh2703@gmail.com",
  /** IANA time zone for the local-time clock (pass to `formatLocalTime`). */
  timeZone: "Asia/Ho_Chi_Minh",
  timeZoneLabel: "GMT+7",
  coordinates: "21° 01′ 42″ N, 105° 51′ 15″ E",
  /** Shorter form for narrow screens. */
  coordinatesShort: "21° 01′ N, 105° 51′ E",
  /** Drives the "available for work" status. */
  available: true,
  // TODO(owner): replace with the real amount, e.g. "$4k".
  amount: "[AMOUNT]",
  // TODO(owner): replace with the real response time, e.g. "within 24h".
  responseTime: "[RESPONSE TIME]",
  links: {
    github: "https://github.com/dnh2703",
    // TODO(owner): replace with the real LinkedIn profile URL.
    linkedin: "https://www.linkedin.com/in/TODO",
    // TODO(owner): replace with the real X profile URL.
    x: "https://x.com/TODO",
    site: "https://dnh2703.work",
  },
} as const;

export type SiteConfig = typeof siteConfig;
