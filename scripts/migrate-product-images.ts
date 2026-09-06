/**
 * One-time migration: normalize product images from string[] to ProductImage[].
 * Run with: npx tsx scripts/migrate-product-images.ts
 *
 * Does not upload to Supabase Storage — only normalizes JSON shape in the database.
 * Upload legacy public/ assets to Storage separately when ready.
 */

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

type LegacyImage = string | { url: string; alt?: string; sort?: number };

function normalizeImages(raw: LegacyImage[]) {
  return raw.map((item, index) => {
    if (typeof item === "string") {
      return { url: item, alt: "", sort: index };
    }
    return {
      url: item.url,
      alt: item.alt ?? "",
      sort: item.sort ?? index,
    };
  });
}

async function main() {
  const { data: products, error } = await supabase.from("products").select("id, images");

  if (error) {
    console.error(error.message);
    process.exit(1);
  }

  let updated = 0;

  for (const product of products ?? []) {
    if (!Array.isArray(product.images)) continue;
    const needsMigration = product.images.some((item) => typeof item === "string");
    if (!needsMigration) continue;

    const normalized = normalizeImages(product.images as LegacyImage[]);
    const { error: updateError } = await supabase
      .from("products")
      .update({ images: normalized })
      .eq("id", product.id);

    if (updateError) {
      console.error(`Failed ${product.id}:`, updateError.message);
      continue;
    }

    updated += 1;
    console.log(`Updated ${product.id}`);
  }

  console.log(`Done. Migrated ${updated} product(s).`);
}

void main();
