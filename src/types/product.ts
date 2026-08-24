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
  images: string[];
  featured: boolean;
  shippingClass: ShippingClass;
  status: string;
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

export type CollectionSlug = "hair-care" | "wellness" | "food";

export interface Collection {
  slug: CollectionSlug;
  name: string;
  description: string;
  categories: ProductCategory[];
}
