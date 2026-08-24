import { Suspense } from "react";
import { ProductGrid } from "@/components/product/product-grid";
import { CategoryChips, SortDropdown } from "@/components/shop/shop-filters";
import { getAllProducts, sortProducts } from "@/lib/products";
import type { ProductCategory } from "@/types/product";

interface ShopPageProps {
  searchParams: Promise<{ category?: string; sort?: string }>;
}

export const metadata = {
  title: "Shop All Products",
  description:
    "Browse Magali botanical hair care, wellness oils, and Caribbean food favorites.",
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category;
  const sort = (params.sort ?? "featured") as
    | "featured"
    | "price-asc"
    | "price-desc"
    | "name";

  let products = getAllProducts();

  if (category && category !== "All") {
    products = products.filter(
      (product) => product.category === (category as ProductCategory),
    );
  }

  products = sortProducts(products, sort);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-semibold text-magali-green-950">
          Shop All Products
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-magali-ink/60">
          Discover our complete collection of botanical hair care, targeted
          wellness products, and Caribbean-style food favorites.
        </p>
      </div>

      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Suspense fallback={<div className="h-10" />}>
          <CategoryChips />
        </Suspense>
        <Suspense fallback={<div className="h-10" />}>
          <SortDropdown />
        </Suspense>
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
