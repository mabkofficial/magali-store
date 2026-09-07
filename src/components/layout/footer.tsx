import Link from "next/link";
import { BrandLogo } from "@/components/layout/brand-logo";
import { PageContainer } from "@/components/layout/page-container";
import { footerLinks, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <PageContainer sectionY className="grid grid-gap sm:grid-cols-2 lg:grid-cols-4">
        <div className="min-w-0 sm:col-span-2 lg:col-span-1">
          <BrandLogo variant="lockup" href="/" className="hover:opacity-100" />
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-muted">
            Botanical hair care, wellness oils, and Caribbean food favorites.
            Crafted for everyday life.
          </p>
          {(siteConfig.social.instagram || siteConfig.social.facebook) && (
            <div className="mt-4 flex flex-wrap gap-4 text-xs uppercase tracking-[0.1em]">
              {siteConfig.social.instagram && (
                <a
                  href={siteConfig.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-botanical"
                >
                  Instagram
                </a>
              )}
              {siteConfig.social.facebook && (
                <a
                  href={siteConfig.social.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted transition-colors hover:text-botanical"
                >
                  Facebook
                </a>
              )}
            </div>
          )}
        </div>

        <div className="min-w-0">
          <h3 className="eyebrow mb-4 text-ink">Shop</h3>
          <ul className="stack-sm text-sm">
            {footerLinks.shop.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="cursor-pointer text-muted transition-colors hover:text-botanical"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <h3 className="eyebrow mb-4 text-ink">Customer Care</h3>
          <ul className="stack-sm text-sm">
            {footerLinks.care.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="cursor-pointer text-muted transition-colors hover:text-botanical"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0 sm:col-span-2 lg:col-span-1">
          <h3 className="eyebrow mb-4 text-ink">Contact</h3>
          <p className="text-sm text-muted">
            Questions about products or orders?{" "}
            <Link href="/contact" className="text-ink underline underline-offset-4">
              Get in touch
            </Link>
            .
          </p>
          {siteConfig.contactEmail && (
            <p className="mt-3 text-sm text-muted">
              <a href={`mailto:${siteConfig.contactEmail}`} className="transition-colors hover:text-botanical">
                {siteConfig.contactEmail}
              </a>
            </p>
          )}
          {siteConfig.contactPhone && (
            <p className="mt-2 text-sm text-muted">{siteConfig.contactPhone}</p>
          )}
        </div>
      </PageContainer>

      <div className="border-t border-border">
        <PageContainer className="flex flex-col items-center justify-between gap-4 py-6 text-xs text-muted sm:flex-row">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}</p>
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="cursor-pointer uppercase tracking-[0.1em] transition-colors hover:text-botanical"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </PageContainer>
      </div>
    </footer>
  );
}
