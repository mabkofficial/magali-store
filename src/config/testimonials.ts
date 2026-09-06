export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  productIds: string[];
};

/** Curated customer quotes — seed data for MVP; structure supports future DB migration. */
export const testimonials: Testimonial[] = [
  {
    id: "maya-curls",
    quote:
      "My curls finally stay defined without feeling heavy. The hair oil and grease together changed my wash day routine.",
    author: "Maya R.",
    productIds: ["hair-oil", "hair-grease"],
  },
  {
    id: "keisha-breakage",
    quote:
      "I've tried everything for breakage. Magali's botanical oil is the first thing that actually made my edges feel stronger.",
    author: "Keisha T.",
    productIds: ["hair-oil"],
  },
  {
    id: "denise-grease",
    quote:
      "The grease seals in moisture like nothing else. My daughter and I both use it now — it's become a family staple.",
    author: "Denise L.",
    productIds: ["hair-grease"],
  },
];

export function getTestimonialsForProduct(productId: string): Testimonial[] {
  return testimonials.filter((t) => t.productIds.includes(productId));
}

export function getFeaturedTestimonials(limit = 2): Testimonial[] {
  return testimonials.slice(0, limit);
}
