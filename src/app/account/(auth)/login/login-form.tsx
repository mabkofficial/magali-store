"use client";

import Link from "next/link";
import { useState } from "react";
import { customerSignIn } from "@/app/account/(auth)/actions";
import {
  AuthFormField,
  AuthInput,
} from "@/components/account/auth-form-field";
import { Button } from "@/components/ui/button";

export function LoginForm({ next }: { next: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-5"
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

      <AuthFormField
        id="password"
        label="Password"
        labelExtra={
          <Link
            href="/account/forgot-password"
            className="text-xs text-muted underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline"
          >
            Forgot password?
          </Link>
        }
      >
        <AuthInput
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
        />
      </AuthFormField>

      {error && (
        <p className="border border-border bg-surface-muted px-3 py-2 text-sm text-ink" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Signing in…" : "Sign in"}
      </Button>
    </form>
  );
}
