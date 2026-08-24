"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";
import { useCartStore } from "@/store/cart-store";
import type { Product } from "@/types/product";

export function useAddToCart() {
  const addItem = useCartStore((state) => state.addItem);

  return (product: Product, quantity = 1) => {
    addItem(product, quantity);
    toast.success(`${product.shortName} added to cart`);
  };
}

export function useFocusTrap(
  active: boolean,
  containerRef: React.RefObject<HTMLElement | null>,
) {
  useEffect(() => {
    if (!active || !containerRef.current) return;

    const container = containerRef.current;
    const focusable = container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    first?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") return;

      if (event.key !== "Tab" || focusable.length === 0) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first?.focus();
      }
    };

    container.addEventListener("keydown", handleKeyDown);
    return () => container.removeEventListener("keydown", handleKeyDown);
  }, [active, containerRef]);
}

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [active]);
}

export function useCartBump(bumpKey: number) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (bumpKey === 0 || !ref.current) return;
    ref.current.classList.remove("cart-bump");
    void ref.current.offsetWidth;
    ref.current.classList.add("cart-bump");
  }, [bumpKey]);

  return ref;
}
