import bundlesData from "@/data/bundles.json";
import { normalizeProductImages } from "@/lib/products/images";
import type { Bundle, BundleFaq } from "@/types/bundle";
import type { CartItem } from "@/types/product";

type RawBundle = Omit<Bundle, "images"> & {
  images: { src?: string; url?: string; alt?: string; sort?: number }[];
};

const bundles = (bundlesData.bundles as RawBundle[]).map((bundle) => ({
  ...bundle,
  images: normalizeProductImages(
    bundle.images.map((image, index) => ({
      url: image.url ?? image.src ?? "",
      alt: image.alt ?? "",
      sort: image.sort ?? index,
    })),
  ),
})) as Bundle[];

export const BUNDLE_DISPLAY_ORDER = [
  "MAG-BUNDLE-DUO",
  "MAG-BUNDLE-OIL-2",
  "MAG-BUNDLE-STOCK-UP",
] as const;

export const SHARED_BUNDLE_FAQS: BundleFaq[] = [
  {
    question: "Are these full-size products?",
    answer:
      "Yes. Hair Oil bottles contain 250 ml each and Hair Grease jars contain 185 g each.",
  },
  {
    question: "Is an applicator included?",
    answer:
      "No. These bundles contain only the products listed under What's Included.",
  },
  {
    question: "Can I change the products in a bundle?",
    answer:
      "These are fixed sets. Individual products can be purchased separately.",
  },
  {
    question: "Is shipping included?",
    answer: "Shipping is calculated at checkout.",
  },
];

export function getAllBundles(): Bundle[] {
  return BUNDLE_DISPLAY_ORDER.map((id) => getBundleById(id)).filter(
    (bundle): bundle is Bundle => bundle !== undefined,
  );
}

export function getBundleById(id: string): Bundle | undefined {
  return bundles.find((bundle) => bundle.id === id);
}

export function getBundleBySlug(slug: string): Bundle | undefined {
  return bundles.find((bundle) => bundle.slug === slug);
}

export function getAllBundleSlugs(): string[] {
  return bundles.map((bundle) => bundle.slug);
}

export function bundlePrice(bundle: Bundle): number {
  return bundle.priceCents / 100;
}

export function bundleSeparateTotal(bundle: Bundle): number {
  return bundle.referenceSeparateTotalCents / 100;
}

export function bundleSavings(bundle: Bundle): number {
  return bundle.referenceSavingsCents / 100;
}

export function getBundlesForProduct(productId: string): Bundle[] {
  if (productId === "hair-oil") {
    return getAllBundles().filter(
      (bundle) =>
        bundle.id === "MAG-BUNDLE-DUO" || bundle.id === "MAG-BUNDLE-OIL-2",
    );
  }

  if (productId === "hair-grease") {
    return getAllBundles().filter(
      (bundle) =>
        bundle.id === "MAG-BUNDLE-DUO" ||
        bundle.id === "MAG-BUNDLE-STOCK-UP",
    );
  }

  return [];
}

export function getCartLineKey(item: CartItem): string {
  return item.bundleId ?? item.productId ?? "";
}

export function isBundleCartItem(item: CartItem): boolean {
  return Boolean(item.bundleId);
}

export type ComponentDemandLine = {
  bundleId?: string;
  productId?: string;
  quantity: number;
};

export function computeComponentDemand(
  lines: ComponentDemandLine[],
): Map<string, number> {
  const demand = new Map<string, number>();

  for (const line of lines) {
    if (line.bundleId) {
      const bundle = getBundleById(line.bundleId);
      if (!bundle) continue;

      for (const component of bundle.components) {
        demand.set(
          component.productId,
          (demand.get(component.productId) ?? 0) +
            component.quantity * line.quantity,
        );
      }
      continue;
    }

    if (line.productId) {
      demand.set(
        line.productId,
        (demand.get(line.productId) ?? 0) + line.quantity,
      );
    }
  }

  return demand;
}

export function expandCartToDemandLines(items: CartItem[]): ComponentDemandLine[] {
  return items.map((item) =>
    item.bundleId
      ? { bundleId: item.bundleId, quantity: item.quantity }
      : { productId: item.productId, quantity: item.quantity },
  );
}

export function getExpandedProductIdsFromCart(items: CartItem[]): string[] {
  const demand = computeComponentDemand(expandCartToDemandLines(items));
  return [...demand.keys()];
}

export function getBundleMetadataEntry(bundleId: string, quantity: number): string {
  return `bundle:${bundleId}:${quantity}`;
}

export function parseCartMetadataEntry(entry: string): {
  type: "product" | "bundle";
  id: string;
  quantity: number;
} | null {
  if (entry.startsWith("bundle:")) {
    const [, id, quantityStr] = entry.split(":");
    const quantity = parseInt(quantityStr ?? "1", 10);

    if (!id || Number.isNaN(quantity) || quantity <= 0) return null;

    return { type: "bundle", id, quantity };
  }

  const [id, quantityStr] = entry.split(":");
  const quantity = parseInt(quantityStr ?? "1", 10);

  if (!id || Number.isNaN(quantity) || quantity <= 0) return null;

  return { type: "product", id, quantity };
}
