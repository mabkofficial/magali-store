import type { ReactNode } from "react";
import { Input, Label } from "@/components/ui/input";

export function AuthFormField({
  id,
  label,
  hint,
  labelExtra,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  labelExtra?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {labelExtra}
      </div>
      {children}
      {hint && <p className="text-xs text-muted">{hint}</p>}
    </div>
  );
}

export function AuthInput(
  props: React.ComponentProps<typeof Input>,
) {
  return <Input {...props} />;
}
