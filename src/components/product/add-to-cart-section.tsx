"use client";

import { Leaf, Minus, Plus, ShieldCheck, Sparkles } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FrequentlyBoughtTogether } from "@/components/product/frequently-bought-together";
import { FROZEN_CHECKOUT_ENABLED } from "@/config/site";
import { useAddToCart } from "@/hooks/use-cart-ui";
import { formatUSD } from "@/lib/currency";
import type { FbtBundle, Product } from "@/types/product";

interface AddToCartSectionProps {
  product: Product;
  fbtBundle?: FbtBundle | null;
}

const hairBenefitIcons = [Leaf, Sparkles, ShieldCheck] as const;

export function AddToCartSection({ product, fbtBundle }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const addToCart = useAddToCart();

  const isFrozenBlocked =
    product.shippingClass === "frozen" && !FROZEN_CHECKOUT_ENABLED;
  const isOutOfStock = product.inventoryCount <= 0;
  const isHairProduct = product.category === "Hair Care";

  const handleAdd = () => {
    if (isOutOfStock) return;
    addToCart(product, quantity);
  };

  return (
    <div className="lg:sticky lg:top-28 lg:self-start">
      <Badge category={product.category}>{product.category}</Badge>
      <h1 className="mt-4 font-display text-3xl leading-tight text-ink lg:text-4xl">
        {product.name}
      </h1>
      <p className="mt-3 text-sm text-muted">{product.tagline}</p>
      <p className="mt-6 text-lg font-medium text-ink">{formatUSD(product.price)}</p>
      <p className="mt-1 text-xs text-muted">{product.size}</p>
      <p className="mt-8 text-sm leading-relaxed text-muted">
        {product.shortDescription}
      </p>

      {isHairProduct && (
        <ul className="mt-8 grid gap-3 border-y border-border py-6">
          {product.benefits.slice(0, 3).map((benefit, index) => {
            const Icon = hairBenefitIcons[index] ?? Leaf;
            return (
              <li key={benefit} className="flex items-start gap-3 text-sm text-muted">
                <Icon
                  className="mt-0.5 h-4 w-4 shrink-0 text-botanical"
                  strokeWidth={1.5}
                  aria-hidden
                />
                <span>{benefit}</span>
              </li>
            );
          })}
        </ul>
      )}

      <div className="mt-10 flex items-stretch gap-4">
        {!isFrozenBlocked && !isOutOfStock && (
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
        )}
        {isOutOfStock ? (
          <Button size="lg" variant="outline" className="flex-1" disabled>
            Out of Stock
          </Button>
        ) : isFrozenBlocked ? (
          <Link href="/contact" className="flex-1">
            <Button size="lg" variant="outline" className="w-full">
              Request Beef Pies
            </Button>
          </Link>
        ) : (
          <Button size="lg" className="flex-1" onClick={handleAdd}>
            Add to Cart
          </Button>
        )}
      </div>

      {fbtBundle && (
        <FrequentlyBoughtTogether
          bundle={fbtBundle}
          surface="pdp"
          className="mt-8"
        />
      )}

      <p className="mt-6 border-t border-border pt-6 text-xs leading-relaxed text-muted">
        {product.shippingClass === "frozen" ? (
          isFrozenBlocked ? (
            <>
              Online checkout for frozen beef pies is coming soon.{" "}
              <Link href="/contact" className="text-ink underline underline-offset-4">
                Contact us
              </Link>{" "}
              to place a family-size order — we&apos;ll confirm shipping and delivery
              details directly.
            </>
          ) : (
            "Frozen items require special shipping. Rates are calculated at checkout."
          )
        ) : (
          "Standard shipping calculated at checkout. Secure payment via Stripe."
        )}
      </p>

      {!isHairProduct && (
        <ul className="mt-6 space-y-2 border-t border-border pt-6">
          {product.benefits.slice(0, 4).map((benefit) => (
            <li key={benefit} className="text-sm text-muted">
              {benefit}
            </li>
          ))}
        </ul>
      )}

      {(product.claims?.length ?? 0) > 0 && (
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2">
          {product.claims!.map((claim) => (
            <span key={claim} className="eyebrow text-muted">
              {claim}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
