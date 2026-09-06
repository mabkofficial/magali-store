"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";

export function CheckoutStatus() {
  const searchParams = useSearchParams();
  const checkout = searchParams.get("checkout");
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    if (checkout === "success") {
      clearCart();
      toast.success("Thank you for your order. A confirmation email is on its way.");
    } else if (checkout === "cancelled") {
      toast.info("Checkout was cancelled.");
    }
  }, [checkout, clearCart]);

  return null;
}
