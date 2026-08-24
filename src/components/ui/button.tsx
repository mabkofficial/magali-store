import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magali-gold-600 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
          variant === "primary" &&
            "bg-magali-green-950 text-magali-cream-50 hover:bg-magali-green-800",
          variant === "secondary" &&
            "bg-magali-gold-600 text-white hover:bg-magali-gold-500",
          variant === "outline" &&
            "border border-magali-green-800 bg-transparent text-magali-green-950 hover:bg-magali-cream-100",
          variant === "ghost" &&
            "bg-transparent text-magali-green-950 hover:bg-magali-cream-100",
          size === "sm" && "px-4 py-2 text-sm",
          size === "md" && "px-6 py-3 text-sm",
          size === "lg" && "px-8 py-4 text-base",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
