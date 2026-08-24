export const metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the Magali website and purchasing products.",
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 lg:px-8 lg:py-24">
      <p className="eyebrow text-muted">Legal</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Terms of Service</h1>
      <p className="mt-4 text-sm text-muted">Last updated: August 2026</p>

      <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="font-display text-xl text-ink">Acceptance of terms</h2>
          <p className="mt-3">
            By accessing and using the Magali website, you agree to these terms
            of service. If you do not agree, please do not use this site.
          </p>
        </section>

        <section className="border-t border-border pt-10">
          <h2 className="font-display text-xl text-ink">Products and pricing</h2>
          <p className="mt-3">
            Product descriptions, prices, and availability may change without
            notice. We reserve the right to limit quantities or refuse service
            at our discretion.
          </p>
        </section>

        <section className="border-t border-border pt-10">
          <h2 className="font-display text-xl text-ink">Orders and payment</h2>
          <p className="mt-3">
            Orders are processed through Stripe. By placing an order, you confirm
            that your payment information is accurate and that you are authorized
            to use the payment method provided.
          </p>
        </section>

        <section className="border-t border-border pt-10">
          <h2 className="font-display text-xl text-ink">Product use</h2>
          <p className="mt-3">
            Beauty and wellness products are for external use unless otherwise
            stated on the label. Food products must be cooked to the recommended
            internal temperature before serving. Follow all label directions and
            cautions.
          </p>
        </section>

        <section className="border-t border-border pt-10">
          <h2 className="font-display text-xl text-ink">Limitation of liability</h2>
          <p className="mt-3">
            Magali is not liable for indirect, incidental, or consequential
            damages arising from the use of our products or website, to the
            fullest extent permitted by law.
          </p>
        </section>
      </div>
    </div>
  );
}
