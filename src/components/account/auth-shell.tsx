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
      <div className="mb-8 text-center">
        <p className="eyebrow text-botanical">Account</p>
        <h1 className="mt-3 font-display text-3xl text-ink">{title}</h1>
        {description && (
          <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p>
        )}
      </div>
      <div className="border border-border bg-surface p-6 shadow-sm sm:p-8">
        {children}
      </div>
    </PageContainer>
  );
}
