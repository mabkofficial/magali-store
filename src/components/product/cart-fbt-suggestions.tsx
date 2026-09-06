"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-cart-ui";
import { trackFbtAddToCart, trackFbtImpression } from "@/lib/analytics";
import { formatUSD } from "@/lib/currency";
import { getPrimaryImageUrl } from "@/lib/products/images";
import type { FbtSurface, Product } from "@/types/product";

interface CartFbtSuggestionsProps {
  cartProductIds: string[];
  surface?: FbtSurface;
  className?: string;
}

export function CartFbtSuggestions({
  cartProductIds,
  surface = "cart",
  className,
}: CartFbtSuggestionsProps) {
  const addToCart = useAddToCart();
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (cartProductIds.length === 0) {
      setSuggestions([]);
      return;
    }

    const controller = new AbortController();

    async function loadSuggestions() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          ids: cartProductIds.join(","),
        });
        const response = await fetch(`/api/products/fbt/cart?${params}`, {
          signal: controller.signal,
        });

        if (!response.ok) return;

        const data = (await response.json()) as { suggestions: Product[] };
        setSuggestions(data.suggestions ?? []);

        if (data.suggestions?.length) {
          trackFbtImpression(
            cartProductIds.join(","),
            data.suggestions.map((product) => product.id),
            surface,
          );
        }
      } catch {
        if (!controller.signal.aborted) {
          setSuggestions([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadSuggestions();
    return () => controller.abort();
  }, [cartProductIds, surface]);

  if (loading || suggestions.length === 0) return null;

  return (
    <section className={className} aria-label="Complete your order">
      <p className="eyebrow text-muted">Complete your order</p>
      <ul className="mt-4 space-y-4">
        {suggestions.map((product) => (
          <li
            key={product.id}
            className="flex items-center gap-3 border border-border p-3"
          >
            <div className="relative h-16 w-16 shrink-0 bg-surface-muted">
              <Image
                src={getPrimaryImageUrl(product.images)}
                alt={product.name}
                fill
                sizes="64px"
                className="object-contain p-1.5"
              />
            </div>
            <div className="min-w-0 flex-1">
              <Link
                href={`/products/${product.slug}`}
                className="line-clamp-2 text-sm text-ink hover:underline"
              >
                {product.shortName}
              </Link>
              <p className="mt-1 text-xs text-muted">{formatUSD(product.price)}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                addToCart(product, 1);
                trackFbtAddToCart([product.id], product.price, surface);
              }}
            >
              Add
            </Button>
          </li>
        ))}
      </ul>
    </section>
  );
}
