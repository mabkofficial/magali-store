"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAddToCart } from "@/hooks/use-cart-ui";
import { trackFbtAddToCart, trackFbtImpression } from "@/lib/analytics";
import { formatUSD } from "@/lib/currency";
import { getPrimaryImageUrl } from "@/lib/products/images";
import { cn } from "@/lib/utils";
import type { FbtSurface, Product } from "@/types/product";

interface CartFbtSuggestionsProps {
  cartProductIds: string[];
  surface?: FbtSurface;
  className?: string;
  compact?: boolean;
}

function FbtSuggestionSkeleton({ compact }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "animate-pulse border border-border bg-surface-muted/30",
        compact ? "h-[4.5rem]" : "h-20",
      )}
    />
  );
}

export function CartFbtSuggestions({
  cartProductIds,
  surface = "cart",
  className,
  compact = false,
}: CartFbtSuggestionsProps) {
  const addToCart = useAddToCart();
  const [suggestions, setSuggestions] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (cartProductIds.length === 0) {
      setSuggestions([]);
      setLoaded(false);
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
        const nextSuggestions = data.suggestions ?? [];
        setSuggestions(nextSuggestions);

        if (nextSuggestions.length) {
          trackFbtImpression(
            cartProductIds.join(","),
            nextSuggestions.map((product) => product.id),
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
          setLoaded(true);
        }
      }
    }

    loadSuggestions();
    return () => controller.abort();
  }, [cartProductIds, surface]);

  if (!loading && loaded && suggestions.length === 0) return null;

  return (
    <section
      className={cn(className)}
      aria-label="Complete your order"
      aria-busy={loading}
    >
      <p className={cn("eyebrow text-muted", compact && "text-[10px]")}>
        Complete your order
      </p>

      {loading ? (
        <div className={cn("mt-3 space-y-2", compact && "mt-2")}>
          <FbtSuggestionSkeleton compact={compact} />
          {!compact && <FbtSuggestionSkeleton />}
        </div>
      ) : (
        <ul
          className={cn(
            compact
              ? "mt-2 space-y-2"
              : "mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-1",
          )}
        >
          {suggestions.map((product) => (
            <li
              key={product.id}
              className={cn(
                "flex items-center gap-3 border border-border bg-surface p-3",
                compact && "gap-2.5 p-2.5",
              )}
            >
              <div
                className={cn(
                  "relative shrink-0 bg-surface-muted",
                  compact ? "h-14 w-14" : "h-16 w-16",
                )}
              >
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
                  className={cn(
                    "line-clamp-2 text-ink hover:underline",
                    compact ? "text-xs leading-snug" : "text-sm",
                  )}
                >
                  {product.shortName}
                </Link>
                <p className="mt-0.5 text-xs text-muted">{formatUSD(product.price)}</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className={cn(compact && "px-3 text-[10px]")}
                onClick={() => {
                  addToCart(product, 1);
                  trackFbtAddToCart([product.id], product.price, surface);
                }}
              >
                <Plus className="mr-1 h-3 w-3" strokeWidth={1.5} />
                Add
              </Button>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
