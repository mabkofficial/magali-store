"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { categoryToCollection } from "@/config/site";
import { formatUSD } from "@/lib/currency";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types/product";

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

function getBadgeVariant(category: Product["category"]) {
  if (category === "Food") return "food";
  if (category === "Wellness") return "wellness";
  return "default";
}

export function ProductCard({ product, priority = false }: ProductCardProps) {
  const [hovered, setHovered] = useState(false);
  const addItem = useCartStore((state) => state.addItem);

  const handleQuickAdd = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    addItem(product);
    toast.success(`${product.shortName} added to cart`);
  };

  return (
    <article className="group flex flex-col">
      <Link
        href={`/products/${product.slug}`}
        className="relative mb-4 block aspect-square overflow-hidden rounded-2xl bg-white shadow-sm"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <Image
          src={product.images[0]}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className={cn(
            "object-contain p-4 transition-opacity duration-300",
            hovered && product.images[1] ? "opacity-0" : "opacity-100",
          )}
        />
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={cn(
              "object-contain p-4 transition-opacity duration-300",
              hovered ? "opacity-100" : "opacity-0",
            )}
          />
        )}
      </Link>

      <div className="flex flex-1 flex-col">
        <Link href={`/collections/${categoryToCollection[product.category]}`}>
          <Badge variant={getBadgeVariant(product.category)}>
            {product.category}
          </Badge>
        </Link>
        <Link href={`/products/${product.slug}`}>
          <h3 className="mt-2 font-display text-lg font-medium text-magali-green-950 group-hover:text-magali-gold-600">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-sm text-magali-ink/60">{product.size}</p>
        <div className="mt-auto flex items-center justify-between pt-4">
          <span className="text-lg font-semibold text-magali-green-950">
            {formatUSD(product.price)}
          </span>
          <Button size="sm" onClick={handleQuickAdd} aria-label={`Add ${product.name} to cart`}>
            Quick Add
          </Button>
        </div>
      </div>
    </article>
  );
}
