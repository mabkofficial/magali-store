"use client";

import Link from "next/link";
import { useEffect } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <PageContainer narrow pageY className="text-center">
      <p className="eyebrow text-muted">Something went wrong</p>
      <h1 className="mt-4 font-display text-4xl text-ink">We hit a snag</h1>
      <p className="mt-4 text-sm text-muted">
        An unexpected error occurred. You can try again or return to the shop.
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Button type="button" onClick={() => reset()}>
          Try again
        </Button>
        <Link href="/">
          <Button variant="outline">Go home</Button>
        </Link>
      </div>
    </PageContainer>
  );
}
