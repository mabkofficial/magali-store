import { notFound } from "next/navigation";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
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
    <PageContainer pageY>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: collection.name },
        ]}
      />

      <PageHeader
        eyebrow={collection.heroMood}
        eyebrowClassName={cn(heroTintText[tint])}
        title={collection.heroHeadline ?? collection.name}
        description={collection.description}
        meta={`${products.length} ${products.length === 1 ? "product" : "products"}`}
      />

      <div className="mt-8">
        <ProductGrid products={products} />
      </div>
    </PageContainer>
  );
}
