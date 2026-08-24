import Image from "next/image";
import Link from "next/link";
import { collections } from "@/lib/products";

const collectionImages: Record<string, string> = {
  "hair-care": "/images/products/hair-oil/03-botanical-lifestyle.png",
  wellness: "/images/products/pureheal-oil/02-botanical-still-life.png",
  food: "/images/products/beef-pies/03-plated-cooked-pies.png",
};

export function CategoryCards() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <h2 className="text-center font-display text-3xl font-semibold text-magali-green-950">
        Shop by Category
      </h2>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {collections.map((collection) => (
          <Link
            key={collection.slug}
            href={`/collections/${collection.slug}`}
            className="group overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="relative aspect-[4/3]">
              <Image
                src={collectionImages[collection.slug]}
                alt={collection.name}
                fill
                sizes="(max-width: 768px) 100vw, 33vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-6">
              <h3 className="font-display text-xl font-semibold text-magali-green-950">
                {collection.name}
              </h3>
              <p className="mt-2 text-sm text-magali-ink/60">
                {collection.description}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
