export type NavItem = {
  href: `#${string}`;
  label: string;
};

/** Primary navigation: in-page links to the home sections. */
export const navItems: readonly NavItem[] = [
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#stack", label: "Stack" },
  { href: "#contact", label: "Contact" },
];
