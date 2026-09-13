import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  bundlePrice,
  bundleSavings,
  bundleSeparateTotal,
} from "@/lib/bundles/catalog";
import { getPrimaryImageUrl } from "@/lib/products/images";
import { formatUSD } from "@/lib/currency";
import type { Bundle } from "@/types/bundle";

interface BundleCardProps {
  bundle: Bundle;
  priority?: boolean;
}

export function BundleCard({ bundle, priority = false }: BundleCardProps) {
  const primaryImage = getPrimaryImageUrl(bundle.images);

  return (
    <article className="flex min-w-0 flex-col">
      <Link
        href={`/products/${bundle.slug}`}
        className="product-card-hover relative block aspect-square w-full min-w-0 overflow-hidden border border-border bg-surface-muted"
      >
        <Image
          src={primaryImage}
          alt={bundle.images[0]?.alt || bundle.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-contain p-2 sm:p-3"
        />
      </Link>

      <div className="flex flex-1 flex-col pt-2">
        <span className="text-[10px] uppercase tracking-[0.1em] text-gold-touch">
          {bundle.badge}
        </span>
        <Link href={`/products/${bundle.slug}`} className="cursor-pointer">
          <h3 className="mt-1.5 line-clamp-2 text-sm font-medium leading-snug text-ink">
            {bundle.name}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-muted">
          {bundle.includedText}
        </p>
        <div className="mt-auto space-y-1 pt-3">
          <p className="text-sm font-medium text-ink">{formatUSD(bundlePrice(bundle))}</p>
          <p className="text-[11px] text-muted">
            Bought separately {formatUSD(bundleSeparateTotal(bundle))}
          </p>
          <p className="text-[11px] text-gold-touch">
            Save {formatUSD(bundleSavings(bundle))}
          </p>
        </div>
        <Link href={`/products/${bundle.slug}`} className="mt-3">
          <Button variant="outline" size="sm" className="w-full">
            {bundle.cardCta}
          </Button>
        </Link>
      </div>
    </article>
  );
}
