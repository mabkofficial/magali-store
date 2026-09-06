import productsData from "@/data/products.json";
import { getAdminClient } from "@/lib/supabase/admin";
import { normalizeProductImages } from "@/lib/products/images";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type {
  Collection,
  CollectionSlug,
  Product,
  ProductCategory,
  ProductDirections,
  ProductIngredients,
  ShippingClass,
} from "@/types/product";

const jsonProducts = (productsData as unknown as Product[]).map((product) => ({
  ...product,
  images: normalizeProductImages(product.images),
  inventoryCount: product.inventoryCount ?? 100,
  isActive: product.isActive ?? product.status === "active",
}));

export const collections: Collection[] = [
  {
    slug: "hair-care",
    name: "Hair Care",
    description:
      "Botanical hair oils and herbal formulas rooted in nature for everyday scalp and strand care.",
    categories: ["Hair Care"],
    heroHeadline: "Root to tip, every day",
    heroMood: "Botanical scalp and strand care",
    heroImage: "/images/products/hair-oil/03-botanical-lifestyle.png",
    heroTint: "botanical",
  },
  {
    slug: "wellness",
    name: "Wellness",
    description:
      "Targeted botanical blends designed for external comfort and everyday wellness support.",
    categories: ["Wellness"],
    heroHeadline: "Targeted botanical support",
    heroMood: "Precise, external wellness blends",
    heroImage: "/images/products/pureheal-oil/02-botanical-still-life.png",
    heroTint: "clay",
  },
  {
    slug: "food",
    name: "Caribbean Food",
    description:
      "Bold Caribbean flavors for family meals. Convenient frozen favorites ready to cook at home.",
    categories: ["Food"],
    heroHeadline: "A taste of the Caribbean",
    heroMood: "Family-size frozen favorites",
    heroImage: "/images/products/beef-pies/01-package-white.png",
    heroTint: "gold",
  },
];

type DbProductRow = {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  category: string;
  price: number;
  currency: string;
  size: string;
  tagline: string;
  short_description: string;
  overview: string;
  benefits: string[];
  ingredients: ProductIngredients;
  claims: string[] | null;
  directions: ProductDirections;
  caution: string;
  storage: string;
  images: unknown;
  featured: boolean;
  shipping_class: string;
  status: string;
  meta_title: string | null;
  meta_description: string | null;
  og_image: string | null;
  compliance_note: string | null;
  verification_note: string | null;
  nutrition_highlights: string[] | null;
  inventory_count: number;
  is_active: boolean;
};

function mapDbRow(row: DbProductRow): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortName: row.short_name,
    category: row.category as ProductCategory,
    price: Number(row.price),
    currency: row.currency,
    size: row.size,
    tagline: row.tagline,
    shortDescription: row.short_description,
    overview: row.overview,
    benefits: row.benefits,
    ingredients: row.ingredients,
    claims: row.claims ?? undefined,
    directions: row.directions,
    caution: row.caution,
    storage: row.storage,
    images: normalizeProductImages(row.images),
    featured: row.featured,
    shippingClass: row.shipping_class as ShippingClass,
    status: row.status,
    inventoryCount: row.inventory_count,
    isActive: row.is_active,
    metaTitle: row.meta_title ?? undefined,
    metaDescription: row.meta_description ?? undefined,
    ogImage: row.og_image ?? undefined,
    complianceNote: row.compliance_note ?? undefined,
    verificationNote: row.verification_note ?? undefined,
    nutritionHighlights: row.nutrition_highlights ?? undefined,
  };
}

async function getSupabaseReader() {
  const admin = getAdminClient();
  if (admin) return admin;
  return createClient();
}

async function fetchProductsFromDb(): Promise<Product[] | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await getSupabaseReader();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("is_active", true)
    .order("featured", { ascending: false });

  if (error || !data) {
    console.error("Failed to fetch products from Supabase:", error?.message);
    return null;
  }

  return (data as DbProductRow[]).map(mapDbRow);
}

async function getProducts(): Promise<Product[]> {
  const dbProducts = await fetchProductsFromDb();
  return dbProducts ?? jsonProducts.filter((product) => product.isActive);
}

export async function getAllProducts(): Promise<Product[]> {
  return getProducts();
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const products = await getProducts();
  return products.find((product) => product.slug === slug);
}

export async function getProductById(id: string): Promise<Product | undefined> {
  if (isSupabaseConfigured()) {
    const supabase = await getSupabaseReader();
    const { data } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .eq("is_active", true)
      .maybeSingle();

    if (data) return mapDbRow(data as DbProductRow);
  }

  return jsonProducts.find(
    (product) => product.id === id && product.isActive,
  );
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.featured);
}

export async function getProductsByCategory(
  category: ProductCategory,
): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((product) => product.category === category);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export async function getProductsByCollection(
  slug: CollectionSlug,
): Promise<Product[]> {
  const collection = getCollectionBySlug(slug);
  if (!collection) return [];

  const products = await getProducts();
  return products.filter((product) =>
    collection.categories.includes(product.category),
  );
}

export async function getRelatedProducts(
  product: Product,
  limit = 2,
): Promise<Product[]> {
  const products = await getProducts();
  const sameCategory = products.filter(
    (item) => item.category === product.category && item.id !== product.id,
  );

  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  const others = products.filter(
    (item) => item.id !== product.id && item.category !== product.category,
  );

  return [...sameCategory, ...others].slice(0, limit);
}

export async function getAllProductSlugs(): Promise<string[]> {
  const products = await getProducts();
  return products.map((product) => product.slug);
}

export function sortProducts(
  items: Product[],
  sort: "featured" | "price-asc" | "price-desc" | "name",
): Product[] {
  const sorted = [...items];

  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => a.price - b.price);
    case "price-desc":
      return sorted.sort((a, b) => b.price - a.price);
    case "name":
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case "featured":
    default:
      return sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
  }
}

/** Lightweight list for client-side search */
export async function getProductSearchList(): Promise<
  Pick<Product, "id" | "slug" | "name" | "shortName" | "category" | "tagline" | "price">[]
> {
  const products = await getProducts();
  return products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    shortName: product.shortName,
    category: product.category,
    tagline: product.tagline,
    price: product.price,
  }));
}

/** Sync fallback for build-time or when DB unavailable */
export function getAllProductsSync(): Product[] {
  return jsonProducts.filter((product) => product.isActive);
}

export function getProductByIdSync(id: string): Product | undefined {
  return jsonProducts.find((product) => product.id === id && product.isActive);
}
