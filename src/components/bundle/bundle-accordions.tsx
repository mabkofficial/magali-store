import Link from "next/link";
import { AccordionItem } from "@/components/ui/accordion";
import { SHARED_BUNDLE_FAQS } from "@/lib/bundles/catalog";
import type { Bundle } from "@/types/bundle";
import type { Product } from "@/types/product";

interface BundleAccordionsProps {
  bundle: Bundle;
  componentProducts: Product[];
}

export function BundleAccordions({
  bundle,
  componentProducts,
}: BundleAccordionsProps) {
  return (
    <div className="mt-12">
      <AccordionItem title="Description" defaultOpen>
        <p>{bundle.description}</p>
        <p className="mt-4">
          <span className="font-medium text-ink">Best for:</span> {bundle.bestFor}
        </p>
      </AccordionItem>

      <AccordionItem title="Usage & product details">
        <p>
          Follow the individual product directions included with each item.
        </p>
        <ul className="mt-4 space-y-4">
          {componentProducts.map((product) => (
            <li key={product.id} className="border border-border p-4">
              <Link
                href={`/products/${product.slug}`}
                className="font-medium text-ink underline-offset-4 hover:underline"
              >
                {product.name}
              </Link>
              {Array.isArray(product.directions) && (
                <ol className="mt-2 list-decimal space-y-1 pl-5">
                  {product.directions.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              )}
              <p className="mt-2 text-xs">{product.caution}</p>
            </li>
          ))}
        </ul>
      </AccordionItem>

      <AccordionItem title="FAQs">
        <dl className="space-y-4">
          {SHARED_BUNDLE_FAQS.map((faq) => (
            <div key={faq.question}>
              <dt className="font-medium text-ink">{faq.question}</dt>
              <dd className="mt-1">{faq.answer}</dd>
            </div>
          ))}
        </dl>
      </AccordionItem>
    </div>
  );
}
