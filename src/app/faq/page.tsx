import { JsonLd } from "@/components/seo/json-ld";
import { AccordionItem } from "@/components/ui/accordion";
import { PageContainer } from "@/components/layout/page-container";
import { faqSections } from "@/data/faq-content";
import { getFaqPageJsonLd } from "@/lib/seo/json-ld";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "FAQ",
  description:
    "Answers about Magali botanical hair care, PureHeal wellness oil, shipping, orders, and Caribbean beef pies.",
  path: "/faq",
});

export default function FAQPage() {
  return (
    <>
      <JsonLd data={getFaqPageJsonLd()} />
      <PageContainer narrow pageY>
        <p className="eyebrow text-muted">FAQ</p>
        <h1 className="mt-4 font-display text-4xl text-ink lg:text-5xl">
          Frequently asked questions
        </h1>
        <p className="mt-4 text-sm text-muted">
          Quick answers about our products, orders, and shipping.
        </p>

        {faqSections.map((section) => (
          <section key={section.title} className="mt-8 border-t border-border pt-8">
            <h2 className="eyebrow mb-4 text-ink">{section.title}</h2>
            {section.items.map((item) => (
              <AccordionItem key={item.q} title={item.q}>
                <p>{item.a}</p>
              </AccordionItem>
            ))}
          </section>
        ))}
      </PageContainer>
    </>
  );
}
