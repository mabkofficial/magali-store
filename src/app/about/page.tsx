import Link from "next/link";
import { Leaf, Heart, Sparkles, Globe2 } from "lucide-react";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "About",
  description:
    "Learn about Magali botanical hair care, wellness products, and Caribbean food favorites.",
};

const values = [
  {
    icon: Leaf,
    title: "Botanical ingredients",
    description: "Selected with care from herbs, oils, and natural botanicals.",
  },
  {
    icon: Sparkles,
    title: "Intentional formulas",
    description: "Every blend is prepared with purpose for everyday routines.",
  },
  {
    icon: Heart,
    title: "Quality you can trust",
    description: "Reliable products for beauty, wellness, and food at home.",
  },
  {
    icon: Globe2,
    title: "One brand, many rituals",
    description: "Hair care, wellness oils, and Caribbean flavors under one name.",
  },
] as const;

export default function AboutPage() {
  return (
    <PageContainer className="py-16 lg:py-24">
      <div className="mx-auto max-w-2xl">
        <p className="eyebrow text-muted">About</p>
        <h1 className="mt-4 font-display text-4xl text-ink lg:text-5xl">
          Everyday products, rooted in care
        </h1>
        <p className="mt-8 text-sm leading-relaxed text-muted">
          Magali brings botanical beauty, targeted wellness, and Caribbean flavor
          together under one name. Every product is made with thoughtfully selected
          ingredients and traditions you can trust for daily use.
        </p>
      </div>

      <section className="mx-auto mt-16 max-w-4xl border-t border-border pt-12">
        <h2 className="font-display text-2xl text-ink">Botanical beauty and wellness</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          Our hair care and wellness collections use natural oils, herbal
          botanicals, and carefully blended formulas to nourish the scalp,
          support stronger-looking hair, and care for skin through targeted
          external application.
        </p>
      </section>

      <section className="mx-auto mt-12 max-w-4xl border-t border-border pt-12">
        <h2 className="font-display text-2xl text-ink">Caribbean food heritage</h2>
        <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
          From seasoned beef pies to family-size convenience, Magali food
          celebrates the bold flavors of the Caribbean. Each product is ready
          for your oven, air fryer, or skillet.
        </p>
      </section>

      <section className="mx-auto mt-16 max-w-4xl border-t border-border pt-12">
        <h2 className="font-display text-2xl text-ink">Our values</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {values.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="border border-border bg-surface-muted p-6"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-surface text-botanical">
                <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden />
              </div>
              <h3 className="text-sm font-medium text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {description}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className="mx-auto mt-16 max-w-2xl">
        <Link href="/shop">
          <Button size="lg">Shop Collection</Button>
        </Link>
      </div>
    </PageContainer>
  );
}
