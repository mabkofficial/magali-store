import type Stripe from "stripe";
import { getAdminClient } from "@/lib/supabase/admin";
import {
  sendFulfillmentEmail,
  sendOrderConfirmationEmail,
  type OrderEmailData,
} from "@/lib/order-emails";
import { getBundleById, parseCartMetadataEntry } from "@/lib/bundles";
import { getProductByIdSync } from "@/lib/products";
import { toCents } from "@/lib/currency";
import type { SupabaseClient } from "@supabase/supabase-js";

export type ProcessCheckoutResult = {
  ok: boolean;
  orderId?: string;
  customerEmail?: string;
  confirmationSent?: boolean;
  fulfillmentSent?: boolean;
  error?: string;
  skipped?: "duplicate" | "unpaid";
};

async function buildLineItems(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
) {
  const cartItemsRaw = session.metadata?.cart_items ?? "";
  const cartEntries = cartItemsRaw.split(",").filter(Boolean);
  const stripeLineItems = await stripe.checkout.sessions.listLineItems(
    session.id,
    { limit: 100 },
  );

  const lineItems: OrderEmailData["lineItems"] = [];
  const inventoryAdjustments = new Map<string, number>();

  cartEntries.forEach((entry, index) => {
    const parsed = parseCartMetadataEntry(entry);
    if (!parsed) return;

    const stripeItem = stripeLineItems.data[index];
    const quantity = stripeItem?.quantity ?? parsed.quantity;
    const unitPriceCents =
      stripeItem?.price?.unit_amount ??
      (parsed.type === "bundle"
        ? (getBundleById(parsed.id)?.priceCents ?? 0)
        : toCents(getProductByIdSync(parsed.id)?.price ?? 0));

    if (parsed.type === "bundle") {
      const bundle = getBundleById(parsed.id);
      lineItems.push({
        name: bundle?.name ?? stripeItem?.description ?? parsed.id,
        quantity,
        unitPrice: unitPriceCents / 100,
      });

      for (const component of bundle?.components ?? []) {
        inventoryAdjustments.set(
          component.productId,
          (inventoryAdjustments.get(component.productId) ?? 0) +
            component.quantity * quantity,
        );
      }
      return;
    }

    const product = getProductByIdSync(parsed.id);
    lineItems.push({
      name: product?.name ?? stripeItem?.description ?? parsed.id,
      quantity,
      unitPrice: unitPriceCents / 100,
    });

    inventoryAdjustments.set(
      parsed.id,
      (inventoryAdjustments.get(parsed.id) ?? 0) + quantity,
    );
  });

  return { lineItems, inventoryAdjustments };
}

async function decrementInventory(
  admin: SupabaseClient,
  inventoryAdjustments: Map<string, number>,
) {
  for (const [productId, quantity] of inventoryAdjustments.entries()) {
    const { data: productRow } = await admin
      .from("products")
      .select("inventory_count")
      .eq("id", productId)
      .maybeSingle();

    if (productRow) {
      await admin
        .from("products")
        .update({
          inventory_count: Math.max(0, productRow.inventory_count - quantity),
          updated_at: new Date().toISOString(),
        })
        .eq("id", productId);
    }
  }
}

export async function processPaidCheckoutSession(
  stripe: Stripe,
  session: Stripe.Checkout.Session,
): Promise<ProcessCheckoutResult> {
  if (session.payment_status !== "paid") {
    return { ok: true, skipped: "unpaid" };
  }

  const admin = getAdminClient();
  if (!admin) {
    return { ok: false, error: "Supabase admin client not configured" };
  }

  const shippingRateCents = parseInt(
    session.metadata?.shipping_rate_cents ?? "0",
    10,
  );

  const { lineItems, inventoryAdjustments } = await buildLineItems(
    stripe,
    session,
  );

  if (lineItems.length === 0) {
    return { ok: false, error: "No line items parsed from checkout session" };
  }

  const subtotalCents =
    session.amount_subtotal ??
    lineItems.reduce(
      (sum, item) => sum + Math.round(item.unitPrice * 100) * item.quantity,
      0,
    );
  const shippingCents =
    session.total_details?.amount_shipping ?? shippingRateCents;
  const totalCents = session.amount_total ?? subtotalCents + shippingCents;

  const shippingAddress =
    session.collected_information?.shipping_details?.address ??
    session.customer_details?.address ??
    null;
  const customerEmail =
    session.customer_details?.email ?? session.customer_email ?? "";

  let orderId = session.id;

  const { data: existing } = await admin
    .from("orders")
    .select("id")
    .eq("stripe_session_id", session.id)
    .maybeSingle();

  if (existing) {
    orderId = existing.id;
    return {
      ok: true,
      orderId,
      customerEmail,
      skipped: "duplicate",
    };
  }

  const { data: order, error: insertError } = await admin
    .from("orders")
    .insert({
      stripe_session_id: session.id,
      customer_email: customerEmail || "unknown@checkout.magali.store",
      line_items: lineItems,
      shipping_address: shippingAddress,
      shipping_rate_cents: shippingCents,
      subtotal_cents: subtotalCents,
      shipping_cents: shippingCents,
      total_cents: totalCents,
      status: "paid",
    })
    .select("id")
    .single();

  if (insertError) {
    console.error("Failed to insert order:", insertError.message);
    return { ok: false, error: insertError.message };
  }

  orderId = order.id;
  await decrementInventory(admin, inventoryAdjustments);

  const emailData: OrderEmailData = {
    orderId,
    customerEmail,
    lineItems,
    shippingAddress: shippingAddress ?? undefined,
    subtotalCents,
    shippingCents,
    totalCents,
  };

  let confirmationSent = false;
  let fulfillmentSent = false;

  if (customerEmail) {
    confirmationSent = await sendOrderConfirmationEmail(emailData);
    if (!confirmationSent) {
      console.error("Order confirmation email failed for", customerEmail);
    }
  } else {
    console.error("Checkout session missing customer email:", session.id);
  }

  fulfillmentSent = await sendFulfillmentEmail(emailData);
  if (!fulfillmentSent) {
    console.error("Fulfillment email failed for order", orderId);
  }

  return {
    ok: true,
    orderId,
    customerEmail,
    confirmationSent,
    fulfillmentSent,
  };
}
