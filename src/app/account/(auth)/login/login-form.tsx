"use client";

import Link from "next/link";
import { useState } from "react";
import { customerSignIn } from "@/app/account/(auth)/actions";
import { Button } from "@/components/ui/button";

export function LoginForm({ next }: { next: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-4"
      action={async (formData) => {
        setPending(true);
        setError(null);
        formData.set("next", next);
        const result = await customerSignIn(formData);
        if (result?.error) {
          setError(result.error);
          setPending(false);
        }
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
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label htmlFor="password" className="text-sm text-ink">
            Password
          </label>
          <Link
            href="/account/forgot-password"
            className="text-xs text-muted underline-offset-4 hover:underline"
          >
            Forgot password?
          </Link>
        </div>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full border border-border bg-surface px-3 py-2 text-sm"
        />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" className="w-full" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
