export type ShippingClass = "standard" | "frozen";

export type ProductCategory = "Hair Care" | "Wellness" | "Food";

export type ProductDirections =
  | string[]
  | {
      oven: string;
      airFryer: string;
      skillet: string;
    };

export type ProductIngredients = Record<string, string[]>;

export interface ProductImage {
  url: string;
  alt?: string;
  sort: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: ProductCategory;
  price: number;
  currency: string;
  size: string;
  tagline: string;
  shortDescription: string;
  overview: string;
  benefits: string[];
  ingredients: ProductIngredients;
  claims?: string[];
  directions: ProductDirections;
  caution: string;
  storage: string;
  images: ProductImage[];
  featured: boolean;
  shippingClass: ShippingClass;
  status: string;
  inventoryCount: number;
  isActive: boolean;
  metaTitle?: string;
  metaDescription?: string;
  ogImage?: string;
  complianceNote?: string;
  verificationNote?: string;
  nutritionHighlights?: string[];
}

export interface CartItem {
  productId: string;
  slug: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  shippingClass: ShippingClass;
}

export interface FbtBundle {
  anchor: Product;
  companions: Product[];
}

export type FbtSurface = "pdp" | "cart" | "mini_cart";

export type CollectionSlug = "hair-care" | "wellness" | "food";

export interface Collection {
  slug: CollectionSlug;
  name: string;
  description: string;
  categories: ProductCategory[];
}

export interface StoreSettings {
  id: string;
  storeName: string;
  contactEmail: string | null;
  contactPhone: string | null;
  socialInstagram: string | null;
  socialFacebook: string | null;
  defaultMetaDescription: string | null;
  defaultOgImage: string | null;
  standardShippingCents: number;
  frozenShippingCents: number;
  shippingRegions: string;
}
