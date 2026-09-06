"use client";

import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { categoryToCollection } from "@/config/site";
import { useAddToCart } from "@/hooks/use-cart-ui";
import { formatUSD } from "@/lib/currency";
import { getPrimaryImageUrl } from "@/lib/products/images";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
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
          className="product-image-primary object-contain p-4 sm:p-6"
        />
        {secondaryImage && (
          <Image
            src={secondaryImage}
            alt={product.images[1]?.alt || `${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="product-image-secondary hidden object-contain p-4 sm:p-6 lg:block"
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col pt-4">
        <Link href={`/collections/${categoryToCollection[product.category]}`} className="cursor-pointer">
          <Badge category={product.category}>{product.category}</Badge>
        </Link>
        <Link href={`/products/${product.slug}`} className="cursor-pointer">
          <h3 className="mt-2 line-clamp-2 font-display text-base leading-snug text-ink">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-muted">{product.size}</p>
        <div className="mt-auto flex items-baseline justify-between gap-3 pt-4">
          <span className="text-sm font-medium text-ink">{formatUSD(product.price)}</span>
          {isOutOfStock ? (
            <span className="eyebrow text-muted">Out of stock</span>
          ) : (
            <button
              type="button"
              onClick={handleQuickAdd}
              className="eyebrow shrink-0 cursor-pointer text-ink underline-offset-4 hover:underline"
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
