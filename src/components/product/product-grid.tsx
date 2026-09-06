import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  /** Use compact cards when listing many SKUs (e.g. once bundles launch). */
  compact?: boolean;
}

export function ProductGrid({ products, compact = true }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        No products found in this collection.
      </p>
    );
  }

  return (
    <div
      className={cn(
        "grid min-w-0 grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3 sm:gap-x-4 sm:gap-y-8 lg:grid-cols-4",
        !compact && "lg:grid-cols-3",
      )}
    >
      {products.map((product, index) => (
        <ProductCard
          key={product.id}
          product={product}
          priority={index < 4}
          compact={compact}
        />
      ))}
    </div>
  );
}
