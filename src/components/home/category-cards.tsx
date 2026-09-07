import Link from "next/link";
import { SectionShell } from "@/components/layout/section-shell";
import { SquareImageFrame } from "@/components/ui/square-image-frame";
import { collections } from "@/lib/products";

const collectionImages: Record<string, string> = {
  "hair-care": "/images/products/hair-oil/03-botanical-lifestyle.png",
  wellness: "/images/products/pureheal-oil/02-botanical-still-life.png",
  food: "/images/products/beef-pies/03-plated-cooked-pies.png",
};

export function CategoryCards() {
  return (
    <SectionShell muted>
      <div className="page-header flex items-end justify-between gap-4">
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

      <div className="grid min-w-0 grid-gap sm:grid-cols-2 lg:grid-cols-3">
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
              padding="none"
              imageClassName="object-cover"
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
    </SectionShell>
  );
}
