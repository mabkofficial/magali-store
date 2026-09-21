"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";

/** Clears persisted cart once when the confirmation screen mounts. */
export function OrderConfirmationClearCart() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return null;
}
