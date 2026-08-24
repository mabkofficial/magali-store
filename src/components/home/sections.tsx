import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function BrandStorySection() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl">
          <Image
            src="/images/products/hair-oil/03-botanical-lifestyle.png"
            alt="Magali botanical hair care"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <h2 className="font-display text-3xl font-semibold text-magali-green-950">
            Botanical Care From Root to Tip
          </h2>
          <p className="mt-6 leading-relaxed text-magali-ink/70">
            Magali hair care combines time-honored herbs and natural oils —
            from hibiscus and rosemary to castor and coconut — to nourish the
            scalp, support stronger-looking hair, and add natural shine for all
            hair types.
          </p>
          <Link href="/collections/hair-care" className="mt-8 inline-block">
            <Button variant="outline">Shop Hair Care</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function WellnessSpotlight() {
  return (
    <section className="bg-magali-cream-100 py-16">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:px-8">
        <div className="order-2 lg:order-1">
          <h2 className="font-display text-3xl font-semibold text-magali-green-950">
            Targeted Botanical Care
          </h2>
          <p className="mt-6 leading-relaxed text-magali-ink/70">
            A concentrated castor-and-clove botanical blend in a convenient
            dropper format for targeted external application. For external use
            only.
          </p>
          <Link href="/products/magali-pureheal-oil" className="mt-8 inline-block">
            <Button>Shop PureHeal Oil</Button>
          </Link>
        </div>
        <div className="relative order-1 aspect-square overflow-hidden rounded-2xl lg:order-2">
          <Image
            src="/images/products/pureheal-oil/01-hero-white.png"
            alt="Magali PureHeal Oil"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-contain bg-white p-8"
          />
        </div>
      </div>
    </section>
  );
}

export function FoodSpotlight() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:px-8">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        <div className="relative aspect-square overflow-hidden rounded-2xl">
          <Image
            src="/images/products/beef-pies/03-plated-cooked-pies.png"
            alt="Magali Caribbean Style Beef Pies"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="text-sm font-medium uppercase tracking-widest text-magali-red-700">
            Caribbean Food
          </p>
          <h2 className="mt-2 font-display text-3xl font-semibold text-magali-navy-800">
            A Taste of the Caribbean
          </h2>
          <p className="mt-6 leading-relaxed text-magali-ink/70">
            Flaky pastry, savory seasoned beef, and family-size convenience —
            ready for the oven, air fryer, or skillet.
          </p>
          <Link
            href="/products/magali-caribbean-style-beef-pies-8-pack"
            className="mt-8 inline-block"
          >
            <Button variant="secondary">Shop Beef Pies</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function TrustStrip() {
  const values = [
    "Botanical ingredients",
    "Thoughtfully prepared formulas",
    "Made in USA on applicable beauty products",
    "Convenient everyday care",
  ];

  return (
    <section className="border-y border-magali-cream-100 bg-white py-12">
      <div className="mx-auto grid max-w-7xl gap-6 px-4 sm:grid-cols-2 lg:grid-cols-4 lg:px-8">
        {values.map((value) => (
          <div
            key={value}
            className="text-center text-sm font-medium text-magali-green-950"
          >
            {value}
          </div>
        ))}
      </div>
    </section>
  );
}

