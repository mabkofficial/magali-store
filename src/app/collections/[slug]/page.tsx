import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductGrid } from "@/components/product/product-grid";
import {
  collections,
  getCollectionBySlug,
  getProductsByCollection,
} from "@/lib/products";
import { cn } from "@/lib/utils";
import type { CollectionSlug } from "@/types/product";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

const heroTintText = {
  botanical: "text-botanical",
  clay: "text-clay",
  gold: "text-gold-touch",
} as const;

export function generateStaticParams() {
  return collections.map((collection) => ({ slug: collection.slug }));
}

export async function generateMetadata({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);
  if (!collection) return { title: "Collection Not Found" };

  return {
    title: collection.name,
    description: collection.description,
  };
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const { slug } = await params;
  const collection = getCollectionBySlug(slug);

  if (!collection) {
    notFound();
  }

  const products = await getProductsByCollection(slug as CollectionSlug);
  const tint = collection.heroTint ?? "botanical";

  return (
    <PageContainer className="py-10 sm:py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: collection.name },
        ]}
      />

      <header className="mt-8 border-b border-border pb-8">
        {collection.heroMood && (
          <p className={cn("eyebrow", heroTintText[tint])}>{collection.heroMood}</p>
        )}
        <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
          {collection.heroHeadline ?? collection.name}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">
          {collection.description}
        </p>
        <p className="mt-3 text-xs text-muted">
          {products.length} {products.length === 1 ? "product" : "products"}
        </p>
      </header>

      <div className="mt-10">
        <ProductGrid products={products} />
      </div>
    </PageContainer>
  );
}
