import Link from "next/link";
import Image from "next/image";
import {
  bundlePrice,
  bundleSavings,
  getBundlesForProduct,
} from "@/lib/bundles/catalog";
import { getPrimaryImageUrl } from "@/lib/products/images";
import { formatUSD } from "@/lib/currency";
import type { Product } from "@/types/product";

interface BundleRecommendationsProps {
  product: Product;
  className?: string;
}

export function BundleRecommendations({
  product,
  className,
}: BundleRecommendationsProps) {
  const bundles = getBundlesForProduct(product.id);

  if (bundles.length === 0) return null;

  return (
    <section className={className} aria-labelledby="bundle-rec-heading">
      <h2 id="bundle-rec-heading" className="eyebrow text-ink">
        Hair care bundles
      </h2>
      <p className="mt-2 text-sm text-muted">
        Save with a fixed bundle — full-size products at a set price.
      </p>
      <ul className="mt-4 space-y-3">
        {bundles.map((bundle) => (
          <li key={bundle.id}>
            <Link
              href={`/products/${bundle.slug}`}
              className="flex gap-3 border border-border p-3 transition-colors hover:border-ink/30"
            >
              <div className="relative h-16 w-16 shrink-0 bg-surface-muted">
                <Image
                  src={getPrimaryImageUrl(bundle.images)}
                  alt={bundle.images[0]?.alt || bundle.name}
                  fill
                  sizes="64px"
                  className="object-contain p-1"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-ink">{bundle.name}</p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted">
                  {bundle.includedText}
                </p>
                <p className="mt-1 text-xs text-ink">
                  {formatUSD(bundlePrice(bundle))}
                  <span className="ml-2 text-gold-touch">
                    Save {formatUSD(bundleSavings(bundle))}
                  </span>
                </p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
