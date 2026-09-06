import Link from "next/link";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Button } from "@/components/ui/button";
import { BundlesComingSoon } from "@/components/shop/bundles-coming-soon";
import { ProductGrid } from "@/components/product/product-grid";
import { CategoryChips, SortDropdown } from "@/components/shop/shop-filters";
import { searchProducts } from "@/lib/search-products";
import { sortProducts } from "@/lib/products";
import type { ProductCategory } from "@/types/product";

interface ShopPageProps {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}

export const metadata = {
  title: "Shop",
  description:
    "Browse Magali botanical hair care, wellness oils, and Caribbean food favorites.",
};

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const category = params.category;
  const query = params.q;
  const sort = (params.sort ?? "featured") as
    | "featured"
    | "price-asc"
    | "price-desc"
    | "name";

  let products = query ? await searchProducts(query) : await searchProducts("");

  if (category && category !== "All") {
    products = products.filter(
      (product) => product.category === (category as ProductCategory),
    );
  }

  products = sortProducts(products, sort);

  return (
    <PageContainer className="py-10 sm:py-12 lg:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

      <header className="mb-8 border-b border-border pb-8">
        <h1 className="font-display text-3xl text-ink sm:text-4xl">
          {query ? `“${query}”` : "Shop"}
        </h1>
        {!query && (
          <p className="mt-3 max-w-xl text-sm text-muted">
            Individual products and curated sets. Filter by category or sort below.
          </p>
        )}
        {query && (
          <p className="mt-3 text-sm text-muted">
            {products.length} {products.length === 1 ? "result" : "results"}
          </p>
        )}
      </header>

      {!query && (!category || category === "All") && (
        <div className="mb-10">
          <BundlesComingSoon />
        </div>
      )}

      <div className="mb-8 flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-center sm:justify-between">
        <Suspense fallback={<div className="skeleton h-4 w-48" />}>
          <CategoryChips />
        </Suspense>
        <Suspense fallback={<div className="skeleton h-4 w-32" />}>
          <SortDropdown />
        </Suspense>
      </div>

      <div className="mb-8 flex flex-col items-start justify-between gap-4 border border-border bg-surface-muted p-5 sm:flex-row sm:items-center sm:p-6">
        <div>
          <p className="eyebrow text-botanical">Need guidance?</p>
          <p className="mt-2 font-display text-xl text-ink">
            Not sure where to start?
          </p>
          <p className="mt-2 max-w-md text-sm text-muted">
            Take our quick routine quiz to find the Magali products best suited
            to your hair type and concerns.
          </p>
        </div>
        <Link href="/find-your-routine" className="shrink-0">
          <Button variant="outline">Find your routine</Button>
        </Link>
      </div>

      {products.length === 0 ? (
        <p className="py-20 text-center text-sm text-muted">
          No products match your search.
        </p>
      ) : (
        <ProductGrid products={products} />
      )}
    </PageContainer>
  );
}
