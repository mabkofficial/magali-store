import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-magali-cream-100 bg-white px-4 py-3 text-sm text-magali-ink placeholder:text-magali-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magali-gold-600",
      className,
    )}
    {...props}
  />
));

Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-magali-cream-100 bg-white px-4 py-3 text-sm text-magali-ink placeholder:text-magali-ink/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magali-gold-600",
      className,
    )}
    {...props}
  />
));

Textarea.displayName = "Textarea";

export const Label = ({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) => (
  <label
    className={cn("mb-2 block text-sm font-medium text-magali-green-950", className)}
    {...props}
  />
);

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement>
>(({ className, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "w-full rounded-xl border border-magali-cream-100 bg-white px-4 py-3 text-sm text-magali-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magali-gold-600",
      className,
    )}
    {...props}
  />
));

Select.displayName = "Select";
