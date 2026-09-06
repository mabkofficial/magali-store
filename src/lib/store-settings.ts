import { getAdminClient } from "@/lib/supabase/admin";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { StoreSettings } from "@/types/product";

type DbStoreSettings = {
  id: string;
  store_name: string;
  contact_email: string | null;
  contact_phone: string | null;
  social_instagram: string | null;
  social_facebook: string | null;
  default_meta_description: string | null;
  default_og_image: string | null;
  standard_shipping_cents: number;
  frozen_shipping_cents: number;
  shipping_regions: string;
};

function mapStoreSettings(row: DbStoreSettings): StoreSettings {
  return {
    id: row.id,
    storeName: row.store_name,
    contactEmail: row.contact_email,
    contactPhone: row.contact_phone,
    socialInstagram: row.social_instagram,
    socialFacebook: row.social_facebook,
    defaultMetaDescription: row.default_meta_description,
    defaultOgImage: row.default_og_image,
    standardShippingCents: row.standard_shipping_cents,
    frozenShippingCents: row.frozen_shipping_cents,
    shippingRegions: row.shipping_regions,
  };
}

export async function getStoreSettings(): Promise<StoreSettings | null> {
  if (!isSupabaseConfigured()) return null;

  const admin = getAdminClient();
  const client = admin ?? (await createClient());

  const { data } = await client
    .from("store_settings")
    .select("*")
    .eq("id", "default")
    .maybeSingle();

  return data ? mapStoreSettings(data as DbStoreSettings) : null;
}

export async function getStoreSettingsForAdmin(): Promise<StoreSettings | null> {
  return getStoreSettings();
}
