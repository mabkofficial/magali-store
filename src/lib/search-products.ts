import { getAllProducts } from "@/lib/products";
import type { Product } from "@/types/product";

export function searchProducts(query: string): Product[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return getAllProducts();

  return getAllProducts().filter((product) => {
    const haystack = [
      product.name,
      product.shortName,
      product.category,
      product.tagline,
      product.shortDescription,
    ]
      .join(" ")
      .toLowerCase();

    return haystack.includes(normalized);
  });
}
