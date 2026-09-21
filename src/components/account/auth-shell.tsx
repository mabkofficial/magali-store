import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";

export function AccountAuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <PageContainer sectionY className="mx-auto max-w-md">
      <div className="mb-8 text-center">
        <Link
          href="/"
          className="eyebrow text-muted transition-colors hover:text-botanical"
        >
          Magali
        </Link>
        <h1 className="mt-4 font-display text-3xl text-ink">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-muted">{description}</p>
        )}
      </div>
      <div className="border border-border bg-surface p-6 sm:p-8">{children}</div>
    </PageContainer>
  );
}
