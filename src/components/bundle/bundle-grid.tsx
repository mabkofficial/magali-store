import { BundleCard } from "@/components/bundle/bundle-card";
import type { Bundle } from "@/types/bundle";

interface BundleGridProps {
  bundles: Bundle[];
}

export function BundleGrid({ bundles }: BundleGridProps) {
  return (
    <ul className="grid min-w-0 grid-cols-1 grid-gap sm:grid-cols-2 lg:grid-cols-3">
      {bundles.map((bundle, index) => (
        <li key={bundle.id}>
          <BundleCard bundle={bundle} priority={index < 3} />
        </li>
      ))}
    </ul>
  );
}
