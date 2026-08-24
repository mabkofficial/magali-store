import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
  narrow?: boolean;
}

export function PageContainer({
  children,
  className,
  as: Tag = "div",
  narrow = false,
}: PageContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8",
        narrow ? "max-w-3xl" : "max-w-7xl",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
