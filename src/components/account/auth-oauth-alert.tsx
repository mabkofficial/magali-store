"use client";

import { useSearchParams } from "next/navigation";

export function AuthOAuthAlert() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (!error) return null;

  return (
    <p
      className="mb-6 border border-border bg-surface-muted px-3 py-2 text-sm text-ink"
      role="alert"
    >
      {error}
    </p>
  );
}
