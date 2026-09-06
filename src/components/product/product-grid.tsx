import { ProductCard } from "@/components/product/product-card";
import { cn } from "@/lib/utils";
import type { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <p className="py-16 text-center text-sm text-muted">
        No products found in this collection.
      </p>
    );
  }

  const isSmallCatalog = products.length <= 4;

  return (
    <div
      className={cn(
        "grid min-w-0 grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-12 lg:gap-x-8",
        isSmallCatalog ? "lg:grid-cols-2" : "lg:grid-cols-4",
      )}
    >
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} priority={index < 4} />
      ))}
    </div>
  );
}
