"use client";

import { useEffect, useEffectEvent, useId, useRef, useState } from "react";

import type { NavItem } from "../config/nav-items";

type MobileMenuProps = {
  items: readonly NavItem[];
  className?: string;
};

/**
 * Menu button for narrow screens: a disclosure that shows the primary nav in a panel under the
 * header. Escape closes it and returns focus to the button; choosing a link closes it and lets the
 * browser jump to the section.
 */
export function MobileMenu({ items, className }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelId = useId();

  const onKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (event.key !== "Escape") return;
    setOpen(false);
    buttonRef.current?.focus();
  });

  useEffect(() => {
    if (!open) return undefined;
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <div className={className}>
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen(!open)}
        className="inline-flex h-9 items-center gap-2 rounded-full border border-line-strong px-4 font-mono text-meta text-fg uppercase transition-colors hover:border-line-hover"
      >
        {open ? "Close menu" : "Open menu"}
      </button>
      <nav
        id={panelId}
        aria-label="Primary"
        hidden={!open}
        className="absolute inset-x-0 top-full z-40 border-b border-line bg-bg px-gutter pt-2 pb-8"
      >
        <ul>
          {items.map((item) => (
            <li key={item.href} className="border-b border-line last:border-b-0">
              <a
                href={item.href}
                onClick={() => setOpen(false)}
                className="flex py-4 text-h3 text-fg transition-colors hover:text-accent"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
