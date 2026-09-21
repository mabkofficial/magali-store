import { createClient } from "@/lib/supabase/server";
import { getAdminClient } from "@/lib/supabase/admin";
import type { User } from "@supabase/supabase-js";

export type CustomerContext = {
  userId: string;
  email: string;
  fullName: string | null;
  avatarUrl: string | null;
  isGoogleAuth: boolean;
};

function displayNameFromUser(user: User): string | null {
  const meta = user.user_metadata ?? {};
  const name =
    (meta.full_name as string | undefined) ??
    (meta.name as string | undefined) ??
    (meta.display_name as string | undefined);
  return name?.trim() || null;
}

export async function getCustomerContext(): Promise<CustomerContext | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) return null;

  const appMeta = user.app_metadata ?? {};
  const isGoogleAuth =
    appMeta.provider === "google" ||
    (Array.isArray(appMeta.providers) && appMeta.providers.includes("google"));

  return {
    userId: user.id,
    email: user.email,
    fullName: displayNameFromUser(user),
    avatarUrl: (user.user_metadata?.avatar_url as string | undefined) ?? null,
    isGoogleAuth,
  };
}

export async function linkOrdersToUser(userId: string, email: string): Promise<void> {
  const admin = getAdminClient();
  if (!admin || !email) return;

  const normalized = email.trim().toLowerCase();
  await admin
    .from("orders")
    .update({ user_id: userId, updated_at: new Date().toISOString() })
    .is("user_id", null)
    .ilike("customer_email", normalized);
}

export async function bootstrapCustomerAccount(user: User): Promise<void> {
  const supabase = await createClient();
  const fullName = displayNameFromUser(user);
  const avatarUrl = (user.user_metadata?.avatar_url as string | undefined) ?? null;

  await supabase.from("customer_profiles").upsert(
    {
      user_id: user.id,
      full_name: fullName,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" },
  );

  if (user.email) {
    await linkOrdersToUser(user.id, user.email);
  }
}

export async function bootstrapCustomerFromSession(): Promise<void> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (user) {
    await bootstrapCustomerAccount(user);
  }
}
