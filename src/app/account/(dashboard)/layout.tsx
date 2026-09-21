import type { Metadata } from "next";
import Link from "next/link";
import { AccountNav } from "@/components/account/account-nav";
import { PageContainer } from "@/components/layout/page-container";
import { customerSignOut } from "@/app/account/(auth)/actions";
import { getCustomerContext } from "@/lib/customer/auth";
import { buildNoIndexMetadata } from "@/lib/seo/metadata";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = buildNoIndexMetadata({
  title: "My account",
  description: "Manage your Magali account.",
});

export default async function AccountDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await getCustomerContext();
  if (!customer) {
    redirect("/account/login");
  }

  return (
    <PageContainer sectionY className="max-w-4xl">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="eyebrow text-muted">Account</p>
          <h1 className="mt-2 font-display text-3xl text-ink">
            {customer.fullName ?? "Welcome back"}
          </h1>
          <p className="mt-1 text-sm text-muted">{customer.email}</p>
        </div>
        <form action={customerSignOut}>
          <Button type="submit" variant="outline" size="sm">
            Sign out
          </Button>
        </form>
      </div>
      <div className="mt-8">
        <AccountNav />
      </div>
      <div className="mt-8">{children}</div>
      <p className="mt-12 text-center text-sm text-muted">
        Need help?{" "}
        <Link href="/contact" className="text-ink underline underline-offset-4">
          Contact us
        </Link>
      </p>
    </PageContainer>
  );
}
