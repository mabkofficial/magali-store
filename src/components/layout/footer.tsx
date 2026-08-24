import Link from "next/link";
import { footerLinks, siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-magali-cream-100 bg-magali-green-950 text-magali-cream-50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 lg:grid-cols-4 lg:px-8">
        <div>
          <h2 className="font-display text-2xl font-semibold">{siteConfig.name}</h2>
          <p className="mt-4 text-sm leading-relaxed text-magali-cream-50/80">
            Botanical hair and wellness essentials alongside bold Caribbean
            favorites — rooted in nature, made for everyday life.
          </p>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
            Shop
          </h3>
          <ul className="space-y-3 text-sm">
            {footerLinks.shop.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-magali-cream-50/80 transition-colors hover:text-magali-gold-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
            Customer Care
          </h3>
          <ul className="space-y-3 text-sm">
            {footerLinks.care.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-magali-cream-50/80 transition-colors hover:text-magali-gold-500"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider">
            Contact
          </h3>
          <p className="text-sm text-magali-cream-50/80">
            Questions about products or orders?{" "}
            <Link href="/contact" className="text-magali-gold-500 hover:underline">
              Get in touch
            </Link>
            .
          </p>
          {siteConfig.contactEmail && (
            <p className="mt-3 text-sm text-magali-cream-50/80">
              {siteConfig.contactEmail}
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-magali-green-800">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 text-sm text-magali-cream-50/60 lg:flex-row lg:px-8">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:text-magali-gold-500"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
