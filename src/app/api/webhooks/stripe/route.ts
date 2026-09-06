import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getAdminClient } from "@/lib/supabase/admin";
import {
  sendFulfillmentEmail,
  sendOrderConfirmationEmail,
} from "@/lib/email";
import { getProductByIdSync } from "@/lib/products";
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

    for (const entry of cartItemsRaw.split(",").filter(Boolean)) {
      const [productId, quantityStr] = entry.split(":");
      const quantity = parseInt(quantityStr, 10);
      const product = getProductByIdSync(productId);

      lineItems.push({
        productId,
        name: product?.name ?? productId,
        quantity,
        unitPrice: product?.price ?? 0,
      });
    }

    const subtotalCents =
      session.amount_subtotal ?? lineItems.reduce(
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

          for (const item of lineItems) {
            const { data: productRow } = await admin
              .from("products")
              .select("inventory_count")
              .eq("id", item.productId)
              .maybeSingle();

            if (productRow) {
              await admin
                .from("products")
                .update({
                  inventory_count: Math.max(
                    0,
                    productRow.inventory_count - item.quantity,
                  ),
                  updated_at: new Date().toISOString(),
                })
                .eq("id", item.productId);
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
