"use client";

import { useState } from "react";
import { customerUpdatePassword } from "@/app/account/(auth)/actions";
import {
  AuthFormField,
  AuthInput,
} from "@/components/account/auth-form-field";
import { AccountAuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <AccountAuthShell
      title="Choose a new password"
      description="Use at least 8 characters."
    >
      <form
        className="space-y-5"
        action={async (formData) => {
          setPending(true);
          setError(null);
          const result = await customerUpdatePassword(formData);
          if (result?.error) {
            setError(result.error);
            setPending(false);
          }
        }}
      >
        <AuthFormField id="password" label="New password">
          <AuthInput
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
          />
        </AuthFormField>
        {error && (
          <p
            className="border border-border bg-surface-muted px-3 py-2 text-sm text-ink"
            role="alert"
          >
            {error}
          </p>
        )}
        <Button type="submit" className="w-full" size="lg" disabled={pending}>
          {pending ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AccountAuthShell>
  );
}
