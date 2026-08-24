import { Suspense } from "react";
import { PageContainer } from "@/components/layout/page-container";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { CartContent, CartContentFallback } from "@/components/cart/cart-content";
import { CheckoutStatus } from "@/components/cart/checkout-status";

export const metadata = {
  title: "Your Cart",
  description: "Review your Magali cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <PageContainer className="py-10 sm:py-12 lg:py-16">
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: "Cart" },
        ]}
      />
      <h1 className="mb-10 font-display text-4xl text-ink lg:text-5xl">Cart</h1>
      <Suspense fallback={null}>
        <CheckoutStatus />
      </Suspense>
      <Suspense fallback={<CartContentFallback />}>
        <CartContent />
      </Suspense>
    </PageContainer>
  );
}
