import { PageContainer } from "@/components/layout/page-container";
import { cn } from "@/lib/utils";

interface SectionShellProps {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  as?: "section" | "div";
  bordered?: boolean;
  muted?: boolean;
}

export function SectionShell({
  children,
  className,
  containerClassName,
  as: Tag = "section",
  bordered = true,
  muted = false,
}: SectionShellProps) {
  return (
    <Tag
      className={cn(
        bordered && "border-b border-border",
        muted && "bg-surface-muted",
        !muted && bordered && "bg-surface",
        className,
      )}
    >
      <PageContainer sectionY className={containerClassName}>
        {children}
      </PageContainer>
    </Tag>
  );
}
