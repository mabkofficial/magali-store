import { notFound } from "next/navigation";
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

  const products = getProductsByCollection(slug as CollectionSlug);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <div className="mb-10 text-center">
        <h1 className="font-display text-4xl font-semibold text-magali-green-950">
          {collection.name}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-magali-ink/60">
          {collection.description}
        </p>
      </div>
      <ProductGrid products={products} />
    </div>
  );
}
