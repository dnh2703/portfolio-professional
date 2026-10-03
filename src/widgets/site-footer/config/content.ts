import { siteConfig } from "@/shared/config";

export type FooterLink = {
  label: string;
  href: string;
};

/** Name in the copyright line. */
export const copyrightName = "Dang Nhat Huy";

export const copyrightYear = 2026;

/** Profile and site links in the bottom row; every URL comes from `siteConfig`. */
export const footerLinks: readonly FooterLink[] = [
  { label: "GitHub", href: siteConfig.links.github },
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "X", href: siteConfig.links.x },
  { label: new URL(siteConfig.links.site).host, href: siteConfig.links.site },
];
