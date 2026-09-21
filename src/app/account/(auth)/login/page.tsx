import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { LoginForm } from "./login-form";
import { AuthOAuthAlert } from "@/components/account/auth-oauth-alert";
import { AccountAuthShell } from "@/components/account/auth-shell";
import { AuthDivider } from "@/components/account/auth-divider";
import { GoogleSignInButton } from "@/components/account/google-sign-in-button";
import { safeCustomerRedirectPath } from "@/lib/customer/redirect";
import { buildNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildNoIndexMetadata({
  title: "Sign in",
  description: "Sign in to your Magali account.",
});

export default async function AccountLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: rawNext } = await searchParams;
  const next = safeCustomerRedirectPath(rawNext);

  return (
    <AccountAuthShell
      title="Sign in"
      description="Track orders, wishlists, and saved addresses."
    >
      <Suspense fallback={null}>
        <AuthOAuthAlert />
      </Suspense>
      <LoginForm next={next} />
      <AuthDivider />
      <GoogleSignInButton next={next} />
      <p className="mt-8 text-center text-sm text-muted">
        New here?{" "}
        <Link
          href={`/account/register${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="text-ink underline underline-offset-4"
        >
          Create an account
        </Link>
      </p>
    </AccountAuthShell>
  );
}
