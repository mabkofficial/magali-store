import { NextResponse } from "next/server";
import { z } from "zod";
import { FROZEN_CHECKOUT_ENABLED, siteConfig } from "@/config/site";
import { toCents } from "@/lib/currency";
import {
  computeComponentDemand,
  getBundleById,
  getBundleMetadataEntry,
  validateComponentDemand,
} from "@/lib/bundles";
import {
  applyFbtUnitDiscount,
  isValidFbtDiscountSet,
} from "@/lib/fbt-config";
import { getProductById } from "@/lib/products";
import { getPrimaryImageUrl } from "@/lib/products/images";
import {
  getFrozenShippingRateCents,
  getStandardShippingRateCents,
} from "@/lib/shipping";
import { getStripe } from "@/lib/stripe";
import { createClient } from "@/lib/supabase/server";

const checkoutSchema = z.object({
  items: z
    .array(
      z
        .object({
          productId: z.string().optional(),
          bundleId: z.string().optional(),
          quantity: z.number().int().min(1).max(99),
          fbtDiscountEligible: z.boolean().optional(),
        })
        .refine(
          (item) => Boolean(item.productId) !== Boolean(item.bundleId),
          "Each line must be either a product or a bundle",
        ),
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

    const demand = computeComponentDemand(
      parsed.data.items.map((item) =>
        item.bundleId
          ? { bundleId: item.bundleId, quantity: item.quantity }
          : { productId: item.productId, quantity: item.quantity },
      ),
    );

    const inventoryCheck = await validateComponentDemand(demand);
    if (!inventoryCheck.ok) {
      return NextResponse.json({ error: inventoryCheck.error }, { status: 400 });
    }

    const fbtEligibleIds = [
      ...new Set(
        parsed.data.items
          .filter((item) => item.fbtDiscountEligible && item.productId)
          .map((item) => item.productId!),
      ),
    ];
    const bundleDiscountActive = isValidFbtDiscountSet(fbtEligibleIds);

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
    let fbtDiscountCents = 0;

    for (const item of parsed.data.items) {
      if (item.bundleId) {
        const bundle = getBundleById(item.bundleId);

        if (!bundle) {
          return NextResponse.json(
            { error: `Bundle not found: ${item.bundleId}` },
            { status: 400 },
          );
        }

        metadataItems.push(getBundleMetadataEntry(bundle.id, item.quantity));
        lineItems.push({
          price_data: {
            currency: bundle.currency.toLowerCase(),
            product_data: {
              name: bundle.name,
              images: [
                (() => {
                  const image = getPrimaryImageUrl(bundle.images);
                  return image.startsWith("http")
                    ? image
                    : `${siteConfig.url}${image}`;
                })(),
              ],
            },
            unit_amount: bundle.priceCents,
          },
          quantity: item.quantity,
        });
        continue;
      }

      const product = await getProductById(item.productId!);

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

      if (product.shippingClass === "frozen") {
        hasFrozen = true;
      }

      const receivesDiscount =
        bundleDiscountActive &&
        Boolean(item.fbtDiscountEligible) &&
        fbtEligibleIds.includes(product.id);

      const unitPrice = receivesDiscount
        ? applyFbtUnitDiscount(product.price)
        : product.price;

      if (receivesDiscount) {
        fbtDiscountCents +=
          (toCents(product.price) - toCents(unitPrice)) * item.quantity;
      }

      metadataItems.push(`${product.id}:${item.quantity}`);
      lineItems.push({
        price_data: {
          currency: product.currency.toLowerCase(),
          product_data: {
            name: receivesDiscount
              ? `${product.name} (Routine bundle)`
              : product.name,
            images: [
              (() => {
                const image = getPrimaryImageUrl(product.images);
                return image.startsWith("http")
                  ? image
                  : `${siteConfig.url}${image}`;
              })(),
            ],
          },
          unit_amount: toCents(unitPrice),
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

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      customer_email: user?.email ?? undefined,
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
        fbt_discount_applied: bundleDiscountActive ? "true" : "false",
        fbt_discount_cents: String(fbtDiscountCents),
        magali_user_id: user?.id ?? "",
      },
      success_url: `${siteConfig.url}/order/confirmation?session_id={CHECKOUT_SESSION_ID}`,
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
