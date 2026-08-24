import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About",
  description:
    "Learn about Magali botanical hair care, wellness products, and Caribbean food favorites.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 lg:px-8 lg:py-24">
      <p className="eyebrow text-muted">About</p>
      <h1 className="mt-4 font-display text-4xl text-ink lg:text-5xl">
        Everyday products, rooted in care
      </h1>
      <p className="mt-8 text-sm leading-relaxed text-muted">
        Magali brings botanical beauty, targeted wellness, and Caribbean flavor
        together under one name. Every product is made with thoughtfully selected
        ingredients and traditions you can trust for daily use.
      </p>

      <section className="mt-16 border-t border-border pt-12">
        <h2 className="font-display text-2xl text-ink">Botanical beauty and wellness</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          Our hair care and wellness collections use natural oils, herbal
          botanicals, and carefully blended formulas to nourish the scalp,
          support stronger-looking hair, and care for skin through targeted
          external application.
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-12">
        <h2 className="font-display text-2xl text-ink">Caribbean food heritage</h2>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          From seasoned beef pies to family-size convenience, Magali food
          celebrates the bold flavors of the Caribbean. Each product is ready
          for your oven, air fryer, or skillet.
        </p>
      </section>

      <section className="mt-12 border-t border-border pt-12">
        <h2 className="font-display text-2xl text-ink">Our values</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          <li>Botanical ingredients selected with care</li>
          <li>Formulas prepared with intention</li>
          <li>Quality you can rely on every day</li>
          <li>One brand for beauty, wellness, and food</li>
        </ul>
      </section>

      <Link href="/shop" className="mt-16 inline-block">
        <Button size="lg">Shop Collection</Button>
      </Link>
    </div>
  );
}
