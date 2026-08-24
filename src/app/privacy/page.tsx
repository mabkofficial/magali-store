export const metadata = {
  title: "Privacy Policy",
  description: "Magali privacy policy.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <div className="mb-8 rounded-xl bg-amber-50 p-4 text-sm text-amber-900">
        This policy requires legal review before final launch.
      </div>

      <h1 className="font-display text-4xl font-semibold text-magali-green-950">
        Privacy Policy
      </h1>

      <div className="prose prose-neutral mt-10 max-w-none space-y-6 text-magali-ink/70">
        <section>
          <h2 className="font-display text-xl font-semibold text-magali-green-950">
            Information We Collect
          </h2>
          <p className="mt-3">
            When you use our contact form, we collect the information you
            provide such as your name, email address, phone number (if provided),
            and message content.
          </p>
          <p className="mt-3">
            When you make a purchase, payment processing is handled by Stripe.
            We do not store your full payment card details on our servers.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-magali-green-950">
            How We Use Information
          </h2>
          <p className="mt-3">
            We use contact form submissions to respond to your inquiries. Order
            information is used to fulfill purchases and provide customer
            support.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-magali-green-950">
            Third-Party Services
          </h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>Stripe — payment processing</li>
            <li>Vercel — website hosting</li>
            <li>Analytics services — if enabled with client approval</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-magali-green-950">
            Cookies
          </h2>
          <p className="mt-3">
            We may use cookies for essential site functionality and, with
            consent, analytics. Details will be updated when analytics are
            enabled.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-magali-green-950">
            Contact
          </h2>
          <p className="mt-3">
            For privacy-related questions, please use our contact form.
          </p>
        </section>
      </div>
    </div>
  );
}
