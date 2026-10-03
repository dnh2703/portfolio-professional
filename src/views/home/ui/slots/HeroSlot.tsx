import { siteConfig } from "@/shared/config";

// POR-10 replaces this with the hero widget.
export function HeroSlot() {
  return (
    <section id="top" aria-label="Intro" className="px-gutter py-section">
      <div className="mx-auto max-w-page">
        <h1 className="text-display-sm md:text-display">
          Johnny <span className="font-serif font-normal italic">Dang</span>
        </h1>
        <p className="mt-6 text-lead text-secondary">{siteConfig.name}</p>
      </div>
    </section>
  );
}
