"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FROZEN_CHECKOUT_ENABLED } from "@/config/site";
import { formatUSD } from "@/lib/currency";
import { isStripeConfigured } from "@/lib/stripe";
import { useCartStore } from "@/store/cart-store";

export function CartContent() {
  const { items, updateQuantity, removeItem, clearCart, getSubtotal, hasFrozenItems } =
    useCartStore();
  const [loading, setLoading] = useState(false);
  const subtotal = getSubtotal();
  const frozenBlocked = hasFrozenItems() && !FROZEN_CHECKOUT_ENABLED;
  const stripeReady = isStripeConfigured();

  const handleCheckout = async () => {
    if (items.length === 0) return;

    if (frozenBlocked) {
      toast.error(
        "Frozen-item shipping is being finalized. Please contact Magali to order this item.",
      );
      return;
    }

    if (!stripeReady) {
      toast.error("Checkout is temporarily unavailable. Please contact us to place an order.");
      return;
    }

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
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to start checkout",
      );
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="py-16 text-center">
        <p className="text-lg text-magali-ink/60">Your cart is empty.</p>
        <Link href="/shop" className="mt-6 inline-block">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <ul className="divide-y divide-magali-cream-100">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 py-6">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-white">
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
                  className="font-medium text-magali-green-950 hover:text-magali-gold-600"
                >
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-magali-ink/60">
                  {formatUSD(item.price)} each
                  {item.shippingClass === "frozen" && " • Frozen item"}
                </p>
                <div className="mt-auto flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    className="rounded-lg border border-magali-cream-100 p-1 hover:bg-magali-cream-100"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    className="rounded-lg border border-magali-cream-100 p-1 hover:bg-magali-cream-100"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId)}
                    className="ml-auto rounded-lg p-1 text-magali-red-700 hover:bg-red-50"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={clearCart}
          className="mt-4 text-sm text-magali-ink/60 hover:text-magali-red-700"
        >
          Clear cart
        </button>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="font-display text-xl font-semibold text-magali-green-950">
          Order Summary
        </h2>
        <div className="mt-6 flex justify-between text-sm">
          <span>Subtotal</span>
          <span className="font-semibold">{formatUSD(subtotal)}</span>
        </div>
        <p className="mt-4 text-xs text-magali-ink/60">
          Shipping and taxes calculated at checkout.
        </p>

        {frozenBlocked && (
          <div className="mt-4 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
            Frozen-item shipping is being finalized. Please{" "}
            <Link href="/contact" className="font-medium underline">
              contact Magali
            </Link>{" "}
            to order frozen items.
          </div>
        )}

        {!stripeReady && !frozenBlocked && (
          <div className="mt-4 rounded-xl bg-magali-cream-100 p-4 text-sm text-magali-ink/80">
            Checkout is temporarily unavailable. Please{" "}
            <Link href="/contact" className="font-medium underline">
              contact us
            </Link>{" "}
            to place an order.
          </div>
        )}

        <Button
          className="mt-6 w-full"
          onClick={handleCheckout}
          disabled={loading || frozenBlocked || !stripeReady}
        >
          {loading ? "Processing..." : "Checkout"}
        </Button>
        <Link href="/shop" className="mt-4 block text-center text-sm text-magali-gold-600 hover:underline">
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
