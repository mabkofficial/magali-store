"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function OrderConfirmationGuestCta({
  isLoggedInCheckout,
}: {
  isLoggedInCheckout: boolean;
}) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isLoggedInCheckout) return;
    void (async () => {
      try {
        const res = await fetch("/api/account/wishlist");
        setShow(res.status === 401);
      } catch {
        setShow(true);
      }
    })();
  }, [isLoggedInCheckout]);

  if (!show) return null;

  return (
    <div className="border border-border bg-surface-muted p-5 text-sm">
      <p className="font-medium text-ink">Track this order anytime</p>
      <p className="mt-2 text-muted">
        Create a free account with the same email you used at checkout to view
        order history, save a wishlist, and reorder in one click.
      </p>
      <div className="mt-4 flex flex-wrap gap-4">
        <Link
          href="/account/register?next=/account/orders"
          className="text-ink underline underline-offset-4"
        >
          Create account
        </Link>
        <Link
          href="/account/login?next=/account/orders"
          className="text-ink underline underline-offset-4"
        >
          Sign in
        </Link>
      </div>
    </div>
  );
}
