import type { ProductImage } from "@/types/product";

export interface BundleComponent {
  sku: string;
  productId: string;
  quantity: number;
}

export interface Bundle {
  id: string;
  slug: string;
  name: string;
  route: string;
  currency: string;
  priceCents: number;
  referenceSeparateTotalCents: number;
  referenceSavingsCents: number;
  pricingStatus: string;
  components: BundleComponent[];
  badge: string;
  shortDescription: string;
  description: string;
  includedText: string;
  bestFor: string;
  highlights: string[];
  cardCta: string;
  detailCta: string;
  seoTitle: string;
  seoDescription: string;
  images: ProductImage[];
}

export interface BundleFaq {
  question: string;
  answer: string;
}
