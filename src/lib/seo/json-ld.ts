import { faqSections, getAllFaqItems } from "@/data/faq-content";
import { siteConfig } from "@/config/site";

function absoluteUrl(path: string): string {
  const base = siteConfig.url.replace(/\/$/, "");
  return path.startsWith("http") ? path : `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Magali",
    url: siteConfig.url,
    logo: absoluteUrl("/brand/icon-512.png"),
    description: siteConfig.description,
    ...(siteConfig.contactEmail
      ? { email: siteConfig.contactEmail }
      : {}),
    sameAs: [
      siteConfig.social.instagram,
      siteConfig.social.facebook,
    ].filter(Boolean),
  };
}

export function getWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: "Magali",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getBreadcrumbJsonLd(
  items: { name: string; href?: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.href ? { item: absoluteUrl(item.href) } : {}),
    })),
  };
}

export function getFaqPageJsonLd() {
  const items = getAllFaqItems();
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };
}

/** Plain-text summary for AI crawlers (also mirrored in /llms.txt). */
export function getStoreAiSummary(): string {
  const faqPreview = faqSections
    .flatMap((s) => s.items.slice(0, 1).map((i) => `- ${i.q}`))
    .join("\n");

  return `# Magali Store

${siteConfig.description}

Official site: ${siteConfig.url}

## Primary categories
- Hair care: botanical hair oil, herbal hair grease
- Wellness: PureHeal topical oil
- Food: Caribbean-style beef pies (8 pack, frozen)

## Key pages
- Shop: ${siteConfig.url}/shop
- Bundles: ${siteConfig.url}/bundles
- FAQ: ${siteConfig.url}/faq
- Shipping & returns: ${siteConfig.url}/shipping-returns
- Contact: ${siteConfig.url}/contact

## Sample FAQ topics
${faqPreview}

## Ordering
Secure checkout via Stripe. US shipping addresses. Order confirmation email sent after payment.

## Contact
${siteConfig.contactEmail || "hello@shop.magali.store"}
`;
}
