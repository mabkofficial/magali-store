import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { SquareImageFrame } from "@/components/ui/square-image-frame";
import { collections } from "@/lib/products";

const collectionImages: Record<string, string> = {
  "hair-care": "/images/products/hair-oil/01-hero-white.png",
  wellness: "/images/products/pureheal-oil/01-hero-white.png",
  food: "/images/products/beef-pies/01-package-white.png",
};

export function CategoryCards() {
  return (
    <section className="border-b border-border bg-surface-muted">
      <PageContainer className="py-12 sm:py-16 lg:py-20">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-border pb-6">
          <h2 className="font-display text-3xl text-ink lg:text-4xl">
            Shop by category
          </h2>
          <Link
            href="/shop"
            className="eyebrow shrink-0 text-muted transition-opacity hover:text-ink"
          >
            View all
          </Link>
        </div>

        <div className="grid min-w-0 gap-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {collections.map((collection) => (
            <Link
              key={collection.slug}
              href={`/collections/${collection.slug}`}
              className="group min-w-0 cursor-pointer bg-surface"
            >
              <SquareImageFrame
                src={collectionImages[collection.slug]}
                alt={collection.name}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                padding="md"
              />
              <div className="border border-t-0 border-border px-4 py-4">
                <p className="text-sm font-medium text-ink">{collection.name}</p>
                <p className="mt-2 line-clamp-2 text-sm text-muted">
                  {collection.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
