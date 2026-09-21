"use client";

import { useState } from "react";
import { customerSignUp } from "@/app/account/(auth)/actions";
import { Button } from "@/components/ui/button";

export function RegisterForm({ next }: { next: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-4"
      action={async (formData) => {
        setPending(true);
        setError(null);
        formData.set("next", next);
        const result = await customerSignUp(formData);
        if (result?.error) {
          setError(result.error);
          setPending(false);
        }
      }}
    >
      <div className="space-y-2">
        <label htmlFor="fullName" className="text-sm text-ink">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
          className="w-full border border-border bg-surface px-3 py-2 text-sm"
        />
      </div>
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
      <div className="space-y-2">
        <label htmlFor="password" className="text-sm text-ink">
          Password
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
        <p className="text-xs text-muted">At least 8 characters.</p>
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
