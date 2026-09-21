"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

/** Handles legacy cart query params and checkout cancellation toasts. */
export function CheckoutStatus() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const checkout = searchParams.get("checkout");
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    if (checkout === "success") {
      const target = sessionId
        ? `/order/confirmation?session_id=${encodeURIComponent(sessionId)}`
        : "/order/confirmation";
      router.replace(target);
      return;
    }
    if (checkout === "cancelled") {
      toast.info("Checkout was cancelled.");
    }
  }, [checkout, sessionId, router]);

  return null;
}
