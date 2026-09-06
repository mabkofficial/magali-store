import { getAllProducts } from "@/lib/products";
import type { Product } from "@/types/product";

export async function searchProducts(query: string): Promise<Product[]> {
  const products = await getAllProducts();
  const normalized = query.trim().toLowerCase();
  if (!normalized) return products;

  return products.filter((product) => {
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
