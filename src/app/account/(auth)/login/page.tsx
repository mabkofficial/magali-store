import type { Metadata } from "next";
import Link from "next/link";
import { LoginForm } from "./login-form";
import { AccountAuthShell } from "@/components/account/auth-shell";
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
      <LoginForm next={next} />
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-xs uppercase tracking-[0.1em]">
          <span className="bg-surface px-2 text-muted">Or</span>
        </div>
      </div>
      <GoogleSignInButton next={next} />
      <p className="mt-6 text-center text-sm text-muted">
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
