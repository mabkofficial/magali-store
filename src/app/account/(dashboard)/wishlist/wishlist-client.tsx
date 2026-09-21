"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { formatUSD } from "@/lib/currency";
import type { WishlistEntry } from "@/lib/customer/wishlist";
import { getBundleById } from "@/lib/bundles/catalog";
import { getProductByIdSync } from "@/lib/products/sync";
import { useCartStore } from "@/store/cart-store";

export function WishlistClient({ items }: { items: WishlistEntry[] }) {
  const addItem = useCartStore((s) => s.addItem);
  const addBundle = useCartStore((s) => s.addBundle);
  const openCart = useCartStore((s) => s.openCart);
  const router = useRouter();

  const remove = async (entry: WishlistEntry) => {
    const body =
      entry.kind === "product"
        ? { productId: entry.productId }
        : { bundleId: entry.bundleId };
    await fetch("/api/account/wishlist", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    router.refresh();
  };

  const addOne = (entry: WishlistEntry) => {
    if (!entry.active) {
      toast.error("This item is unavailable.");
      return;
    }
    if (entry.kind === "bundle") {
      const bundle = getBundleById(entry.bundleId);
      if (bundle) addBundle(bundle);
    } else {
      const product = getProductByIdSync(entry.productId);
      if (product) addItem(product);
    }
    toast.success("Added to cart");
    openCart();
  };

  const addAll = () => {
    let added = 0;
    for (const entry of items) {
      if (!entry.active) continue;
      if (entry.kind === "bundle") {
        const bundle = getBundleById(entry.bundleId);
        if (bundle) {
          addBundle(bundle);
          added += 1;
        }
      } else {
        const product = getProductByIdSync(entry.productId);
        if (product?.isActive && product.inventoryCount > 0) {
          addItem(product);
          added += 1;
        }
      }
    }
    if (added === 0) {
      toast.error("No available items to add.");
      return;
    }
    toast.success(`Added ${added} item${added === 1 ? "" : "s"} to cart`);
    openCart();
  };

  if (!items.length) {
    return (
      <p className="mt-6 text-sm text-muted">
        Save products and bundles with the heart icon while you shop.{" "}
        <Link href="/shop" className="text-ink underline underline-offset-4">
          Browse the shop
        </Link>
      </p>
    );
  }

  return (
    <div className="mt-6 space-y-6">
      <Button type="button" variant="outline" onClick={addAll}>
        Add all to cart
      </Button>
      <ul className="grid gap-6 sm:grid-cols-2">
        {items.map((entry) => (
          <li key={entry.id} className="flex gap-4 border border-border p-4">
            <Link
              href={
                entry.kind === "product"
                  ? `/products/${entry.slug}`
                  : `/products/${entry.slug}`
              }
              className="relative h-24 w-24 shrink-0 border border-border bg-surface-muted"
            >
              <Image src={entry.image} alt="" fill className="object-contain p-2" />
            </Link>
            <div className="flex min-w-0 flex-1 flex-col">
              <Link
                href={`/products/${entry.slug}`}
                className="line-clamp-2 font-medium text-ink"
              >
                {entry.name}
              </Link>
              <p className="mt-1 text-sm text-muted">{formatUSD(entry.price)}</p>
              {!entry.active && (
                <p className="mt-1 text-xs text-muted">Currently unavailable</p>
              )}
              <div className="mt-auto flex flex-wrap gap-2 pt-3">
                <Button
                  type="button"
                  size="sm"
                  disabled={!entry.active}
                  onClick={() => addOne(entry)}
                >
                  Add to cart
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => void remove(entry)}
                >
                  Remove
                </Button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
