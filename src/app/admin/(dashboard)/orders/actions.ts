"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/admin/auth";

export async function updateOrderStatus(
  orderId: string,
  status: "paid" | "fulfilled" | "refunded",
) {
  const adminUser = await getAdminContext();
  if (!adminUser) return;

  const admin = getAdminClient();
  if (!admin) return;

  await admin
    .from("orders")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", orderId);

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}
