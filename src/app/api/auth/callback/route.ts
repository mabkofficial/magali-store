import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { bootstrapCustomerAccount } from "@/lib/customer/auth";
import { safeCustomerRedirectPath } from "@/lib/customer/redirect";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = safeCustomerRedirectPath(searchParams.get("next"));

  if (code) {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          },
        },
      },
    );

    const { data } = await supabase.auth.exchangeCodeForSession(code);

    if (data.user && next.startsWith("/account")) {
      await bootstrapCustomerAccount(data.user);
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}
