import Image from "next/image";
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

const heroTintBg = {
  botanical: "bg-botanical/[0.04]",
  clay: "bg-clay/[0.06]",
  gold: "bg-gold-touch/[0.06]",
} as const;

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
    <>
      <section className={cn("border-b border-border", heroTintBg[tint])}>
        <PageContainer className="py-10 sm:py-12 lg:py-16">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Shop", href: "/shop" },
              { label: collection.name },
            ]}
          />
          <div className="mt-8 grid min-w-0 items-center gap-8 lg:grid-cols-[1fr,min(280px,35%)] lg:gap-12">
            <div className="min-w-0">
              {collection.heroMood && (
                <p className={cn("text-sm", heroTintText[tint])}>
                  {collection.heroMood}
                </p>
              )}
              <h1 className="mt-2 font-display text-4xl text-ink lg:text-5xl">
                {collection.heroHeadline ?? collection.name}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
                {collection.description}
              </p>
            </div>
            {collection.heroImage && (
              <div className="relative hidden aspect-[4/3] overflow-hidden border border-border bg-surface lg:block">
                <Image
                  src={collection.heroImage}
                  alt=""
                  fill
                  sizes="280px"
                  className="object-cover object-center opacity-90"
                  priority
                />
                <div
                  className={cn(
                    "pointer-events-none absolute inset-0 mix-blend-multiply",
                    tint === "botanical" && "bg-botanical/10",
                    tint === "clay" && "bg-clay/10",
                    tint === "gold" && "bg-gold-touch/10",
                  )}
                  aria-hidden
                />
              </div>
            )}
          </div>
        </PageContainer>
      </section>
      <PageContainer className="py-10 sm:py-12 lg:py-16">
        <ProductGrid products={products} />
      </PageContainer>
    </>
  );
}
