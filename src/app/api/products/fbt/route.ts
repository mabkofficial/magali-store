import { NextResponse } from "next/server";
import { getFrequentlyBoughtTogetherById } from "@/lib/product-recommendations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const anchorId = searchParams.get("anchorId");

  if (!anchorId) {
    return NextResponse.json({ error: "anchorId is required" }, { status: 400 });
  }

  const bundle = await getFrequentlyBoughtTogetherById(anchorId);

  if (!bundle) {
    return NextResponse.json({ bundle: null });
  }

  return NextResponse.json({ bundle });
}
