"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FROZEN_CHECKOUT_ENABLED } from "@/config/site";
import {
  calculateFbtPricing,
  getFbtSectionMeta,
  getRoutineStepLabel,
} from "@/lib/fbt-config";
import { useAddMultipleToCart } from "@/hooks/use-cart-ui";
import {
  trackFbtCompanionToggle,
  trackFbtImpression,
} from "@/lib/analytics";
import { formatUSD } from "@/lib/currency";
import { getPrimaryImageUrl } from "@/lib/products/images";
import { cn } from "@/lib/utils";
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

function BundleSeparator() {
  return (
    <div
      className="flex shrink-0 items-center self-center px-1"
      aria-hidden
    >
      <Plus className="h-3.5 w-3.5 text-muted" strokeWidth={1.5} />
    </div>
  );
}

export function FrequentlyBoughtTogether({
  bundle,
  surface = "pdp",
  className,
}: FrequentlyBoughtTogetherProps) {
  const addMultiple = useAddMultipleToCart(surface);
  const { anchor, companions } = bundle;
  const meta = getFbtSectionMeta(anchor.id);
  const fieldsetId = useId();
  const liveRef = useRef<HTMLParagraphElement>(null);
  const [liveMessage, setLiveMessage] = useState("");

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
  const pricing = calculateFbtPricing(selectedProducts);

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

  useEffect(() => {
    if (selectedProducts.length === 0) {
      setLiveMessage("No items selected.");
      return;
    }

    const savingsText = pricing.qualifiesForDiscount
      ? `, you save ${formatUSD(pricing.discount)}`
      : "";

    setLiveMessage(
      `${selectedProducts.length} items selected, total ${formatUSD(pricing.total)}${savingsText}.`,
    );
  }, [selectedProducts.length, pricing.total, pricing.discount, pricing.qualifiesForDiscount]);

  const handleAddSelected = () => {
    addMultiple(selectedProducts, undefined, { applyFbtDiscount: pricing.qualifiesForDiscount });
    setLiveMessage(
      `${selectedProducts.length} items added to cart${
        pricing.qualifiesForDiscount
          ? ` with ${formatUSD(pricing.discount)} routine savings`
          : ""
      }.`,
    );
  };

  return (
    <section className={cn("border-t border-border pt-8", className)}>
      <p className="eyebrow text-muted">{meta.title}</p>
      <p className="mt-2 text-sm leading-relaxed text-muted">{meta.description}</p>

      <fieldset className="mt-4 min-w-0 border-0 p-0">
        <legend className="sr-only">{meta.legend}</legend>

        <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-center md:gap-x-4 md:gap-y-3">
          <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-stretch md:gap-2">
            {allProducts.map((product, index) => {
              const isAnchor = product.id === anchor.id;
              const blocked = isProductBlocked(product);
              const unavailable = isProductUnavailable(product);
              const isDisabled = blocked || unavailable;
              const checked = isAnchor || selectedIds.has(product.id);
              const checkboxId = `${fieldsetId}-${product.id}`;
              const routineStep = getRoutineStepLabel(anchor.id, product.id);

              return (
                <div key={product.id} className="flex items-stretch">
                  {index > 0 && (
                    <div className="hidden sm:flex">
                      <BundleSeparator />
                    </div>
                  )}

                  <div
                    className={cn(
                      "flex w-full min-w-0 items-center gap-3 border bg-surface p-3 sm:w-auto sm:max-w-[14rem]",
                      isAnchor && "border-ink",
                      !isAnchor && checked && !isDisabled && "border-ink",
                      !isAnchor && !checked && !isDisabled && "border-border",
                      isDisabled && "border-border opacity-60",
                    )}
                  >
                    {!isAnchor && !isDisabled && (
                      <input
                        id={checkboxId}
                        type="checkbox"
                        checked={checked}
                        onChange={(event) =>
                          toggleCompanion(product.id, event.target.checked)
                        }
                        className="h-4 w-4 shrink-0 accent-ink"
                      />
                    )}

                    <Link
                      href={`/products/${product.slug}`}
                      className="relative h-14 w-14 shrink-0 bg-surface-muted"
                    >
                      <Image
                        src={getPrimaryImageUrl(product.images)}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-contain p-2"
                      />
                    </Link>

                    <div className="min-w-0 flex-1">
                      {!isAnchor && !isDisabled ? (
                        <label
                          htmlFor={checkboxId}
                          className="block cursor-pointer"
                        >
                          {routineStep && (
                            <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
                              {routineStep}
                            </span>
                          )}
                          <span className="mt-0.5 block line-clamp-2 text-sm leading-snug text-ink">
                            {product.shortName}
                          </span>
                        </label>
                      ) : (
                        <>
                          {isAnchor && (
                            <span className="text-[10px] uppercase tracking-[0.12em] text-muted">
                              This item · {routineStep}
                            </span>
                          )}
                          <Link
                            href={`/products/${product.slug}`}
                            className="mt-0.5 block line-clamp-2 text-sm leading-snug text-ink hover:underline"
                          >
                            {product.shortName}
                          </Link>
                        </>
                      )}
                      <p className="mt-0.5 text-xs font-medium text-ink">
                        {formatUSD(product.price)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="hidden h-10 w-px shrink-0 bg-border md:block" aria-hidden />

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <div>
              {pricing.qualifiesForDiscount ? (
                <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <span className="text-sm text-muted line-through">
                    {formatUSD(pricing.subtotal)}
                  </span>
                  <span className="font-display text-2xl leading-none text-ink">
                    {formatUSD(pricing.total)}
                  </span>
                </div>
              ) : (
                <p className="font-display text-2xl leading-none text-ink">
                  {formatUSD(pricing.total)}
                </p>
              )}
              {pricing.qualifiesForDiscount && (
                <Badge className="mt-2 border border-gold-touch/30 bg-gold-touch/10 text-gold-touch hover:bg-gold-touch/10">
                  You save {formatUSD(pricing.discount)}
                </Badge>
              )}
            </div>

            <Button
              type="button"
              size="lg"
              onClick={handleAddSelected}
              disabled={selectedProducts.length === 0}
              className="w-full shrink-0 sm:w-auto"
            >
              Add all to cart
            </Button>
          </div>
        </div>
      </fieldset>

      <p className="mt-3 text-xs leading-relaxed text-muted">{meta.helperText}</p>

      <p ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="true">
        {liveMessage}
      </p>
    </section>
  );
}
