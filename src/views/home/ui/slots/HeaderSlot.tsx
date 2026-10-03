import { Logo } from "@/shared/ui";

// POR-9 replaces this with the site-header widget.
export function HeaderSlot() {
  return (
    <header className="border-b border-line px-gutter">
      <div className="mx-auto flex h-16 max-w-page items-center">
        <a href="#top" aria-label="Johnny Dang, back to top" className="rounded-full">
          <Logo preload />
        </a>
      </div>
    </header>
  );
}
