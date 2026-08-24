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
          "pressable inline-flex cursor-pointer items-center justify-center font-medium uppercase tracking-[0.1em] transition-[transform,background-color,border-color,color] duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-2 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40",
          variant === "primary" && "bg-ink text-surface hover:bg-ink/85",
          variant === "secondary" && "bg-ink text-surface hover:bg-ink/85",
          variant === "outline" &&
            "border border-ink bg-transparent text-ink hover:bg-surface-muted",
          variant === "ghost" &&
            "bg-transparent text-ink underline-offset-4 hover:underline",
          size === "sm" && "px-4 py-2.5 text-[11px]",
          size === "md" && "px-6 py-3 text-xs",
          size === "lg" && "px-8 py-3.5 text-xs",
          className,
        )}
        {...props}
      />
    );
  },
);

Button.displayName = "Button";
