import { NextResponse } from "next/server";
import Stripe from "stripe";
import { processPaidCheckoutSession } from "@/lib/process-checkout-session";
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

    try {
      const result = await processPaidCheckoutSession(stripe, session);

      if (!result.ok) {
        console.error("Checkout session processing failed:", result.error);
        return NextResponse.json(
          { error: result.error ?? "Processing failed" },
          { status: 500 },
        );
      }
    } catch (error) {
      console.error("Webhook handler error:", error);
      return NextResponse.json(
        { error: "Internal processing error" },
        { status: 500 },
      );
    }
  }

  return NextResponse.json({ received: true });
}
