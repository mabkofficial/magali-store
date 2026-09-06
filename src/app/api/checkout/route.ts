import { NextResponse } from "next/server";
import { z } from "zod";
import { FROZEN_CHECKOUT_ENABLED, siteConfig } from "@/config/site";
import { toCents } from "@/lib/currency";
import { getProductById } from "@/lib/products";
import { getPrimaryImageUrl } from "@/lib/products/images";
import {
  getFrozenShippingRateCents,
  getStandardShippingRateCents,
} from "@/lib/shipping";
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
        {
          error:
            "Checkout is temporarily unavailable. Please contact us to place an order.",
        },
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

    const lineItems: {
      price_data: {
        currency: string;
        product_data: { name: string; images?: string[] };
        unit_amount: number;
      };
      quantity: number;
    }[] = [];
    let hasFrozen = false;
    const metadataItems: string[] = [];

    for (const item of parsed.data.items) {
      const product = await getProductById(item.productId);

      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 },
        );
      }

      if (!product.isActive) {
        return NextResponse.json(
          { error: `${product.name} is no longer available.` },
          { status: 400 },
        );
      }

      if (product.inventoryCount <= 0) {
        return NextResponse.json(
          { error: `${product.name} is out of stock.` },
          { status: 400 },
        );
      }

      if (item.quantity > product.inventoryCount) {
        return NextResponse.json(
          {
            error: `Only ${product.inventoryCount} of ${product.name} available.`,
          },
          { status: 400 },
        );
      }

      if (product.shippingClass === "frozen") {
        hasFrozen = true;
      }

      metadataItems.push(`${product.id}:${item.quantity}`);
      lineItems.push({
        price_data: {
          currency: product.currency.toLowerCase(),
          product_data: {
            name: product.name,
            images: [
              (() => {
                const image = getPrimaryImageUrl(product.images);
                return image.startsWith("http")
                  ? image
                  : `${siteConfig.url}${image}`;
              })(),
            ],
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

    const standardRate = getStandardShippingRateCents();
    const frozenRate = getFrozenShippingRateCents();
    const shippingRate = hasFrozen ? frozenRate : standardRate;
    const shippingLabel = hasFrozen ? "Frozen shipping" : "Standard shipping";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: undefined,
      billing_address_collection: "auto",
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: "fixed_amount",
            fixed_amount: {
              amount: shippingRate,
              currency: "usd",
            },
            display_name: shippingLabel,
            delivery_estimate: {
              minimum: { unit: "business_day", value: hasFrozen ? 1 : 5 },
              maximum: { unit: "business_day", value: hasFrozen ? 2 : 7 },
            },
          },
        },
      ],
      metadata: {
        cart_items: metadataItems.join(","),
        has_frozen: hasFrozen ? "true" : "false",
        shipping_rate_cents: String(shippingRate),
      },
      success_url: `${siteConfig.url}/cart?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
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
