"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FROZEN_CHECKOUT_ENABLED } from "@/config/site";
import { useAddMultipleToCart } from "@/hooks/use-cart-ui";
import {
  trackFbtCompanionToggle,
  trackFbtImpression,
} from "@/lib/analytics";
import { formatUSD } from "@/lib/currency";
import { getPrimaryImageUrl } from "@/lib/products/images";
import type { FbtBundle, FbtSurface, Product } from "@/types/product";

interface FrequentlyBoughtTogetherProps {
  bundle: FbtBundle;
  surface?: FbtSurface;
  className?: string;
}

function isProductBlocked(product: Product): boolean {
  return product.shippingClass === "frozen" && !FROZEN_CHECKOUT_ENABLED;
}

function isProductUnavailable(product: Product): boolean {
  return product.inventoryCount <= 0;
}

export function FrequentlyBoughtTogether({
  bundle,
  surface = "pdp",
  className,
}: FrequentlyBoughtTogetherProps) {
  const addMultiple = useAddMultipleToCart(surface);
  const { anchor, companions } = bundle;

  const selectableCompanions = useMemo(
    () =>
      companions.filter(
        (product) => !isProductBlocked(product) && !isProductUnavailable(product),
      ),
    [companions],
  );

  const [selectedIds, setSelectedIds] = useState<Set<string>>(() =>
    new Set(selectableCompanions.map((product) => product.id)),
  );

  useEffect(() => {
    setSelectedIds(new Set(selectableCompanions.map((product) => product.id)));
  }, [selectableCompanions]);

  useEffect(() => {
    trackFbtImpression(
      anchor.id,
      selectableCompanions.map((product) => product.id),
      surface,
    );
  }, [anchor.id, selectableCompanions, surface]);

  if (selectableCompanions.length === 0) return null;

  const allProducts = [anchor, ...selectableCompanions];
  const selectedProducts = allProducts.filter(
    (product) => product.id === anchor.id || selectedIds.has(product.id),
  );
  const total = selectedProducts.reduce((sum, product) => sum + product.price, 0);

  const toggleCompanion = (productId: string, checked: boolean) => {
    trackFbtCompanionToggle(productId, checked, surface);
    setSelectedIds((current) => {
      const next = new Set(current);
      if (checked) {
        next.add(productId);
      } else {
        next.delete(productId);
      }
      return next;
    });
  };

  const handleAddSelected = () => {
    addMultiple(selectedProducts);
  };

  return (
    <section
      className={className}
      aria-label="Frequently bought together"
    >
      <p className="eyebrow text-muted">Frequently bought together</p>

      <div className="mt-6 flex flex-wrap items-center gap-3 sm:gap-4">
        {allProducts.map((product, index) => {
          const isAnchor = product.id === anchor.id;
          const blocked = isProductBlocked(product);
          const unavailable = isProductUnavailable(product);
          const checked = isAnchor || selectedIds.has(product.id);

          return (
            <div key={product.id} className="flex items-center gap-3 sm:gap-4">
              {index > 0 && (
                <Plus
                  className="hidden h-4 w-4 shrink-0 text-muted sm:block"
                  strokeWidth={1.5}
                  aria-hidden
                />
              )}
              <div className="flex min-w-0 items-start gap-3">
                {!isAnchor && !blocked && !unavailable && (
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={(event) =>
                      toggleCompanion(product.id, event.target.checked)
                    }
                    className="mt-5 h-4 w-4 shrink-0 accent-ink"
                    aria-label={`Include ${product.shortName}`}
                  />
                )}
                <Link
                  href={`/products/${product.slug}`}
                  className="group flex min-w-0 max-w-[7.5rem] flex-col sm:max-w-[8.5rem]"
                >
                  <div className="relative aspect-square w-full bg-surface-muted">
                    <Image
                      src={getPrimaryImageUrl(product.images)}
                      alt={product.name}
                      fill
                      sizes="120px"
                      className="object-contain p-2 transition-opacity group-hover:opacity-80"
                    />
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-snug text-ink group-hover:underline">
                    {product.shortName}
                  </p>
                  <p className="mt-1 text-xs text-muted">{formatUSD(product.price)}</p>
                  {blocked && (
                    <p className="mt-1 text-[10px] leading-snug text-muted">
                      Contact to order
                    </p>
                  )}
                  {unavailable && (
                    <p className="mt-1 text-[10px] leading-snug text-muted">
                      Out of stock
                    </p>
                  )}
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink">
          Total:{" "}
          <span className="font-medium">{formatUSD(total)}</span>
        </p>
        <Button
          type="button"
          onClick={handleAddSelected}
          disabled={selectedProducts.length === 0}
          className="sm:min-w-[12rem]"
        >
          Add selected to cart
        </Button>
      </div>
    </section>
  );
}
