import { siteConfig } from "@/shared/config";

// POR-14 replaces this with the site-footer widget.
export function FooterSlot() {
  return (
    <footer id="contact" className="border-t border-line px-gutter py-section">
      <div className="mx-auto max-w-page text-small text-muted">
        <a href={`mailto:${siteConfig.email}`} className="text-fg">
          {siteConfig.email}
        </a>
      </div>
    </footer>
  );
}
