export const metadata = {
  title: "Terms of Service",
  description: "Magali terms of service.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <div className="mb-8 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
        These terms require legal review before final launch.
      </div>

      <h1 className="font-display text-4xl font-semibold text-magali-green-950">
        Terms of Service
      </h1>

      <div className="mt-10 space-y-6 text-magali-ink/70">
        <section>
          <h2 className="font-display text-xl font-semibold text-magali-green-950">
            Acceptance of Terms
          </h2>
          <p className="mt-3">
            By accessing and using the Magali website, you agree to these terms
            of service. If you do not agree, please do not use this site.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-magali-green-950">
            Products & Pricing
          </h2>
          <p className="mt-3">
            All product descriptions, prices, and availability are subject to
            change without notice. We reserve the right to limit quantities and
            refuse service.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-magali-green-950">
            Orders & Payment
          </h2>
          <p className="mt-3">
            Orders are processed through Stripe. By placing an order, you
            represent that the payment information provided is accurate and that
            you are authorized to use the payment method.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-magali-green-950">
            Product Use
          </h2>
          <p className="mt-3">
            Beauty and wellness products are for external use unless otherwise
            stated. Food products must be cooked to the recommended internal
            temperature before serving. Follow all product label directions and
            cautions.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-magali-green-950">
            Limitation of Liability
          </h2>
          <p className="mt-3">
            Magali shall not be liable for any indirect, incidental, or
            consequential damages arising from the use of our products or website.
            Full legal terms will be finalized with counsel review.
          </p>
        </section>
      </div>
    </div>
  );
}
