import { cn } from "@/lib/utils";

interface PageContainerProps {
  children: React.ReactNode;
  className?: string;
  as?: "div" | "section";
  narrow?: boolean;
  /** Apply .page-y — shop, cart, collection pages (48/64px) */
  pageY?: boolean;
  /** Apply .section-y — homepage sections, footer (48/64/80px) */
  sectionY?: boolean;
}

export function PageContainer({
  children,
  className,
  as: Tag = "div",
  narrow = false,
  pageY = false,
  sectionY = false,
}: PageContainerProps) {
  return (
    <Tag
      className={cn(
        "mx-auto w-full min-w-0 px-4 sm:px-6 lg:px-8",
        narrow ? "max-w-3xl" : "max-w-7xl",
        pageY && "page-y",
        sectionY && "section-y",
        className,
      )}
    >
      {children}
    </Tag>
  );
}
