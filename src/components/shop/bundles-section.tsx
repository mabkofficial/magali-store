import Link from "next/link";
import { BundleGrid } from "@/components/bundle/bundle-grid";
import { Button } from "@/components/ui/button";
import { getAllBundles } from "@/lib/bundles";

export function BundlesSection() {
  const bundles = getAllBundles();

  return (
    <section className="border-b border-border pb-8" aria-labelledby="bundles-heading">
      <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="eyebrow text-botanical">Bundles</p>
          <h2 id="bundles-heading" className="mt-1 font-display text-2xl text-ink">
            Hair Care Bundles
          </h2>
          <p className="mt-2 max-w-lg text-sm text-muted">
            Find your routine or stock up on your favourites with Magali
            hair-care bundles.
          </p>
        </div>
        <Link href="/bundles" className="shrink-0">
          <Button variant="outline" size="sm">
            View All Bundles
          </Button>
        </Link>
      </div>
      <BundleGrid bundles={bundles} />
    </section>
  );
}
