import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

export const IconButton = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    className={cn(
      "pressable inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center text-ink transition-colors duration-150 hover:bg-surface-muted focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink focus-visible:ring-offset-2",
      className,
    )}
    {...props}
  />
));

IconButton.displayName = "IconButton";
