"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/admin/auth";

export async function deleteSubscriber(email: string) {
  const adminUser = await getAdminContext();
  if (!adminUser) return { error: "Unauthorized" };

  const admin = getAdminClient();
  if (!admin) return { error: "Database not configured" };

  const { error } = await admin
    .from("newsletter_subscribers")
    .delete()
    .eq("email", email);

  if (error) return { error: error.message };

  revalidatePath("/admin/subscribers");
  return { success: true };
}
