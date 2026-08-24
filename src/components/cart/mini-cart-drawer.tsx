"use client";

import { Minus, Plus, Trash2, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { FROZEN_CHECKOUT_ENABLED } from "@/config/site";
import { formatUSD } from "@/lib/currency";
import { isStripeConfigured } from "@/lib/stripe";
import { useBodyScrollLock, useFocusTrap } from "@/hooks/use-cart-ui";
import { useCartStore } from "@/store/cart-store";

export function MiniCartDrawer() {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    getSubtotal,
    hasFrozenItems,
  } = useCartStore();
  const panelRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);

  useFocusTrap(isOpen, panelRef);
  useBodyScrollLock(isOpen);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeCart();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, closeCart]);

  const subtotal = getSubtotal();
  const frozenBlocked = hasFrozenItems() && !FROZEN_CHECKOUT_ENABLED;
  const stripeReady = isStripeConfigured();

  const handleCheckout = async () => {
    if (items.length === 0) return;
    if (frozenBlocked || !stripeReady) return;

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
      if (!response.ok) throw new Error(data.error ?? "Checkout failed");
      window.location.href = data.url;
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        type="button"
        className="drawer-overlay absolute inset-0 bg-black/50"
        onClick={closeCart}
        aria-label="Close cart"
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="drawer-panel-right absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-border bg-surface"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-5">
          <h2 className="eyebrow text-ink">Cart ({items.length})</h2>
          <button
            type="button"
            onClick={closeCart}
            className="pressable p-2 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
            aria-label="Close cart drawer"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
            <p className="text-sm text-muted">Your cart is empty.</p>
            <Link href="/shop" onClick={closeCart} className="mt-8">
              <Button>Shop Collection</Button>
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4">
              {items.map((item) => (
                <li key={item.productId} className="flex gap-4 border-b border-border py-5 last:border-0">
                  <div className="relative h-20 w-20 shrink-0 bg-surface-muted">
                    <Image src={item.image} alt={item.name} fill sizes="80px" className="object-contain p-2" />
                  </div>
                  <div className="flex flex-1 flex-col">
                    <Link
                      href={`/products/${item.slug}`}
                      onClick={closeCart}
                      className="text-sm text-ink hover:underline"
                    >
                      {item.name}
                    </Link>
                    <p className="mt-1 text-xs text-muted">
                      {formatUSD(item.price)} each
                    </p>
                    <div className="mt-auto flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="pressable border border-border p-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                      <span className="w-6 text-center text-sm">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="pressable border border-border p-1.5 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" strokeWidth={1.5} />
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

            <div className="border-t border-border px-6 py-5">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Subtotal</span>
                <span className="font-medium text-ink">{formatUSD(subtotal)}</span>
              </div>
              {frozenBlocked && (
                <p className="mt-4 text-xs leading-relaxed text-muted">
                  Frozen items require special shipping.{" "}
                  <Link href="/contact" className="text-ink underline" onClick={closeCart}>
                    Contact us
                  </Link>{" "}
                  to order.
                </p>
              )}
              <Button
                className="mt-5 w-full"
                onClick={handleCheckout}
                disabled={loading || frozenBlocked || !stripeReady}
              >
                {loading ? "Processing..." : "Checkout"}
              </Button>
              <Link
                href="/cart"
                onClick={closeCart}
                className="mt-4 block text-center text-xs uppercase tracking-[0.1em] text-muted hover:text-ink"
              >
                View full cart
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
