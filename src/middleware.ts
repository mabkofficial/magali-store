import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { isAccountAuthPath } from "@/lib/customer/redirect";

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: { headers: request.headers },
  });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const pathname = request.nextUrl.pathname;

  if (!supabaseUrl || !supabaseAnonKey) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/account")) {
      if (pathname.startsWith("/admin")) {
        return NextResponse.redirect(new URL("/", request.url));
      }
      if (pathname.startsWith("/account") && !isAccountAuthPath(pathname)) {
        return NextResponse.redirect(new URL("/account/login", request.url));
      }
    }
    return response;
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        response = NextResponse.next({ request: { headers: request.headers } });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const isAdminRoute = pathname.startsWith("/admin");
  const isAdminLoginRoute = pathname === "/admin/login";
  const isAccountRoute = pathname.startsWith("/account");

  if (isAdminRoute && !isAdminLoginRoute && !user) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  if (isAdminLoginRoute && user) {
    return NextResponse.redirect(new URL("/admin/products", request.url));
  }

  if (isAccountRoute) {
    const isAuthPage = isAccountAuthPath(pathname);
    if (!user && !isAuthPage) {
      const loginUrl = new URL("/account/login", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (user && isAuthPage && pathname !== "/account/reset-password") {
      return NextResponse.redirect(new URL("/account", request.url));
    }
  }

  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/account/:path*"],
};
