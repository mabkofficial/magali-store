import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageContainer } from "@/components/layout/page-container";
import { OrderConfirmationClearCart } from "@/components/order/order-confirmation-clear-cart";
import { OrderConfirmationGuestCta } from "@/components/order/order-confirmation-guest-cta";
import { Button } from "@/components/ui/button";
import { getOrderConfirmation } from "@/lib/checkout/confirmation";
import { buildNoIndexMetadata } from "@/lib/seo/metadata";

export const metadata = buildNoIndexMetadata({
  title: "Order confirmed",
  description: "Your Magali order is confirmed.",
});

function formatCents(cents: number) {
  return `$${(cents / 100).toFixed(2)}`;
}

export default async function OrderConfirmationPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id: sessionId } = await searchParams;

  if (!sessionId) {
    redirect("/cart");
  }

  const confirmation = await getOrderConfirmation(sessionId);
  if (!confirmation) {
    notFound();
  }

  return (
    <PageContainer pageY className="max-w-2xl">
      <OrderConfirmationClearCart />
      <Breadcrumbs
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: "Order confirmed" },
        ]}
      />

      <div className="mt-8 flex items-start gap-4">
        <CheckCircle2
          className="mt-1 h-8 w-8 shrink-0 text-botanical"
          strokeWidth={1.5}
          aria-hidden
        />
        <div>
          <p className="eyebrow text-botanical">Thank you</p>
          <h1 className="mt-2 font-display text-3xl text-ink sm:text-4xl">
            Your order is confirmed
          </h1>
          <p className="mt-3 text-sm text-muted">
            Order reference{" "}
            <span className="font-medium text-ink">{confirmation.orderReference}</span>
            {confirmation.customerEmail && (
              <>
                {" "}
                — confirmation sent to{" "}
                <span className="text-ink">{confirmation.customerEmail}</span>
              </>
            )}
          </p>
        </div>
      </div>

      <section className="mt-10 border border-border">
        <h2 className="border-b border-border px-4 py-3 text-sm font-medium text-ink">
          Order summary
        </h2>
        <ul className="divide-y divide-border">
          {confirmation.lineItems.map((item, index) => (
            <li
              key={`${item.name}-${index}`}
              className="flex justify-between gap-4 px-4 py-3 text-sm"
            >
              <div>
                <p className="text-ink">{item.name}</p>
                <p className="text-muted">Qty {item.quantity}</p>
              </div>
              <p className="tabular-nums text-ink">
                {formatCents(item.unitAmountCents * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <dl className="space-y-2 border-t border-border px-4 py-4 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted">Subtotal</dt>
            <dd className="tabular-nums">{formatCents(confirmation.subtotalCents)}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted">Shipping</dt>
            <dd className="tabular-nums">{formatCents(confirmation.shippingCents)}</dd>
          </div>
          <div className="flex justify-between border-t border-border pt-2 font-medium text-ink">
            <dt>Total</dt>
            <dd className="tabular-nums">{formatCents(confirmation.totalCents)}</dd>
          </div>
        </dl>
      </section>

      <p className="mt-6 text-sm text-muted">
        We will email you when your order ships. Questions?{" "}
        <Link href="/contact" className="text-ink underline underline-offset-4">
          Contact us
        </Link>
        .
      </p>

      <div className="mt-8 space-y-4">
        <OrderConfirmationGuestCta
          isLoggedInCheckout={confirmation.isLoggedInCheckout}
        />
        <div className="flex flex-wrap gap-3">
          {confirmation.isLoggedInCheckout && confirmation.orderId && (
            <Link href={`/account/orders/${confirmation.orderId}`}>
              <Button variant="outline">View in my account</Button>
            </Link>
          )}
          {confirmation.isLoggedInCheckout && !confirmation.orderId && (
            <Link href="/account/orders">
              <Button variant="outline">View my orders</Button>
            </Link>
          )}
          <Link href="/shop">
            <Button>Continue shopping</Button>
          </Link>
        </div>
      </div>
    </PageContainer>
  );
}
