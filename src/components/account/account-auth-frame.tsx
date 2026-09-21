import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { BrandLogo } from "@/components/layout/brand-logo";
import { PageContainer } from "@/components/layout/page-container";

/** Minimal chrome for sign-in / register — one logo, no storefront header duplication. */
export function AccountAuthFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[70vh] flex-col bg-surface">
      <PageContainer className="border-b border-border py-6">
        <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
          <Link
            href="/shop"
            className="inline-flex min-h-11 items-center gap-2 self-start text-xs uppercase tracking-[0.1em] text-muted transition-colors duration-150 hover:text-ink"
          >
            <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden />
            Back to shop
          </Link>
          <BrandLogo
            variant="logo"
            imageClassName="h-7 w-auto sm:h-8"
            priority
            className="sm:absolute sm:left-1/2 sm:-translate-x-1/2"
          />
          <span className="hidden w-[7.5rem] sm:block" aria-hidden />
        </div>
      </PageContainer>
      <main className="flex flex-1 flex-col bg-surface-muted">{children}</main>
      <footer className="border-t border-border bg-surface py-8 text-center text-xs text-muted">
        <Link
          href="/contact"
          className="min-h-11 inline-flex items-center underline-offset-4 hover:underline"
        >
          Need help?
        </Link>
      </footer>
    </div>
  );
}
