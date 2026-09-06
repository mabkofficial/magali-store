"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/admin/auth";

const settingsSchema = z.object({
  store_name: z.string().min(1),
  contact_email: z.string().email().optional().or(z.literal("")),
  contact_phone: z.string().optional(),
  social_instagram: z.string().optional(),
  social_facebook: z.string().optional(),
  default_meta_description: z.string().optional(),
  default_og_image: z.string().optional(),
  standard_shipping_cents: z.coerce.number().int().min(0),
  frozen_shipping_cents: z.coerce.number().int().min(0),
  shipping_regions: z.string().min(1),
});

async function requireAdmin() {
  const user = await getAdminContext();
  if (!user) return { error: "Unauthorized" as const, admin: null };
  const admin = getAdminClient();
  if (!admin) return { error: "Database not configured" as const, admin: null };
  return { error: null, admin };
}

export async function updateStoreSettings(formData: FormData) {
  const ctx = await requireAdmin();
  if (ctx.error) return { error: ctx.error };

  const { data: existing } = await ctx.admin!
    .from("store_settings")
    .select("*")
    .eq("id", "default")
    .single();

  const merged = {
    store_name: formData.get("store_name") ?? existing?.store_name,
    contact_email: formData.get("contact_email") ?? existing?.contact_email ?? "",
    contact_phone: formData.get("contact_phone") ?? existing?.contact_phone ?? "",
    social_instagram: formData.get("social_instagram") ?? existing?.social_instagram ?? "",
    social_facebook: formData.get("social_facebook") ?? existing?.social_facebook ?? "",
    default_meta_description:
      formData.get("default_meta_description") ??
      existing?.default_meta_description ??
      "",
    default_og_image:
      formData.get("default_og_image") ?? existing?.default_og_image ?? "",
    standard_shipping_cents:
      formData.get("standard_shipping_cents") ?? existing?.standard_shipping_cents,
    frozen_shipping_cents:
      formData.get("frozen_shipping_cents") ?? existing?.frozen_shipping_cents,
    shipping_regions:
      formData.get("shipping_regions") ?? existing?.shipping_regions,
  };

  const parsed = settingsSchema.safeParse(merged);

  if (!parsed.success) return { error: "Invalid settings" };

  const { error } = await ctx.admin!
    .from("store_settings")
    .update({
      ...parsed.data,
      contact_email: parsed.data.contact_email || null,
      contact_phone: parsed.data.contact_phone || null,
      social_instagram: parsed.data.social_instagram || null,
      social_facebook: parsed.data.social_facebook || null,
      default_meta_description: parsed.data.default_meta_description || null,
      default_og_image: parsed.data.default_og_image || null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", "default");

  if (error) return { error: error.message };

  revalidatePath("/admin/settings");
  revalidatePath("/admin/settings/general");
  revalidatePath("/admin/settings/shipping");
  revalidatePath("/admin/settings/seo");
  return { success: true };
}

export async function updateNotificationSettings(formData: FormData) {
  const ctx = await requireAdmin();
  if (ctx.error) return { error: ctx.error };

  const contactTo = String(formData.get("contact_to_email") ?? "").trim();
  const fromEmail = String(formData.get("from_email") ?? "").trim();

  if (!contactTo || !fromEmail) {
    return { error: "Both email fields are required" };
  }

  // Persist in store_settings notes field isn't available — document via env in UI.
  // Settings are env-driven; this action validates admin intent only.
  void contactTo;
  void fromEmail;

  return {
    success: true,
    message:
      "Update CONTACT_TO_EMAIL and RESEND_FROM_EMAIL in your deployment environment (.env.local / Vercel).",
  };
}
