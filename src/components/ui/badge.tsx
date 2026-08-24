import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "food" | "wellness";
  className?: string;
}

export function Badge({
  children,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
