"use server";

import { revalidatePath } from "next/cache";
import { getAdminClient } from "@/lib/supabase/admin";
import { getAdminContext } from "@/lib/admin/auth";
import { sendOrderShippedEmail } from "@/lib/customer/emails";
import type { AdminOrderStatus } from "@/lib/admin/statuses";

export async function updateOrderStatus(
  orderId: string,
  status: AdminOrderStatus,
  options?: {
    trackingCarrier?: string;
    trackingNumber?: string;
    sendShippedEmail?: boolean;
  },
) {
  const adminUser = await getAdminContext();
  if (!adminUser) return;

  const admin = getAdminClient();
  if (!admin) return;

  const payload: Record<string, unknown> = {
    status,
    updated_at: new Date().toISOString(),
  };

  if (options?.trackingCarrier !== undefined) {
    payload.tracking_carrier = options.trackingCarrier.trim() || null;
  }
  if (options?.trackingNumber !== undefined) {
    payload.tracking_number = options.trackingNumber.trim() || null;
  }

  const { data: order } = await admin
    .from("orders")
    .update(payload)
    .eq("id", orderId)
    .select("customer_email, tracking_carrier, tracking_number")
    .maybeSingle();

  if (
    status === "shipped" &&
    options?.sendShippedEmail &&
    order?.customer_email
  ) {
    await sendOrderShippedEmail({
      customerEmail: order.customer_email,
      orderId,
      carrier: order.tracking_carrier,
      trackingNumber: order.tracking_number,
    });
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function markOrderProcessing(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  await updateOrderStatus(orderId, "processing");
}

export async function markOrderFulfilled(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  await updateOrderStatus(orderId, "fulfilled");
}

export async function markOrderRefunded(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  await updateOrderStatus(orderId, "refunded");
}

export async function markOrderShipped(formData: FormData) {
  const orderId = String(formData.get("orderId") ?? "");
  const trackingCarrier = String(formData.get("trackingCarrier") ?? "");
  const trackingNumber = String(formData.get("trackingNumber") ?? "");
  const sendShippedEmail = formData.get("sendShippedEmail") === "on";

  await updateOrderStatus(orderId, "shipped", {
    trackingCarrier,
    trackingNumber,
    sendShippedEmail,
  });
}
