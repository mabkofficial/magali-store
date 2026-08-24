import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "food" | "wellness";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium uppercase tracking-wide",
        variant === "default" &&
          "bg-magali-cream-100 text-magali-green-800",
        variant === "food" && "bg-red-50 text-magali-red-700",
        variant === "wellness" && "bg-amber-50 text-magali-gold-600",
        className,
      )}
    >
      {children}
    </span>
  );
}
