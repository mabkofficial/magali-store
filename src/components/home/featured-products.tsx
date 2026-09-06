import { PageContainer } from "@/components/layout/page-container";
import { ProductGrid } from "@/components/product/product-grid";
import { getFeaturedProducts } from "@/lib/products";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <section className="border-b border-border bg-surface">
      <PageContainer className="py-12 sm:py-16 lg:py-20">
        <div className="mb-6 border-b border-border pb-4">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            Featured products
          </h2>
        </div>
        <ProductGrid products={products} />
      </PageContainer>
    </section>
  );
}
