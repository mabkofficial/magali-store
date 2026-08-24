export const metadata = {
  title: "Privacy Policy",
  description: "How Magali collects, uses, and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 lg:px-8 lg:py-24">
      <p className="eyebrow text-muted">Legal</p>
      <h1 className="mt-4 font-display text-4xl text-ink">Privacy Policy</h1>
      <p className="mt-4 text-sm text-muted">Last updated: August 2026</p>

      <div className="mt-12 space-y-10 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="font-display text-xl text-ink">Information we collect</h2>
          <p className="mt-3">
            When you contact us, we collect the information you provide, including
            your name, email address, phone number if you choose to share it, and
            your message.
          </p>
          <p className="mt-3">
            When you make a purchase, payment processing is handled by Stripe. We
            do not store your full payment card details on our servers.
          </p>
        </section>

        <section className="border-t border-border pt-10">
          <h2 className="font-display text-xl text-ink">How we use information</h2>
          <p className="mt-3">
            We use your information to respond to inquiries, process orders,
            provide customer support, and improve our website and services.
          </p>
        </section>

        <section className="border-t border-border pt-10">
          <h2 className="font-display text-xl text-ink">Third-party services</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Stripe for secure payment processing</li>
            <li>Vercel for website hosting</li>
          </ul>
        </section>

        <section className="border-t border-border pt-10">
          <h2 className="font-display text-xl text-ink">Cookies</h2>
          <p className="mt-3">
            We use cookies and similar technologies for essential site
            functionality, such as keeping items in your cart. You can control
            cookies through your browser settings.
          </p>
        </section>

        <section className="border-t border-border pt-10">
          <h2 className="font-display text-xl text-ink">Contact</h2>
          <p className="mt-3">
            For privacy questions, reach us through the contact form on this
            website.
          </p>
        </section>
      </div>
    </div>
  );
}
