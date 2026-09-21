import productsData from "@/data/products.json";
import { normalizeProductImages } from "@/lib/products/images";
import type { Product } from "@/types/product";

const jsonProducts = (productsData as unknown as Product[]).map((product) => ({
  ...product,
  images: normalizeProductImages(product.images),
  inventoryCount: product.inventoryCount ?? 100,
  isActive: product.isActive ?? product.status === "active",
}));

export function getAllProductsSync(): Product[] {
  return jsonProducts.filter((product) => product.isActive);
}

export function getProductByIdSync(id: string): Product | undefined {
  return jsonProducts.find((product) => product.id === id && product.isActive);
}
