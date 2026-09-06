import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { ProductGrid } from "@/components/product/product-grid";
import {
  collections,
  getCollectionBySlug,
  getProductsByCollection,
} from "@/lib/products";
import type { CollectionSlug } from "@/types/product";

interface CollectionPageProps {
  params: Promise<{ slug: string }>;
}

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

  return (
    <PageContainer className="py-10 sm:py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: collection.name },
        ]}
      />
      <div className="mb-12 border-b border-border pb-8">
        <p className="eyebrow text-muted">Collection</p>
        <h1 className="mt-2 font-display text-4xl text-ink lg:text-5xl">
          {collection.name}
        </h1>
        <p className="mt-4 max-w-xl text-sm text-muted">{collection.description}</p>
      </div>
      <ProductGrid products={products} />
    </PageContainer>
  );
}
