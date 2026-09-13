"use client";

import { Minus, Plus } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  bundlePrice,
  bundleSavings,
  bundleSeparateTotal,
} from "@/lib/bundles/catalog";
import { formatUSD } from "@/lib/currency";
import { useCartStore } from "@/store/cart-store";
import { toast } from "sonner";
import type { Bundle } from "@/types/bundle";
import type { Product } from "@/types/product";

interface BundleAddToCartSectionProps {
  bundle: Bundle;
  componentProducts: Product[];
}

export function BundleAddToCartSection({
  bundle,
  componentProducts,
}: BundleAddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const addBundle = useCartStore((state) => state.addBundle);

  const handleAdd = () => {
    addBundle(bundle, quantity);
    toast.success(`${bundle.name} added to cart`);
  };

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <span className="text-[10px] uppercase tracking-[0.1em] text-gold-touch">
        {bundle.badge}
      </span>
      <h1 className="mt-4 font-display text-3xl leading-tight text-ink lg:text-4xl">
        {bundle.name}
      </h1>
      <p className="mt-6 text-lg font-medium text-ink">
        {formatUSD(bundlePrice(bundle))}
      </p>
      <p className="mt-1 text-xs text-muted">
        Bought separately {formatUSD(bundleSeparateTotal(bundle))}
      </p>
      <p className="mt-1 text-xs text-gold-touch">
        Save {formatUSD(bundleSavings(bundle))}
      </p>
      <p className="mt-8 text-sm leading-relaxed text-muted">
        {bundle.shortDescription}
      </p>

      <ul className="mt-8 grid gap-2 border-y border-border py-6">
        {bundle.highlights.map((highlight) => (
          <li key={highlight} className="text-sm text-muted">
            {highlight}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex items-stretch gap-4">
        <div className="flex items-center border border-border">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="qty-btn pressable hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" strokeWidth={1.5} />
          </button>
          <span className="w-10 text-center text-sm" aria-live="polite">
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="qty-btn pressable hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>
        <Button size="lg" className="flex-1" onClick={handleAdd}>
          {bundle.detailCta}
        </Button>
      </div>

      <div className="mt-8 border-t border-border pt-6">
        <h2 className="eyebrow text-ink">What&apos;s Included</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          {bundle.includedText}
        </p>
        <ul className="mt-4 space-y-2">
          {componentProducts.map((product) => (
            <li key={product.id}>
              <Link
                href={`/products/${product.slug}`}
                className="text-sm text-ink underline-offset-4 hover:underline"
              >
                {product.name}
              </Link>
              <span className="text-sm text-muted"> — {product.size}</span>
            </li>
          ))}
        </ul>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-muted">
        Standard shipping calculated at checkout. Secure payment via Stripe.
      </p>
    </div>
  );
}
