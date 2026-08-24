import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About Magali",
  description:
    "Learn about Magali — botanical hair care, wellness products, and Caribbean food favorites rooted in nature.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 lg:px-8">
      <h1 className="font-display text-4xl font-semibold text-magali-green-950">
        Everyday Products, Rooted in Care
      </h1>
      <p className="mt-6 text-lg leading-relaxed text-magali-ink/70">
        Magali brings together botanical beauty, targeted wellness, and bold
        Caribbean flavors under one brand — crafted for everyday life with
        thoughtfully selected ingredients and time-honored traditions.
      </p>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-magali-green-950">
          Botanical Beauty & Wellness
        </h2>
        <p className="mt-4 leading-relaxed text-magali-ink/70">
          Our hair care and wellness lines draw on natural oils, herbal
          botanicals, and carefully blended formulas designed to nourish, support,
          and care for you from root to tip — and beyond.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-magali-navy-800">
          Caribbean Food Heritage
        </h2>
        <p className="mt-4 leading-relaxed text-magali-ink/70">
          From savory seasoned beef pies to family-size convenience, Magali food
          products celebrate the rich, bold flavors of the Caribbean — ready for
          your oven, air fryer, or skillet.
        </p>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold text-magali-green-950">
          Our Values
        </h2>
        <ul className="mt-4 space-y-3 text-magali-ink/70">
          <li>Botanical ingredients sourced with care</li>
          <li>Thoughtfully prepared formulas</li>
          <li>Quality you can trust for everyday use</li>
          <li>A brand that spans beauty, wellness, and food</li>
        </ul>
      </section>

      <Link href="/shop" className="mt-12 inline-block">
        <Button size="lg">Shop All Products</Button>
      </Link>
    </div>
  );
}
