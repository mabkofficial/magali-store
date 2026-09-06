import { NextResponse } from "next/server";
import { getAdminContext } from "@/lib/admin/auth";
import { getAdminClient } from "@/lib/supabase/admin";

function csvEscape(value: unknown): string {
  const text = value == null ? "" : String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(headers: string[], rows: Record<string, unknown>[]) {
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => csvEscape(row[header])).join(","));
  }
  return lines.join("\n");
}

async function requireExportAccess() {
  const adminUser = await getAdminContext();
  if (!adminUser) return null;
  const admin = getAdminClient();
  if (!admin) return null;
  return admin;
}

export async function GET() {
  const admin = await requireExportAccess();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await admin.from("products").select("*").order("name");
  const headers = [
    "id",
    "slug",
    "name",
    "category",
    "price",
    "inventory_count",
    "is_active",
    "featured",
    "shipping_class",
  ];
  const rows =
    data?.map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      category: product.category,
      price: product.price,
      inventory_count: product.inventory_count,
      is_active: product.is_active,
      featured: product.featured,
      shipping_class: product.shipping_class,
    })) ?? [];

  const csv = toCsv(headers, rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="magali-products.csv"',
    },
  });
}
