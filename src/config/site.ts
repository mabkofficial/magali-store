import type { CollectionSlug } from "@/types/product";

export const FROZEN_CHECKOUT_ENABLED = false;

export const siteConfig = {
  name: "Magali",
  title: "Magali",
  description:
    "Shop Magali botanical hair care, targeted wellness products, and Caribbean-style food favorites.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  announcement:
    "Botanical beauty • Caribbean flavor • Made with care",
  contactEmail: process.env.CONTACT_TO_EMAIL ?? "",
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
