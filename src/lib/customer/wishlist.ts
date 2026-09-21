import { getBundleById } from "@/lib/bundles";
import { getProductByIdSync } from "@/lib/products";
import { getPrimaryImageUrl } from "@/lib/products/images";
import { createClient } from "@/lib/supabase/server";
import { getCustomerContext } from "@/lib/customer/auth";

export type WishlistEntry =
  | {
      id: string;
      kind: "product";
      productId: string;
      slug: string;
      name: string;
      price: number;
      image: string;
      active: boolean;
    }
  | {
      id: string;
      kind: "bundle";
      bundleId: string;
      slug: string;
      name: string;
      price: number;
      image: string;
      active: boolean;
    };

export async function getWishlistForUser(userId: string): Promise<WishlistEntry[]> {
  const supabase = await createClient();
  const { data: rows } = await supabase
    .from("wishlist_items")
    .select("id, product_id, bundle_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  const entries: WishlistEntry[] = [];

  for (const row of rows ?? []) {
    if (row.product_id) {
      const product = getProductByIdSync(row.product_id);
      if (!product) continue;
      entries.push({
        id: row.id,
        kind: "product",
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        image: getPrimaryImageUrl(product.images),
        active: product.isActive && product.inventoryCount > 0,
      });
      continue;
    }
    if (row.bundle_id) {
      const bundle = getBundleById(row.bundle_id);
      if (!bundle) continue;
      entries.push({
        id: row.id,
        kind: "bundle",
        bundleId: bundle.id,
        slug: bundle.slug,
        name: bundle.name,
        price: bundle.priceCents / 100,
        image: getPrimaryImageUrl(bundle.images),
        active: true,
      });
    }
  }

  return entries;
}

export async function getWishlistCount(): Promise<number> {
  const customer = await getCustomerContext();
  if (!customer) return 0;

  const supabase = await createClient();
  const { count } = await supabase
    .from("wishlist_items")
    .select("*", { count: "exact", head: true })
    .eq("user_id", customer.userId);

  return count ?? 0;
}

export async function isInWishlist(input: {
  productId?: string;
  bundleId?: string;
}): Promise<boolean> {
  const customer = await getCustomerContext();
  if (!customer) return false;

  const supabase = await createClient();
  let query = supabase
    .from("wishlist_items")
    .select("id")
    .eq("user_id", customer.userId);

  if (input.productId) {
    query = query.eq("product_id", input.productId);
  } else if (input.bundleId) {
    query = query.eq("bundle_id", input.bundleId);
  } else {
    return false;
  }

  const { data } = await query.maybeSingle();
  return Boolean(data);
}
