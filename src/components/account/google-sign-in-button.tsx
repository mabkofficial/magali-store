"use client";

import { useState } from "react";
import { customerSignInWithGoogle } from "@/app/account/(auth)/actions";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton({ next }: { next?: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div className="space-y-2">
      <form
        action={async (formData) => {
          setPending(true);
          setError(null);
          if (next) formData.set("next", next);
          const result = await customerSignInWithGoogle(formData);
          if (result?.error) {
            setError(result.error);
            setPending(false);
          }
        }}
      >
        <Button type="submit" variant="outline" className="w-full" disabled={pending}>
          {pending ? "Redirecting…" : "Continue with Google"}
        </Button>
      </form>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
