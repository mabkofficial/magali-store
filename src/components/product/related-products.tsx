import { ProductCard } from "@/components/product/product-card";
import type { Product } from "@/types/product";

interface RelatedProductsProps {
  products: Product[];
}

export function RelatedProducts({ products }: RelatedProductsProps) {
  if (products.length === 0) return null;

  return (
    <section className="mt-16 border-t border-magali-cream-100 pt-16">
      <h2 className="font-display text-2xl font-semibold text-magali-green-950">
        You May Also Like
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-8 sm:grid-cols-2">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
