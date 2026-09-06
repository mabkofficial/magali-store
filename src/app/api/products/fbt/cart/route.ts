import { NextResponse } from "next/server";
import { getCartFbtSuggestions } from "@/lib/product-recommendations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const idsParam = searchParams.get("ids");

  if (!idsParam) {
    return NextResponse.json({ error: "ids is required" }, { status: 400 });
  }

  const cartProductIds = idsParam
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean);

  const suggestions = await getCartFbtSuggestions(cartProductIds);

  return NextResponse.json({ suggestions });
}
