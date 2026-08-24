"use client";

export function EmailSignup() {
  return (
    <section className="bg-magali-green-950 py-16 text-magali-cream-50">
      <div className="mx-auto max-w-xl px-4 text-center lg:px-8">
        <h2 className="font-display text-3xl font-semibold">
          Stay Connected With Magali
        </h2>
        <p className="mt-4 text-magali-cream-50/80">
          Be the first to hear about new products and updates.
        </p>
        <form
          className="mt-8 flex flex-col gap-3 sm:flex-row"
          onSubmit={(event) => event.preventDefault()}
        >
          <input
            type="email"
            placeholder="Enter your email"
            className="flex-1 rounded-xl border-0 px-4 py-3 text-magali-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-magali-gold-600"
            aria-label="Email address"
          />
          <button
            type="submit"
            className="rounded-xl bg-magali-gold-600 px-6 py-3 font-medium text-white hover:bg-magali-gold-500"
          >
            Subscribe
          </button>
        </form>
        <p className="mt-4 text-xs text-magali-cream-50/60">
          Newsletter signup coming soon. No account required.
        </p>
      </div>
    </section>
  );
}
