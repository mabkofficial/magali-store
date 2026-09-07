import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "w-full border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink",
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
      "w-full border border-border bg-surface px-4 py-3 text-sm text-ink placeholder:text-muted-light focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink",
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
    className={cn("eyebrow mb-2 block text-ink", className)}
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
      "w-full cursor-pointer border border-border bg-surface px-4 py-3 text-sm text-ink focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ink",
      className,
    )}
    {...props}
  />
));

Select.displayName = "Select";
