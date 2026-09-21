"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCustomerContext } from "@/lib/customer/auth";
import { createClient } from "@/lib/supabase/server";
import { getBundleById } from "@/lib/bundles";
import { getProductByIdSync } from "@/lib/products";

export async function updateProfile(formData: FormData) {
  const customer = await getCustomerContext();
  if (!customer) redirect("/account/login");

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();

  const supabase = await createClient();
  await supabase
    .from("customer_profiles")
    .upsert(
      {
        user_id: customer.userId,
        full_name: fullName || null,
        phone: phone || null,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    );

  revalidatePath("/account");
  revalidatePath("/account/profile");
}

export async function changePassword(formData: FormData) {
  const customer = await getCustomerContext();
  if (!customer) redirect("/account/login");
  if (customer.isGoogleAuth) {
    return { error: "Password is managed by Google for this account." };
  }

  const password = String(formData.get("password") ?? "");
  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return { error: error.message };

  revalidatePath("/account/profile");
  return { success: true as const };
}

export async function saveAddress(formData: FormData) {
  const customer = await getCustomerContext();
  if (!customer) redirect("/account/login");

  const id = String(formData.get("id") ?? "").trim();
  const label = String(formData.get("label") ?? "Home").trim() || "Home";
  const line1 = String(formData.get("line1") ?? "").trim();
  const line2 = String(formData.get("line2") ?? "").trim();
  const city = String(formData.get("city") ?? "").trim();
  const state = String(formData.get("state") ?? "").trim();
  const postalCode = String(formData.get("postalCode") ?? "").trim();
  const country = String(formData.get("country") ?? "US").trim() || "US";
  const isDefault = formData.get("isDefault") === "on";

  if (!line1 || !city || !state || !postalCode) {
    return { error: "Please fill in all required address fields." };
  }

  const supabase = await createClient();

  if (isDefault) {
    await supabase
      .from("customer_addresses")
      .update({ is_default: false, updated_at: new Date().toISOString() })
      .eq("user_id", customer.userId);
  }

  const payload = {
    user_id: customer.userId,
    label,
    line1,
    line2: line2 || null,
    city,
    state,
    postal_code: postalCode,
    country,
    is_default: isDefault,
    updated_at: new Date().toISOString(),
  };

  if (id) {
    await supabase
      .from("customer_addresses")
      .update(payload)
      .eq("id", id)
      .eq("user_id", customer.userId);
  } else {
    await supabase.from("customer_addresses").insert(payload);
  }

  revalidatePath("/account/addresses");
  revalidatePath("/account");
}

export async function deleteAddress(addressId: string) {
  const customer = await getCustomerContext();
  if (!customer) redirect("/account/login");

  const supabase = await createClient();
  await supabase
    .from("customer_addresses")
    .delete()
    .eq("id", addressId)
    .eq("user_id", customer.userId);

  revalidatePath("/account/addresses");
  revalidatePath("/account");
}

export type StoredOrderLineItem = {
  name: string;
  quantity: number;
  unitPrice: number;
  productId?: string;
  bundleId?: string;
};

export async function getReorderPayload(orderId: string) {
  const customer = await getCustomerContext();
  if (!customer) return { error: "Sign in required" as const };

  const supabase = await createClient();
  const { data: order } = await supabase
    .from("orders")
    .select("line_items")
    .eq("id", orderId)
    .eq("user_id", customer.userId)
    .maybeSingle();

  if (!order) return { error: "Order not found" as const };

  const lines = order.line_items as StoredOrderLineItem[];
  const items: {
    type: "product" | "bundle";
    id: string;
    quantity: number;
    name: string;
  }[] = [];

  for (const line of lines) {
    if (line.bundleId && getBundleById(line.bundleId)) {
      items.push({
        type: "bundle",
        id: line.bundleId,
        quantity: line.quantity,
        name: line.name,
      });
      continue;
    }
    if (line.productId && getProductByIdSync(line.productId)?.isActive) {
      items.push({
        type: "product",
        id: line.productId,
        quantity: line.quantity,
        name: line.name,
      });
    }
  }

  return { items };
}
