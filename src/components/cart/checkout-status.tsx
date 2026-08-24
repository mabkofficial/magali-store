"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export function CheckoutStatus() {
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");

  useEffect(() => {
    if (checkout === "success") {
      toast.success("Thank you for your order!");
    } else if (checkout === "cancelled") {
      toast.info("Checkout was cancelled.");
    }
  }, [checkout]);

  return null;
}
