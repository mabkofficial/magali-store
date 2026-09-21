import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CartContent, CartContentFallback } from "@/components/cart/cart-content";
import { CheckoutStatus } from "@/components/cart/checkout-status";

import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Your Cart",
  description: "Review your Magali cart and proceed to checkout.",
  path: "/cart",
  noIndex: true,
});

export default function CartPage() {
  return (
    <PageContainer pageY>
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: "Cart" },
        ]}
      />
      <h1 className="mb-8 font-display text-3xl text-ink sm:text-4xl">Cart</h1>
      <Suspense fallback={null}>
        <CheckoutStatus />
      </Suspense>
      <Suspense fallback={<CartContentFallback />}>
        <CartContent />
      </Suspense>
    </PageContainer>
  );
}
