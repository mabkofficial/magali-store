import { serializeProductImages } from "@/lib/products/images";
import type { ProductFormState, ProductInput } from "@/lib/admin/product-schema";
import type { ProductImage } from "@/types/product";

export type { ProductFormState } from "@/lib/admin/product-schema";

export type ProductEditorState = ProductFormState & {
  fbt_product_ids: string[];
};

export function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function dbRowToFormState(row: Record<string, unknown>): ProductEditorState {
  const images = Array.isArray(row.images) ? (row.images as ProductImage[]) : [];
  const directions = row.directions as ProductInput["directions"];

  return {
    id: row.id as string,
    name: row.name as string,
    slug: row.slug as string,
    short_name: row.short_name as string,
    category: row.category as ProductInput["category"],
    price: Number(row.price),
    currency: (row.currency as string) ?? "USD",
    size: row.size as string,
    shipping_class: row.shipping_class as ProductInput["shipping_class"],
    featured: Boolean(row.featured),
    is_active: Boolean(row.is_active),
    inventory_count: Number(row.inventory_count ?? 0),
    tagline: row.tagline as string,
    short_description: row.short_description as string,
    overview: row.overview as string,
    benefits: (row.benefits as string[]) ?? [],
    claims: (row.claims as string[]) ?? [],
    nutrition_highlights: (row.nutrition_highlights as string[]) ?? [],
    ingredients: (row.ingredients as Record<string, string[]>) ?? {},
    directions,
    caution: row.caution as string,
    storage: row.storage as string,
    compliance_note: (row.compliance_note as string | null) ?? "",
    verification_note: (row.verification_note as string | null) ?? "",
    images: serializeProductImages(
      images.map((image, index) =>
        typeof image === "string"
          ? { url: image, alt: "", sort: index }
          : { url: image.url, alt: image.alt ?? "", sort: image.sort ?? index },
      ),
    ),
    meta_title: (row.meta_title as string | null) ?? "",
    meta_description: (row.meta_description as string | null) ?? "",
    og_image: (row.og_image as string | null) ?? "",
    fbt_product_ids: [],
  };
}
