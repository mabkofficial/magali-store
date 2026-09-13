export * from "@/lib/bundles/catalog";

import { getProductById } from "@/lib/products";
import type { Bundle } from "@/types/bundle";
import type { Product } from "@/types/product";
import {
  computeComponentDemand,
  getBundleById,
  type ComponentDemandLine,
} from "@/lib/bundles/catalog";

export async function validateComponentDemand(
  demand: Map<string, number>,
): Promise<{ ok: true } | { ok: false; error: string }> {
  for (const [productId, requiredQty] of demand.entries()) {
    const product = await getProductById(productId);

    if (!product) {
      return { ok: false, error: `Product not found: ${productId}` };
    }

    if (!product.isActive) {
      return { ok: false, error: `${product.name} is no longer available.` };
    }

    if (product.inventoryCount <= 0) {
      return { ok: false, error: `${product.name} is out of stock.` };
    }

    if (requiredQty > product.inventoryCount) {
      return {
        ok: false,
        error: `Only ${product.inventoryCount} of ${product.name} available for this order.`,
      };
    }
  }

  return { ok: true };
}

export async function getBundleComponentProducts(
  bundle: Bundle,
): Promise<Product[]> {
  const products: Product[] = [];

  for (const component of bundle.components) {
    const product = await getProductById(component.productId);
    if (product) products.push(product);
  }

  return products;
}

export { computeComponentDemand, getBundleById };
export type { ComponentDemandLine };
