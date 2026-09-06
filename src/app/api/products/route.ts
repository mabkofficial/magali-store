import { NextResponse } from "next/server";
import { getProductSearchList } from "@/lib/products";

export async function GET() {
  const products = await getProductSearchList();
  return NextResponse.json({ products });
}
