import type { CollectionSlug } from "@/types/product";
import productsData from "@/data/products.json";

type ProductSlugRow = { slug: string; category: string };

export const FROZEN_CHECKOUT_ENABLED =
  process.env.FROZEN_CHECKOUT_ENABLED === "true";

/** Set `FROZEN_CHECKOUT_ENABLED=true` in env to allow Stripe checkout for frozen items. */

export const siteConfig = {
  name: "Magali",
  title: "Magali",
  description:
    "Shop Magali botanical hair care, wellness oils, and Caribbean food favorites.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  announcement:
    "Botanical hair care, wellness oils, and Caribbean food favorites.",
  contactEmail: process.env.CONTACT_TO_EMAIL ?? "",
  contactPhone: process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "",
  social: {
    instagram: process.env.NEXT_PUBLIC_INSTAGRAM_URL ?? "",
    facebook: process.env.NEXT_PUBLIC_FACEBOOK_URL ?? "",
  },
  shipping: {
    standardRateCents: parseInt(process.env.STANDARD_SHIPPING_RATE_CENTS ?? "799", 10),
    frozenRateCents: parseInt(process.env.FROZEN_SHIPPING_RATE_CENTS ?? "2499", 10),
    regions: "United States (contiguous 48 states)",
    standardDelivery: "5–7 business days",
    frozenDelivery: "1–2 business days with insulated packaging",
  },
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/collections/hair-care", label: "Hair Care" },
  { href: "/collections/wellness", label: "Wellness" },
  { href: "/collections/food", label: "Food" },
  { href: "/about", label: "About" },
] as const;

export const footerLinks = {
  shop: [
    { href: "/shop", label: "All Products" },
    { href: "/collections/hair-care", label: "Hair Care" },
    { href: "/collections/wellness", label: "Wellness" },
    { href: "/collections/food", label: "Food" },
  ],
  care: [
    { href: "/find-your-routine", label: "Find Your Routine" },
    { href: "/faq", label: "FAQ" },
    { href: "/shipping-returns", label: "Shipping & Returns" },
    { href: "/contact", label: "Contact" },
  ],
  legal: [
    { href: "/privacy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms of Service" },
  ],
};

export const categoryToCollection: Record<string, CollectionSlug> = {
  "Hair Care": "hair-care",
  Wellness: "wellness",
  Food: "food",
};

/** Static slug → collection map for client-side nav active states */
export const productSlugToCollection: Record<string, CollectionSlug> =
  Object.fromEntries(
    (productsData as ProductSlugRow[]).map((product) => [
      product.slug,
      categoryToCollection[product.category],
    ]),
  ) as Record<string, CollectionSlug>;
