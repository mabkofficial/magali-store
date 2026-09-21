import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RegisterForm } from "./register-form";
import { AuthOAuthAlert } from "@/components/account/auth-oauth-alert";
import { AccountAuthShell } from "@/components/account/auth-shell";
import { AuthDivider } from "@/components/account/auth-divider";
import { GoogleSignInButton } from "@/components/account/google-sign-in-button";
import { safeCustomerRedirectPath } from "@/lib/customer/redirect";
import { buildNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildNoIndexMetadata({
  title: "Create account",
  description: "Create your Magali account.",
});

export default async function AccountRegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const { next: rawNext } = await searchParams;
  const next = safeCustomerRedirectPath(rawNext);

  return (
    <AccountAuthShell
      title="Create account"
      description="Save your wishlist and view order history in one place."
    >
      <Suspense fallback={null}>
        <AuthOAuthAlert />
      </Suspense>
      <RegisterForm next={next} />
      <AuthDivider />
      <GoogleSignInButton next={next} />
      <p className="mt-8 text-center text-sm text-muted">
        Already have an account?{" "}
        <Link
          href={`/account/login${next !== "/account" ? `?next=${encodeURIComponent(next)}` : ""}`}
          className="text-ink underline underline-offset-4"
        >
          Sign in
        </Link>
      </p>
    </AccountAuthShell>
  );
}
