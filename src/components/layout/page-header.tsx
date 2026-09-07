import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title: React.ReactNode;
  description?: React.ReactNode;
  meta?: React.ReactNode;
  className?: string;
  titleClassName?: string;
  eyebrow?: React.ReactNode;
  eyebrowClassName?: string;
}

export function PageHeader({
  title,
  description,
  meta,
  className,
  titleClassName,
  eyebrow,
  eyebrowClassName,
}: PageHeaderProps) {
  return (
    <header className={cn("page-header", className)}>
      {eyebrow && (
        <p className={cn("eyebrow text-botanical", eyebrowClassName)}>{eyebrow}</p>
      )}
      <h1
        className={cn(
          "font-display text-3xl text-ink sm:text-4xl",
          eyebrow && "mt-2",
          titleClassName,
        )}
      >
        {title}
      </h1>
      {description && (
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted">{description}</p>
      )}
      {meta && <div className="mt-3 text-xs text-muted">{meta}</div>}
    </header>
  );
}
