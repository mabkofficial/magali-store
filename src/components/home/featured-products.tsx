import { ProductGrid } from "@/components/product/product-grid";
import { getFeaturedProducts } from "@/lib/products";

export function FeaturedProducts() {
  const products = getFeaturedProducts();

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h2 className="text-center font-display text-3xl font-semibold text-magali-green-950">
          Featured Products
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-center text-magali-ink/60">
          Explore our complete collection of botanical hair care, wellness oils,
          and Caribbean food favorites.
        </p>
        <div className="mt-10">
          <ProductGrid products={products} />
        </div>
      </div>
    </section>
  );
}
