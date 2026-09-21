import { NextResponse } from "next/server";
import { z } from "zod";
import { getCustomerContext } from "@/lib/customer/auth";
import { getWishlistForUser } from "@/lib/customer/wishlist";
import { createClient } from "@/lib/supabase/server";

const bodySchema = z
  .object({
    productId: z.string().optional(),
    bundleId: z.string().optional(),
  })
  .refine(
    (v) => Boolean(v.productId) !== Boolean(v.bundleId),
    "Provide productId or bundleId",
  );

export async function GET() {
  const customer = await getCustomerContext();
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const items = await getWishlistForUser(customer.userId);
  return NextResponse.json({ items, count: items.length });
}

export async function POST(request: Request) {
  const customer = await getCustomerContext();
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase.from("wishlist_items").insert({
    user_id: customer.userId,
    product_id: parsed.data.productId ?? null,
    bundle_id: parsed.data.bundleId ?? null,
  });

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ ok: true, duplicate: true });
    }
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const customer = await getCustomerContext();
  if (!customer) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const supabase = await createClient();
  let query = supabase.from("wishlist_items").delete().eq("user_id", customer.userId);

  if (parsed.data.productId) {
    query = query.eq("product_id", parsed.data.productId);
  } else {
    query = query.eq("bundle_id", parsed.data.bundleId!);
  }

  await query;

  return NextResponse.json({ ok: true });
}
