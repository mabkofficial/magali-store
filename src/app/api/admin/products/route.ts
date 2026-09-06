import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const productUpdateSchema = z.object({
  price: z.number().positive().optional(),
  inventory_count: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
  tagline: z.string().optional(),
  short_description: z.string().optional(),
  overview: z.string().optional(),
});

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data, error } = await admin
    .from("products")
    .select("id, slug, name, price, inventory_count, is_active, category, shipping_class")
    .order("name");

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ products: data });
}

export async function PATCH(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const body = await request.json();
  const parsed = productUpdateSchema.safeParse(body.updates);

  if (!parsed.success || !body.id) {
    return NextResponse.json({ error: "Invalid update" }, { status: 400 });
  }

  const { error } = await admin
    .from("products")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", body.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
