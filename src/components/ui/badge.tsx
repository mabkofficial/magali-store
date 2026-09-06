import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/product";

interface BadgeProps {
  children: React.ReactNode;
  category?: ProductCategory;
  className?: string;
}

const categoryStyles: Record<ProductCategory, string> = {
  "Hair Care": "bg-botanical/8 text-botanical",
  Wellness: "bg-clay/12 text-clay",
  Food: "bg-gold-touch/10 text-gold-touch",
};

export function Badge({ children, category, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "eyebrow inline-flex items-center rounded-sm px-2 py-0.5",
        category ? categoryStyles[category] : "text-muted",
        className,
      )}
    >
      {children}
    </span>
  );
}
