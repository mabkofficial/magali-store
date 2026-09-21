import Link from "next/link";
import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { BundlesSection } from "@/components/shop/bundles-section";
import { ProductGrid } from "@/components/product/product-grid";
import { CategoryChips, SortDropdown } from "@/components/shop/shop-filters";
import { searchProducts } from "@/lib/search-products";
import { sortProducts } from "@/lib/products";
import type { ProductCategory } from "@/types/product";

interface ShopPageProps {
  searchParams: Promise<{ category?: string; sort?: string; q?: string }>;
}

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Shop All Products",
  description:
    "Shop Magali botanical hair oil, herbal hair grease, PureHeal wellness oil, hair care bundles, and Caribbean beef pies.",
  path: "/shop",
});

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

  const showBundles =
    !query &&
    (!category || category === "All" || category === "Hair Care");

  const resultLabel =
    products.length === 1 ? "1 product" : `${products.length} products`;

  return (
    <PageContainer pageY>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Shop" }]} />

      <PageHeader
        title={query ? `“${query}”` : "Shop"}
        description={
          !query
            ? "Browse by category, sort the grid, and add to cart in one place."
            : undefined
        }
        meta={
          query
            ? `${products.length} ${products.length === 1 ? "result" : "results"}`
            : resultLabel
        }
        eyebrow={query ? undefined : "Catalog"}
        eyebrowClassName="text-muted"
      />

      <div className="-mx-4 mb-10 border-y border-border bg-surface px-4 py-4 sm:mx-0 sm:px-0">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <Suspense fallback={<div className="skeleton h-11 w-48" />}>
            <CategoryChips />
          </Suspense>
          <Suspense fallback={<div className="skeleton h-11 w-40" />}>
            <SortDropdown />
          </Suspense>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="py-16 text-center text-sm text-muted">
          No products match your filters.
        </p>
      ) : (
        <ProductGrid products={products} />
      )}

      {!query && (
        <aside className="mt-16 flex flex-col gap-4 border border-border p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="eyebrow text-muted">Routine quiz</p>
            <p className="mt-2 font-display text-xl text-ink">
              Not sure where to start?
            </p>
            <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
              Answer a few questions and we&apos;ll suggest Magali products for
              your hair type and goals.
            </p>
          </div>
          <Link href="/find-your-routine" className="shrink-0">
            <Button variant="outline">Find your routine</Button>
          </Link>
        </aside>
      )}

      {showBundles && (
        <div className="mt-16 border-t border-border pt-16">
          <BundlesSection />
        </div>
      )}
    </PageContainer>
  );
}
