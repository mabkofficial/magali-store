"use client";

import Link from "next/link";
import { useState } from "react";
import { customerRequestPasswordReset } from "@/app/account/(auth)/actions";
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
        <p className="text-sm text-muted">
          If an account exists for that email, a reset link is on its way. Check
          your inbox and spam folder.
        </p>
      ) : (
        <form
          className="space-y-4"
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
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm text-ink">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              className="w-full border border-border bg-surface px-3 py-2 text-sm"
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}
      <p className="mt-6 text-center text-sm text-muted">
        <Link href="/account/login" className="text-ink underline underline-offset-4">
          Back to sign in
        </Link>
      </p>
    </AccountAuthShell>
  );
}
