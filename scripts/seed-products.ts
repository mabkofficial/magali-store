import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { getAdminClient } from "../src/lib/supabase/admin";

const productsPath = resolve(process.cwd(), "src/data/products.json");

async function seed() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.error(
      "Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before seeding.",
    );
    process.exit(1);
  }

  const admin = getAdminClient();
  if (!admin) {
    console.error("Unable to create Supabase admin client.");
    process.exit(1);
  }

  const raw = readFileSync(productsPath, "utf-8");
  const products = JSON.parse(raw) as Record<string, unknown>[];

  const rows = products.map((product) => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    short_name: product.shortName,
    category: product.category,
    price: product.price,
    currency: product.currency,
    size: product.size,
    tagline: product.tagline,
    short_description: product.shortDescription,
    overview: product.overview,
    benefits: product.benefits,
    ingredients: product.ingredients,
    claims: product.claims ?? null,
    directions: product.directions,
    caution: product.caution,
    storage: product.storage,
    images: product.images,
    featured: product.featured,
    shipping_class: product.shippingClass,
    status: product.status,
    compliance_note: product.complianceNote ?? null,
    verification_note: product.verificationNote ?? null,
    nutrition_highlights: product.nutritionHighlights ?? null,
    inventory_count: 100,
    is_active: product.status === "active",
  }));

  const { error } = await admin.from("products").upsert(rows, { onConflict: "id" });

  if (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }

  console.log(`Seeded ${rows.length} products into Supabase.`);
}

seed();
