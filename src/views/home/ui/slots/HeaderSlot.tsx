import { Logo } from "@/shared/ui";

// POR-9 replaces this with the site-header widget.
export function HeaderSlot() {
  return (
    <header className="border-b border-line px-gutter pt-5 pb-12 md:py-0">
      <div className="mx-auto flex max-w-page items-center md:h-16">
        <a href="#top" aria-label="Johnny Dang, back to top" className="rounded-full">
          <Logo preload />
        </a>
      </div>
    </header>
  );
}
