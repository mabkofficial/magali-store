import { Suspense } from "react";
import { CartContent } from "@/components/cart/cart-content";
import { CheckoutStatus } from "@/components/cart/checkout-status";

export const metadata = {
  title: "Your Cart",
  description: "Review your Magali cart and proceed to checkout.",
};

export default function CartPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 lg:px-8">
      <h1 className="mb-10 font-display text-4xl font-semibold text-magali-green-950">
        Your Cart
      </h1>
      <Suspense fallback={null}>
        <CheckoutStatus />
      </Suspense>
      <Suspense fallback={<p>Loading cart...</p>}>
        <CartContent />
      </Suspense>
    </div>
  );
}
