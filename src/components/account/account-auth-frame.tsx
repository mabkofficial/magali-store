import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { PageContainer } from "@/components/layout/page-container";

/** Minimal chrome for sign-in / register — one logo, no storefront header duplication. */
export function AccountAuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[70vh] flex-col bg-surface-muted">
      <PageContainer className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-6">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.1em] text-muted transition-colors hover:text-botanical"
        >
          <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
          Back to shop
        </Link>
        <BrandLogo variant="wordmark" />
        <span aria-hidden />
      </PageContainer>
      <main className="flex flex-1 flex-col">{children}</main>
      <footer className="py-8 text-center text-xs text-muted">
        <Link href="/contact" className="underline-offset-4 hover:underline">
          Need help?
        </Link>
      </footer>
    </div>
  );
}
