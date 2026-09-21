"use client";

import { useState } from "react";
import { customerUpdatePassword } from "@/app/account/(auth)/actions";
import { AccountAuthShell } from "@/components/account/auth-shell";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <AccountAuthShell title="Choose a new password">
      <form
        className="space-y-4"
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
        <div className="space-y-2">
          <label htmlFor="password" className="text-sm text-ink">
            New password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full border border-border bg-surface px-3 py-2 text-sm"
          />
        </div>
        {error && <p className="text-sm text-destructive">{error}</p>}
        <Button type="submit" className="w-full" disabled={pending}>
          {pending ? "Updating…" : "Update password"}
        </Button>
      </form>
    </AccountAuthShell>
  );
}
