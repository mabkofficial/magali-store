import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminClient } from "@/lib/supabase/admin";
import {
  sendFulfillmentEmail,
  sendOrderConfirmationEmail,
} from "@/lib/email";
import { getBundleById, parseCartMetadataEntry } from "@/lib/bundles";
import { getProductByIdSync } from "@/lib/products";
import { toCents } from "@/lib/currency";
import { getStripe } from "@/lib/stripe";

export async function POST(request: Request) {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !webhookSecret) {
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 },
    );
  }

  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch (error) {
    console.error("Webhook signature verification failed:", error);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    if (session.payment_status !== "paid") {
      return NextResponse.json({ received: true });
    }

    const admin = getAdminClient();
    const cartItemsRaw = session.metadata?.cart_items ?? "";
    const shippingRateCents = parseInt(
      session.metadata?.shipping_rate_cents ?? "0",
      10,
    );

    const lineItems: {
      productId: string;
      name: string;
      quantity: number;
      unitPrice: number;
    }[] = [];
    const inventoryAdjustments = new Map<string, number>();

    const cartEntries = cartItemsRaw.split(",").filter(Boolean);
    const stripeLineItems = await stripe.checkout.sessions.listLineItems(
      session.id,
      { limit: 100 },
    );

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
          productId: parsed.id,
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
        productId: parsed.id,
        name: product?.name ?? stripeItem?.description ?? parsed.id,
        quantity,
        unitPrice: unitPriceCents / 100,
      });

      inventoryAdjustments.set(
        parsed.id,
        (inventoryAdjustments.get(parsed.id) ?? 0) + quantity,
      );
    });

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

    if (admin) {
      const { data: existing } = await admin
        .from("orders")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();

      if (!existing) {
        const { data: order, error } = await admin
          .from("orders")
          .insert({
            stripe_session_id: session.id,
            customer_email: customerEmail,
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

        if (error) {
          console.error("Failed to insert order:", error.message);
        } else if (order) {
          orderId = order.id;

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
                  inventory_count: Math.max(
                    0,
                    productRow.inventory_count - quantity,
                  ),
                  updated_at: new Date().toISOString(),
                })
                .eq("id", productId);
            }
          }
        }
      }
    }

    if (customerEmail) {
      const emailData = {
        orderId,
        customerEmail,
        lineItems,
        shippingAddress: shippingAddress ?? undefined,
        subtotalCents,
        shippingCents,
        totalCents,
      };

      await sendOrderConfirmationEmail(emailData);
      await sendFulfillmentEmail(emailData);
    }
  }

  return NextResponse.json({ received: true });
}
