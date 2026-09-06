import { NextResponse } from "next/server";
import { z } from "zod";
import { getAdminClient } from "@/lib/supabase/admin";

const subscribeSchema = z.object({
  email: z.string().email(),
  source: z.string().optional(),
  promoInterest: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = subscribeSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const admin = getAdminClient();

    if (admin) {
      const { error } = await admin.from("newsletter_subscribers").upsert(
        {
          email: parsed.data.email.toLowerCase(),
          source: parsed.data.source ?? "homepage",
          promo_interest: parsed.data.promoInterest ?? false,
        },
        { onConflict: "email" },
      );

      if (error) {
        console.error("Newsletter signup error:", error.message);
      }
    } else {
      console.log("Newsletter signup (DB not configured):", parsed.data.email);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json({ error: "Unable to subscribe" }, { status: 500 });
  }
}
