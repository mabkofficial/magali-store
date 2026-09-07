"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { categoryToCollection } from "@/config/site";
import { useAddToCart } from "@/hooks/use-cart-ui";
import { formatUSD } from "@/lib/currency";
import { getPrimaryImageUrl } from "@/lib/products/images";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
  compact?: boolean;
}

export function ProductCard({
  product,
  priority = false,
  compact = true,
}: ProductCardProps) {
  const addToCart = useAddToCart();

  const isOutOfStock = product.inventoryCount <= 0;

  const handleQuickAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    if (isOutOfStock) return;
    addToCart(product);
  };

  const primaryImage = getPrimaryImageUrl(product.images);
  const secondaryImage = product.images[1]?.url;

  return (
    <article className="group flex min-w-0 flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="product-card-hover relative block aspect-square w-full min-w-0 overflow-hidden border border-border bg-surface-muted"
      >
        <Image
          src={primaryImage}
          alt={product.images[0]?.alt || product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={cn(
            "product-image-primary object-contain",
            compact ? "p-2 sm:p-3" : "p-4 sm:p-6",
          )}
        />
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={product.images[1]?.alt || `${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={cn(
              "product-image-secondary hidden object-contain lg:block",
              compact ? "p-2 sm:p-3" : "p-4 sm:p-6",
            )}
          />
        )}
      </Link>

      <div className={cn("flex flex-1 flex-col", compact ? "pt-2" : "pt-4")}>
        <Link href={`/collections/${categoryToCollection[product.category]}`} className="cursor-pointer">
          <Badge category={product.category} className="text-[10px]">
            {product.category}
          </Badge>
        </Link>
        <Link href={`/products/${product.slug}`} className="cursor-pointer">
          <h3
            className={cn(
              "mt-1.5 line-clamp-2 leading-snug text-ink",
              compact
                ? "text-sm font-medium"
                : "font-display text-base",
            )}
          >
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-[11px] text-muted">{product.size}</p>
        <div
          className={cn(
            "mt-auto flex items-baseline justify-between gap-2",
            compact ? "pt-2" : "pt-4",
          )}
        >
          <span className="text-sm font-medium text-ink">{formatUSD(product.price)}</span>
          {isOutOfStock ? (
            <span className="text-[10px] uppercase tracking-[0.1em] text-muted">
              Out of stock
            </span>
          ) : (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="text-[10px] uppercase tracking-[0.1em] text-ink underline-offset-4 hover:underline"
              aria-label={`Add ${product.name} to cart`}
            >
              Add
            </button>
          )}
        </div>
      </div>
    </article>
  );
}
