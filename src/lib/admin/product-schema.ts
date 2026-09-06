import { z } from "zod";

const categories = ["Hair Care", "Wellness", "Food"] as const;
const shippingClasses = ["standard", "frozen"] as const;

const imageSchema = z.object({
  url: z.string().min(1),
  alt: z.string().optional(),
  sort: z.number().int().min(0),
});

export const productInputSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/),
  short_name: z.string().min(1),
  category: z.enum(categories),
  price: z.number().min(0),
  currency: z.string().min(1).default("USD"),
  size: z.string().min(1),
  shipping_class: z.enum(shippingClasses),
  featured: z.boolean(),
  is_active: z.boolean(),
  inventory_count: z.number().int().min(0),
  tagline: z.string().min(1),
  short_description: z.string().min(1),
  overview: z.string().min(1),
  benefits: z.array(z.string()),
  claims: z.array(z.string()).optional(),
  nutrition_highlights: z.array(z.string()).optional(),
  ingredients: z.record(z.string(), z.array(z.string())),
  directions: z.union([
    z.array(z.string()),
    z.object({
      oven: z.string(),
      airFryer: z.string(),
      skillet: z.string(),
    }),
  ]),
  caution: z.string().min(1),
  storage: z.string().min(1),
  compliance_note: z.string().optional().nullable(),
  verification_note: z.string().optional().nullable(),
  images: z.array(imageSchema),
  meta_title: z.string().optional().nullable(),
  meta_description: z.string().optional().nullable(),
  og_image: z.string().optional().nullable(),
});

export type ProductInput = z.infer<typeof productInputSchema>;
export type ProductFormState = ProductInput & { id?: string };
