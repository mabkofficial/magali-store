import Link from "next/link";
import { SectionShell } from "@/components/layout/section-shell";
import { Button } from "@/components/ui/button";

const assurances = [
  {
    term: "Ingredients",
    detail: "Herbal oils and blends made for weekly use — not one-off treats.",
  },
  {
    term: "Checkout",
    detail: "Secure Stripe payments. Your card details never touch our servers.",
  },
  {
    term: "Shipping",
    detail: "US delivery with rates shown before you pay.",
  },
] as const;

export function HomeBrandSection() {
  return (
    <SectionShell bordered muted={false}>
      <div className="grid min-w-0 grid-gap lg:grid-cols-12 lg:items-start">
        <div className="lg:col-span-7">
          <h2 className="max-w-lg font-display text-3xl leading-[1.12] text-ink lg:text-4xl">
            One brand for the routines you actually repeat
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted">
            Hair care on the shelf, wellness within reach, Caribbean food in the
            freezer — Magali keeps the same bar across categories so reordering
            feels simple, not like starting over.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
            <Link href="/about">
              <Button variant="outline" size="md">
                About Magali
              </Button>
            </Link>
            <Link
              href="/contact"
              className="text-sm text-muted underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline"
            >
              Contact us
            </Link>
            <Link
              href="/shipping-returns"
              className="text-sm text-muted underline-offset-4 transition-colors duration-150 hover:text-ink hover:underline"
            >
              Shipping & returns
            </Link>
          </div>
        </div>

        <aside className="lg:col-span-5 lg:pt-2">
          <p className="max-w-sm text-sm leading-relaxed text-muted lg:ml-auto lg:text-right">
            New here? Start with{" "}
            <Link
              href="/shop"
              className="text-ink underline-offset-4 hover:underline"
            >
              the full catalog
            </Link>
            , or take the{" "}
            <Link
              href="/find-your-routine"
              className="text-ink underline-offset-4 hover:underline"
            >
              hair routine quiz
            </Link>{" "}
            if you are not sure which products fit.
          </p>
        </aside>
      </div>

      <dl className="mt-16 grid grid-gap border-t border-border pt-12 sm:grid-cols-3">
        {assurances.map(({ term, detail }) => (
          <div key={term}>
            <dt className="eyebrow text-ink">{term}</dt>
            <dd className="mt-3 text-sm leading-relaxed text-muted">{detail}</dd>
          </div>
        ))}
      </dl>
    </SectionShell>
  );
}
