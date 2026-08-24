import productsData from "@/data/products.json";
import type {
  Collection,
  CollectionSlug,
  Product,
  ProductCategory,
} from "@/types/product";

const products = productsData as unknown as Product[];

export const collections: Collection[] = [
  {
    slug: "hair-care",
    name: "Hair Care",
    description:
      "Botanical hair oils and herbal formulas rooted in nature for everyday scalp and strand care.",
    categories: ["Hair Care"],
  },
  {
    slug: "wellness",
    name: "Wellness",
    description:
      "Targeted botanical blends designed for external comfort and everyday wellness support.",
    categories: ["Wellness"],
  },
  {
    slug: "food",
    name: "Caribbean Food",
    description:
      "Bold Caribbean flavors made for family tables — convenient frozen favorites ready to cook.",
    categories: ["Food"],
  },
];

export function getAllProducts(): Product[] {
  return products;
}

export function getProductBySlug(slug: string): Product | undefined {
  return products.find((product) => product.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return products.find((product) => product.id === id);
}

export function getFeaturedProducts(): Product[] {
  return products.filter((product) => product.featured);
}

export function getProductsByCategory(category: ProductCategory): Product[] {
  return products.filter((product) => product.category === category);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return collections.find((collection) => collection.slug === slug);
}

export function getProductsByCollection(slug: CollectionSlug): Product[] {
  const collection = getCollectionBySlug(slug);
  if (!collection) return [];
  return products.filter((product) =>
    collection.categories.includes(product.category),
  );
}

export function getRelatedProducts(product: Product, limit = 2): Product[] {
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

export function getAllProductSlugs(): string[] {
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
