import { SectionShell } from "@/components/layout/section-shell";
import { ProductGrid } from "@/components/product/product-grid";
import { getFeaturedProducts } from "@/lib/products";

export async function FeaturedProducts() {
  const products = await getFeaturedProducts();

  return (
    <SectionShell>
      <div className="page-header">
        <h2 className="font-display text-2xl text-ink sm:text-3xl">
          Featured products
        </h2>
      </div>
      <ProductGrid products={products} />
    </SectionShell>
  );
}
