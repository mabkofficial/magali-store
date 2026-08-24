import Link from "next/link";

export const metadata = {
  title: "Shipping and Returns",
  description: "Magali shipping, frozen product delivery, and return policies.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 lg:px-8 lg:py-24">
      <p className="eyebrow text-muted">Policies</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Shipping and Returns</h1>

      <section className="mt-12 space-y-10 text-sm leading-relaxed text-muted">
        <div>
          <h2 className="font-display text-xl text-ink">Standard shipping</h2>
          <p className="mt-3">
            Hair care and wellness products ship through our standard fulfillment
            process. Shipping rates and delivery estimates are calculated at
            checkout based on your address and order total.
          </p>
        </div>

        <div className="border-t border-border pt-10">
          <h2 className="font-display text-xl text-ink">Frozen products</h2>
          <p className="mt-3">
            Caribbean Style Beef Pies are sold frozen and may require special
            shipping. If frozen items are unavailable for online checkout, please{" "}
            <Link href="/contact" className="text-ink underline underline-offset-4">
              contact us
            </Link>{" "}
            and we will help you complete your order.
          </p>
        </div>

        <div className="border-t border-border pt-10">
          <h2 className="font-display text-xl text-ink">Returns and refunds</h2>
          <p className="mt-3">
            We want you to be satisfied with your purchase. If something is wrong
            with your order, contact us within 14 days of delivery with your
            order number and a description of the issue. Refunds and replacements
            are handled on a case-by-case basis for damaged, incorrect, or
            defective items.
          </p>
          <p className="mt-3">
            Opened beauty, wellness, and food products may not be eligible for
            return due to safety and hygiene standards. Contact us before
            returning any item so we can guide you through the process.
          </p>
        </div>
      </section>
    </div>
  );
}
