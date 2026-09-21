"use client";

import { useState } from "react";
import { customerSignUp } from "@/app/account/(auth)/actions";
import {
  AuthFormField,
  AuthInput,
} from "@/components/account/auth-form-field";
import { Button } from "@/components/ui/button";

export function RegisterForm({ next }: { next: string }) {
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="space-y-5"
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
      <AuthFormField id="fullName" label="Full name">
        <AuthInput
          id="fullName"
          name="fullName"
          type="text"
          autoComplete="name"
        />
      </AuthFormField>

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
        hint="At least 8 characters."
      >
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
        <p className="border border-border bg-surface-muted px-3 py-2 text-sm text-ink" role="alert">
          {error}
        </p>
      )}

      <Button type="submit" className="w-full" size="lg" disabled={pending}>
        {pending ? "Creating account…" : "Create account"}
      </Button>
    </form>
  );
}
