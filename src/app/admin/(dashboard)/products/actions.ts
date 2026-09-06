"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/admin/auth";
import {
  productInputSchema,
  type ProductInput,
} from "@/lib/admin/product-schema";
import {
  copyProductRelationships,
  syncFbtRelationships,
} from "@/lib/product-recommendations";
import { serializeProductImages } from "@/lib/products/images";

function revalidateProductPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/cart");
  revalidatePath("/admin/products");
  revalidatePath("/api/products/fbt");
  revalidatePath("/api/products/fbt/cart");
  if (slug) {
    revalidatePath(`/products/${slug}`);
  }
}

function toDbPayload(data: ProductInput) {
  return {
    name: data.name,
    slug: data.slug,
    short_name: data.short_name,
    category: data.category,
    price: data.price,
    currency: data.currency,
    size: data.size,
    shipping_class: data.shipping_class,
    featured: data.featured,
    is_active: data.is_active,
    inventory_count: data.inventory_count,
    tagline: data.tagline,
    short_description: data.short_description,
    overview: data.overview,
    benefits: data.benefits,
    claims: data.claims ?? [],
    nutrition_highlights: data.nutrition_highlights ?? null,
    ingredients: data.ingredients,
    directions: data.directions,
    caution: data.caution,
    storage: data.storage,
    compliance_note: data.compliance_note ?? null,
    verification_note: data.verification_note ?? null,
    images: serializeProductImages(data.images),
    meta_title: data.meta_title ?? null,
    meta_description: data.meta_description ?? null,
    og_image: data.og_image ?? null,
    status: data.is_active ? "active" : "inactive",
    updated_at: new Date().toISOString(),
  };
}

async function requireAdmin() {
  const adminUser = await getAdminContext();
  if (!adminUser) return { error: "Unauthorized" as const, admin: null, user: null };
  const admin = getAdminClient();
  if (!admin) return { error: "Database not configured" as const, admin: null, user: adminUser };
  return { error: null, admin, user: adminUser };
}

async function ensureUniqueSlug(
  admin: NonNullable<ReturnType<typeof getAdminClient>>,
  slug: string,
  excludeId?: string,
) {
  const { data } = await admin
    .from("products")
    .select("id")
    .eq("slug", slug)
    .maybeSingle();

  if (data && data.id !== excludeId) {
    return false;
  }
  return true;
}

export async function createProduct(
  input: ProductInput,
  fbtProductIds: string[] = [],
) {
  const ctx = await requireAdmin();
  if (ctx.error) return { error: ctx.error };

  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid product data" };

  const unique = await ensureUniqueSlug(ctx.admin!, parsed.data.slug);
  if (!unique) return { error: "Slug already in use" };

  const id = parsed.data.slug;
  const payload = toDbPayload(parsed.data);

  const { error } = await ctx.admin!.from("products").insert({
    id,
    ...payload,
    created_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  await syncFbtRelationships(ctx.admin!, id, fbtProductIds);

  revalidateProductPaths(parsed.data.slug);
  redirect(`/admin/products/${id}`);
}

export async function updateProduct(
  id: string,
  input: ProductInput,
  fbtProductIds: string[] = [],
) {
  const ctx = await requireAdmin();
  if (ctx.error) return { error: ctx.error };

  const parsed = productInputSchema.safeParse(input);
  if (!parsed.success) return { error: "Invalid product data" };

  const unique = await ensureUniqueSlug(ctx.admin!, parsed.data.slug, id);
  if (!unique) return { error: "Slug already in use" };

  const { data: existing } = await ctx.admin!
    .from("products")
    .select("slug")
    .eq("id", id)
    .single();

  const payload = toDbPayload(parsed.data);
  const { error } = await ctx.admin!.from("products").update(payload).eq("id", id);

  if (error) return { error: error.message };

  await syncFbtRelationships(ctx.admin!, id, fbtProductIds);

  revalidateProductPaths(parsed.data.slug);
  if (existing?.slug && existing.slug !== parsed.data.slug) {
    revalidatePath(`/products/${existing.slug}`);
  }

  return { success: true };
}

export async function duplicateProduct(id: string) {
  const ctx = await requireAdmin();
  if (ctx.error) return { error: ctx.error };

  const { data: source } = await ctx.admin!
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (!source) return { error: "Product not found" };

  let slug = `${source.slug}-copy`;
  let newId = slug;
  let attempt = 1;
  while (!(await ensureUniqueSlug(ctx.admin!, slug))) {
    attempt += 1;
    slug = `${source.slug}-copy-${attempt}`;
    newId = slug;
  }

  const { error } = await ctx.admin!.from("products").insert({
    ...source,
    id: newId,
    slug,
    name: `${source.name} (Copy)`,
    featured: false,
    is_active: false,
    status: "inactive",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  });

  if (error) return { error: error.message };

  await copyProductRelationships(ctx.admin!, id, newId);

  revalidateProductPaths(slug);
  redirect(`/admin/products/${newId}`);
}

export async function deleteProduct(id: string) {
  const ctx = await requireAdmin();
  if (ctx.error) return { error: ctx.error };

  const { data: existing } = await ctx.admin!
    .from("products")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await ctx.admin!
    .from("products")
    .update({
      is_active: false,
      status: "inactive",
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidateProductPaths(existing?.slug);
  return { success: true };
}

export async function bulkSetProductActive(ids: string[], isActive: boolean) {
  const ctx = await requireAdmin();
  if (ctx.error) return { error: ctx.error };
  if (ids.length === 0) return { success: true };

  const { error } = await ctx.admin!
    .from("products")
    .update({
      is_active: isActive,
      status: isActive ? "active" : "inactive",
      updated_at: new Date().toISOString(),
    })
    .in("id", ids);

  if (error) return { error: error.message };

  revalidateProductPaths();
  return { success: true };
}
