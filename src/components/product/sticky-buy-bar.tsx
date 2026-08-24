"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { FROZEN_CHECKOUT_ENABLED } from "@/config/site";
import { formatUSD } from "@/lib/currency";
import { useAddToCart } from "@/hooks/use-cart-ui";
import type { Product } from "@/types/product";

interface StickyBuyBarProps {
  product: Product;
}

export function StickyBuyBar({ product }: StickyBuyBarProps) {
  const addToCart = useAddToCart();
  const [visible, setVisible] = useState(false);
  const isFrozenBlocked =
    product.shippingClass === "frozen" && !FROZEN_CHECKOUT_ENABLED;

  useEffect(() => {
    const handleScroll = () => {
      setVisible(window.scrollY > 400);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-surface lg:hidden">
      <PageContainer className="flex items-center gap-4 py-3">
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm text-ink">{product.shortName}</p>
          <p className="text-sm font-medium text-ink">{formatUSD(product.price)}</p>
        </div>
        {isFrozenBlocked ? (
          <Link href="/contact">
            <Button size="sm" variant="outline">
              Contact
            </Button>
          </Link>
        ) : (
          <Button size="sm" onClick={() => addToCart(product)}>
            Add to Cart
          </Button>
        )}
      </PageContainer>
    </div>
  );
}
