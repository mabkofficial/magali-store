import Link from "next/link";
import { BundleGrid } from "@/components/bundle/bundle-grid";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { getAllBundles } from "@/lib/bundles";

export function BundleRoutineSection() {
  const bundles = getAllBundles();

  return (
    <section className="border-b border-border py-16 lg:py-20" aria-labelledby="bundle-routine-heading">
      <PageContainer>
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow text-muted">Bundles</p>
            <h2
              id="bundle-routine-heading"
              className="mt-2 font-display text-3xl text-ink lg:text-4xl"
            >
              Build Your Hair-Care Routine
            </h2>
            <p className="mt-3 max-w-lg text-sm text-muted">
              Find your routine or stock up on your favourites with Magali
              hair-care bundles.
            </p>
          </div>
          <Link href="/bundles" className="shrink-0">
            <Button variant="outline">View All Bundles</Button>
          </Link>
        </div>
        <BundleGrid bundles={bundles} />
      </PageContainer>
    </section>
  );
}
