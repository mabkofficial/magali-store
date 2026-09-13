import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageHeader } from "@/components/layout/page-header";
import { BundleGrid } from "@/components/bundle/bundle-grid";
import { getAllBundles } from "@/lib/bundles";

export const metadata = {
  title: "Hair Care Bundles",
  description:
    "Find your routine or stock up on your favourites with Magali hair-care bundles.",
};

export default function BundlesPage() {
  const bundles = getAllBundles();

  return (
    <PageContainer pageY>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: "Hair Care Bundles" },
        ]}
      />
      <PageHeader
        eyebrow="Bundles"
        title="Hair Care Bundles"
        description="Find your routine or stock up on your favourites with Magali hair-care bundles."
        meta={`${bundles.length} bundles`}
      />
      <div className="mt-8">
        <BundleGrid bundles={bundles} />
      </div>
    </PageContainer>
  );
}
