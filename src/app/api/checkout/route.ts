import { NextResponse } from "next/server";
import { z } from "zod";
import { FROZEN_CHECKOUT_ENABLED, siteConfig } from "@/config/site";
import { toCents } from "@/lib/currency";
import { getProductById } from "@/lib/products";
import { getStripe } from "@/lib/stripe";

const checkoutSchema = z.object({
  items: z
    .array(
      z.object({
        productId: z.string(),
        quantity: z.number().int().min(1).max(99),
      }),
    )
    .min(1),
});

export async function POST(request: Request) {
  try {
    const stripe = getStripe();
    if (!stripe) {
      return NextResponse.json(
        { error: "Checkout is temporarily unavailable. Please contact us to place an order." },
        { status: 503 },
      );
    }

    const body = await request.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid checkout request" },
        { status: 400 },
      );
    }

    const lineItems: { price_data: { currency: string; product_data: { name: string; images?: string[] }; unit_amount: number }; quantity: number }[] = [];
    let hasFrozen = false;

    for (const item of parsed.data.items) {
      const product = getProductById(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 },
        );
      }

      if (product.shippingClass === "frozen") {
        hasFrozen = true;
      }

      lineItems.push({
        price_data: {
          currency: product.currency.toLowerCase(),
          product_data: {
            name: product.name,
            images: product.images.map(
              (image) => `${siteConfig.url}${image}`,
            ),
          },
          unit_amount: toCents(product.price),
        },
        quantity: item.quantity,
      });
    }

    if (hasFrozen && !FROZEN_CHECKOUT_ENABLED) {
      return NextResponse.json(
        {
          error:
            "Frozen-item shipping is being finalized. Please contact Magali to order this item.",
        },
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      success_url: `${siteConfig.url}/cart?checkout=success`,
      cancel_url: `${siteConfig.url}/cart?checkout=cancelled`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Unable to create checkout session" },
        { status: 500 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Checkout error:", error);
    return NextResponse.json(
      { error: "Checkout failed. Please try again." },
      { status: 500 },
    );
  }
}
