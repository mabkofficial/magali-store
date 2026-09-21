"use client";

import { useSearchParams } from "next/navigation";

export function AuthOAuthAlert() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  if (!error) return null;

  return (
    <p
      className="mb-4 border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive"
      role="alert"
    >
      {error}
    </p>
  );
}
