"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ProductGridSkeleton } from "@/components/ui/skeleton";
import { FROZEN_CHECKOUT_ENABLED } from "@/config/site";
import { formatUSD } from "@/lib/currency";
import { isStripeConfigured } from "@/lib/stripe";
import { useCartStore } from "@/store/cart-store";

export function CartContent() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal, hasFrozenItems, openCart } =
    useCartStore();
  const [loading, setLoading] = useState(false);
  const subtotal = getSubtotal();
  const frozenBlocked = hasFrozenItems() && !FROZEN_CHECKOUT_ENABLED;
  const stripeReady = isStripeConfigured();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (frozenBlocked) return;
    if (!stripeReady) return;

    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Checkout failed");
      }

      window.location.href = data.url;
    } catch {
      openCart();
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-muted">Your cart is empty.</p>
        <Link href="/shop" className="mt-8 inline-block">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-12 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ul className="divide-y divide-border">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-6">
              <div className="relative h-24 w-24 shrink-0 bg-surface-muted">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-contain p-2"
                />
              </div>
              <div className="flex flex-1 flex-col">
                <Link
                  href={`/products/${item.slug}`}
                  className="text-sm text-ink hover:underline"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-xs text-muted">
                  {formatUSD(item.price)} each
                  {item.shippingClass === "frozen" && " · Frozen"}
                </p>
                <div className="mt-auto flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="pressable border border-border p-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <span className="w-8 text-center text-sm" aria-live="polite">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="pressable border border-border p-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="pressable ml-auto p-1.5 text-muted hover:text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={clearCart}
          className="mt-6 cursor-pointer text-xs uppercase tracking-[0.1em] text-muted hover:text-ink"
        >
          Clear cart
        </button>
      </div>

      <div className="border border-border p-6 lg:p-8">
        <h2 className="eyebrow text-ink">Summary</h2>
        <div className="mt-6 flex justify-between text-sm">
          <span className="text-muted">Subtotal</span>
          <span className="font-medium text-ink">{formatUSD(subtotal)}</span>
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted">
          Shipping and taxes calculated at checkout. Secure payment via Stripe.
        </p>

        {frozenBlocked && (
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Frozen-item shipping is being finalized. Please{" "}
            <Link href="/contact" className="text-ink underline">
              contact us
            </Link>{" "}
            to order frozen items.
          </p>
        )}

        {!stripeReady && !frozenBlocked && (
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Checkout is temporarily unavailable. Please{" "}
            <Link href="/contact" className="text-ink underline">
              contact us
            </Link>{" "}
            to place an order.
          </p>
        )}

        <Button
          className="mt-8 w-full"
          onClick={handleCheckout}
          disabled={loading || frozenBlocked || !stripeReady}
        >
          {loading ? "Processing..." : "Checkout"}
        </Button>
        <Link
          href="/shop"
          className="mt-4 block text-center text-xs uppercase tracking-[0.1em] text-muted hover:text-ink"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}

export function CartContentFallback() {
  return <ProductGridSkeleton />;
}
