"use client";

import Link from "next/link";
import { useState } from "react";
import { customerRequestPasswordReset } from "@/app/account/(auth)/actions";
import {
  AuthFormField,
  AuthInput,
} from "@/components/account/auth-form-field";
import { AccountAuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  return (
    <AccountAuthShell
      title="Reset password"
      description="We will email you a link to choose a new password."
    >
      {sent ? (
        <p className="text-sm leading-relaxed text-muted">
          If an account exists for that email, a reset link is on its way. Check
          your inbox and spam folder.
        </p>
      ) : (
        <form
          className="space-y-5"
          action={async (formData) => {
            setPending(true);
            setError(null);
            const result = await customerRequestPasswordReset(formData);
            if (result?.error) {
              setError(result.error);
              setPending(false);
              return;
            }
            setSent(true);
            setPending(false);
          }}
        >
          <AuthFormField id="email" label="Email">
            <AuthInput
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              spellCheck={false}
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
            {pending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
      <p className="mt-8 text-center text-sm text-muted">
        <Link
          href="/account/login"
          className="text-ink underline underline-offset-4"
        >
          Back to sign in
        </Link>
      </p>
    </AccountAuthShell>
  );
}
