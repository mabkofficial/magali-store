import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";
import { bootstrapCustomerAccount } from "@/lib/customer/auth";
import {
  AUTH_NEXT_COOKIE,
  parseAuthNextCookie,
} from "@/lib/customer/auth-cookie";
import { safeCustomerRedirectPath } from "@/lib/customer/redirect";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const oauthError =
    searchParams.get("error_description") ?? searchParams.get("error");

  const cookieStore = await cookies();
  const nextFromCookie = parseAuthNextCookie(
    cookieStore.get(AUTH_NEXT_COOKIE)?.value,
  );
  const next = safeCustomerRedirectPath(
    nextFromCookie ?? searchParams.get("next"),
  );

  if (oauthError) {
    const loginUrl = new URL("/account/login", origin);
    loginUrl.searchParams.set("error", oauthError);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_NEXT_COOKIE);
    return response;
  }

  let response = NextResponse.redirect(`${origin}${next}`);
  response.cookies.delete(AUTH_NEXT_COOKIE);

  if (!code) {
    return response;
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  const { data, error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    const loginUrl = new URL("/account/login", origin);
    loginUrl.searchParams.set("error", error.message);
    response = NextResponse.redirect(loginUrl);
    response.cookies.delete(AUTH_NEXT_COOKIE);
    return response;
  }

  if (data.user && next.startsWith("/account")) {
    await bootstrapCustomerAccount(data.user);
  }

  return response;
}
