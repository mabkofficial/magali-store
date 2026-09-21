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
    <PageContainer sectionY className="mx-auto w-full max-w-md flex-1 pb-12">
      <header className="mb-10 border-b border-border pb-8 text-left">
        <p className="eyebrow text-muted">Account</p>
        <h1 className="mt-3 font-display text-3xl text-ink sm:text-4xl">{title}</h1>
        {description && (
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-muted">
            {description}
          </p>
        )}
      </header>
      <div className="border border-border bg-surface p-6 sm:p-8">{children}</div>
    </PageContainer>
  );
}
