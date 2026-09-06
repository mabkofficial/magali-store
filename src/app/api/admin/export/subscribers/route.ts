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

export async function GET() {
  const adminUser = await getAdminContext();
  if (!adminUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = getAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }

  const { data } = await admin
    .from("newsletter_subscribers")
    .select("email, source, created_at")
    .order("created_at", { ascending: false });

  const headers = ["email", "source", "created_at"];
  const rows = data ?? [];

  const csv = toCsv(headers, rows);
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="magali-subscribers.csv"',
    },
  });
}
