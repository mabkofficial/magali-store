import { PageContainer } from "@/components/layout/page-container";
import { ProductGrid } from "@/components/product/product-grid";
import { getFeaturedProducts } from "@/lib/products";

export function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="border-b border-border bg-surface">
      <PageContainer className="py-12 sm:py-16 lg:py-20">
        <div className="mb-8 border-b border-border pb-6">
          <p className="eyebrow text-muted">Selected</p>
          <h2 className="mt-2 font-display text-3xl text-ink lg:text-4xl">
            Featured products
          </h2>
        </div>
        <ProductGrid products={products} />
      </PageContainer>
    </section>
  );
}
