import type { ProductImage } from "@/types/product";

export function isProductImage(value: unknown): value is ProductImage {
  return (
    typeof value === "object" &&
    value !== null &&
    "url" in value &&
    typeof (value as ProductImage).url === "string"
  );
}

export function normalizeProductImages(raw: unknown): ProductImage[] {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item, index): ProductImage | null => {
      if (typeof item === "string") {
        return { url: item, alt: "", sort: index };
      }
      if (isProductImage(item)) {
        return {
          url: item.url,
          alt: item.alt ?? "",
          sort: item.sort ?? index,
        };
      }
      return null;
    })
    .filter((item): item is ProductImage => item !== null)
    .sort((a, b) => a.sort - b.sort);
}

export function getProductImageUrls(images: ProductImage[]): string[] {
  return images.map((image) => image.url);
}

export function getPrimaryImageUrl(images: ProductImage[] | string[]): string {
  if (!Array.isArray(images) || images.length === 0) return "";

  if (typeof images[0] === "string") {
    return normalizeProductImages(images)[0]?.url ?? "";
  }

  return images[0]?.url ?? "";
}

export function serializeProductImages(images: ProductImage[]): ProductImage[] {
  return images.map((image, index) => ({
    url: image.url,
    alt: image.alt ?? "",
    sort: index,
  }));
}
