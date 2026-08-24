import Link from "next/link";

export const metadata = {
  title: "Shipping & Returns",
  description: "Magali shipping and return policies.",
};

export default function ShippingReturnsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <div className="mb-8 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
        This page requires client and legal review before final launch.
      </div>

      <h1 className="font-display text-4xl font-semibold text-magali-green-950">
        Shipping & Returns
      </h1>

      <section className="mt-10 space-y-6 text-magali-ink/70">
        <div>
          <h2 className="font-display text-xl font-semibold text-magali-green-950">
            Shipping
          </h2>
          <p className="mt-3">
            Shipping regions, processing times, and rates for standard and
            frozen products are being finalized. Please{" "}
            <Link href="/contact" className="text-magali-gold-600 underline">
              contact us
            </Link>{" "}
            for current shipping availability.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-magali-green-950">
            Frozen Products
          </h2>
          <p className="mt-3">
            Frozen food items such as Caribbean Style Beef Pies require special
            shipping arrangements. Online checkout for frozen items may be
            temporarily unavailable while shipping methods are confirmed.
          </p>
        </div>

        <div>
          <h2 className="font-display text-xl font-semibold text-magali-green-950">
            Returns & Refunds
          </h2>
          <p className="mt-3">
            Return and refund policies for beauty, wellness, and food products
            will be published here once confirmed with legal review.
          </p>
        </div>
      </section>
    </div>
  );
}
