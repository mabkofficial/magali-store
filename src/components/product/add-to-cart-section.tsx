"use client";

import { Minus, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FROZEN_CHECKOUT_ENABLED } from "@/config/site";
import { formatUSD } from "@/lib/currency";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types/product";

interface AddToCartSectionProps {
  product: Product;
}

function getBadgeVariant(category: Product["category"]) {
  if (category === "Food") return "food";
  if (category === "Wellness") return "wellness";
  return "default";
}

export function AddToCartSection({ product }: AddToCartSectionProps) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);

  const handleAdd = () => {
    addItem(product, quantity);
    toast.success(`${product.shortName} added to cart`);
  };

  const isFrozenBlocked =
    product.shippingClass === "frozen" && !FROZEN_CHECKOUT_ENABLED;

  return (
    <div>
      <Badge variant={getBadgeVariant(product.category)}>{product.category}</Badge>
      <h1 className="mt-3 font-display text-3xl font-semibold text-magali-green-950 lg:text-4xl">
        {product.name}
      </h1>
      <p className="mt-2 text-sm text-magali-gold-600">{product.tagline}</p>
      <p className="mt-4 text-2xl font-semibold text-magali-green-950">
        {formatUSD(product.price)}
      </p>
      <p className="mt-1 text-sm text-magali-ink/60">{product.size}</p>
      <p className="mt-6 leading-relaxed text-magali-ink/70">
        {product.shortDescription}
      </p>

      <div className="mt-8 flex items-center gap-4">
        <div className="flex items-center rounded-xl border border-magali-cream-100">
          <button
            type="button"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="p-3 hover:bg-magali-cream-100"
            aria-label="Decrease quantity"
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="w-12 text-center">{quantity}</span>
          <button
            type="button"
            onClick={() => setQuantity(quantity + 1)}
            className="p-3 hover:bg-magali-cream-100"
            aria-label="Increase quantity"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <Button size="lg" className="flex-1" onClick={handleAdd}>
          Add to Cart
        </Button>
      </div>

      <div className="mt-6 rounded-xl bg-magali-cream-100 p-4 text-sm text-magali-ink/70">
        {product.shippingClass === "frozen" ? (
          isFrozenBlocked ? (
            <>
              This is a frozen product. Online checkout for frozen items is
              being finalized — please{" "}
              <a href="/contact" className="font-medium text-magali-gold-600 underline">
                contact us
              </a>{" "}
              to order.
            </>
          ) : (
            "Frozen product — special shipping rates apply at checkout."
          )
        ) : (
          "Standard shipping rates calculated at checkout."
        )}
      </div>

      <ul className="mt-6 space-y-2">
        {product.benefits.slice(0, 4).map((benefit) => (
          <li key={benefit} className="flex items-start gap-2 text-sm text-magali-ink/70">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-magali-gold-600" />
            {benefit}
          </li>
        ))}
      </ul>

      {(product.claims?.length ?? 0) > 0 && (
        <div className="mt-6 flex flex-wrap gap-2">
          {product.claims!.map((claim) => (
            <span
              key={claim}
              className="rounded-full bg-magali-cream-100 px-3 py-1 text-xs text-magali-green-800"
            >
              {claim}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
