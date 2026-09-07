import Image from "next/image";
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
    <>
      <section className="border-b border-border bg-surface-muted">
        <PageContainer sectionY>
          <div className="grid min-w-0 items-center grid-gap lg:grid-cols-2">
            <div className="min-w-0">
              <p className="eyebrow text-botanical">About Magali</p>
              <h1 className="mt-4 font-display text-4xl text-ink lg:text-5xl">
                Everyday products, rooted in care
              </h1>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                Magali brings botanical beauty, targeted wellness, and Caribbean
                flavor together under one name. Every product is made with
                thoughtfully selected ingredients and traditions you can trust for
                daily use.
              </p>
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-border bg-surface">
              <Image
                src="/images/products/hair-oil/03-botanical-lifestyle.png"
                alt="Magali botanical hair oil with fresh herbs"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                priority
              />
            </div>
          </div>
        </PageContainer>
      </section>

      <PageContainer sectionY>
        <section className="grid min-w-0 items-center grid-gap border-b border-border pb-16 lg:grid-cols-[1fr,min(360px,42%)]">
          <div className="min-w-0">
            <h2 className="font-display text-2xl text-ink lg:text-3xl">
              Botanical beauty and wellness
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              Our hair care and wellness collections use natural oils, herbal
              botanicals, and carefully blended formulas to nourish the scalp,
              support stronger-looking hair, and care for skin through targeted
              external application.
            </p>
            <Link href="/collections/hair-care" className="mt-6 inline-block">
              <Button variant="outline" size="sm">
                Shop hair care
              </Button>
            </Link>
          </div>
          <div className="relative aspect-square overflow-hidden border border-border bg-surface-muted">
            <Image
              src="/images/products/pureheal-oil/02-botanical-still-life.png"
              alt="Magali PureHeal oil with botanical ingredients"
              fill
              sizes="360px"
              className="object-cover object-center"
            />
          </div>
        </section>

        <section className="grid min-w-0 items-center grid-gap border-b border-border py-16 lg:grid-cols-[min(360px,42%),1fr]">
          <div className="relative order-2 aspect-square overflow-hidden border border-border bg-surface-muted lg:order-1">
            <Image
              src="/images/products/beef-pies/03-plated-cooked-pies.png"
              alt="Magali Caribbean-style beef pies, plated and ready to serve"
              fill
              sizes="360px"
              className="object-cover object-center"
            />
          </div>
          <div className="order-1 min-w-0 lg:order-2">
            <h2 className="font-display text-2xl text-ink lg:text-3xl">
              Caribbean food heritage
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted">
              From seasoned beef pies to family-size convenience, Magali food
              celebrates the bold flavors of the Caribbean. Each product is ready
              for your oven, air fryer, or skillet.
            </p>
            <Link href="/collections/food" className="mt-6 inline-block">
              <Button variant="outline" size="sm">
                Shop food
              </Button>
            </Link>
          </div>
        </section>

        <section className="pt-16">
          <h2 className="font-display text-2xl text-ink lg:text-3xl">Our values</h2>
          <div className="mt-8 grid grid-gap sm:grid-cols-2">
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

        <div className="mt-16 flex flex-col gap-3 sm:flex-row">
          <Link href="/shop">
            <Button size="lg">Shop collection</Button>
          </Link>
          <Link href="/find-your-routine">
            <Button variant="outline" size="lg">
              Find your routine
            </Button>
          </Link>
        </div>
      </PageContainer>
    </>
  );
}
