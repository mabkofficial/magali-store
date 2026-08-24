import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-magali-cream-50">
      <div className="pointer-events-none absolute -right-24 top-0 h-96 w-96 rounded-full bg-magali-gold-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-80 w-80 rounded-full bg-magali-green-800/10 blur-3xl" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:px-8 lg:py-24">
        <div>
          <p className="mb-4 text-sm font-medium uppercase tracking-widest text-magali-gold-600">
            Magali
          </p>
          <h1 className="font-display text-4xl font-semibold leading-tight text-magali-green-950 md:text-5xl lg:text-6xl">
            Rooted in Nature. Made for Everyday Life.
          </h1>
          <p className="mt-6 text-lg leading-relaxed text-magali-ink/70">
            Discover botanical hair and wellness essentials alongside bold
            Caribbean favorites from Magali.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/shop">
              <Button size="lg">Shop All Products</Button>
            </Link>
            <Link href="/collections/hair-care">
              <Button size="lg" variant="outline">
                Explore Hair Care
              </Button>
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-magali-cream-100 bg-white shadow-[0_24px_60px_-12px_rgba(16,39,31,0.18)] sm:rounded-[2.5rem] lg:aspect-square lg:max-h-[560px]">
            <Image
              src="/images/products/hair-oil/03-botanical-lifestyle.png"
              alt="Magali Botanical Hair Oil with botanical ingredients"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-magali-green-950/20 via-transparent to-transparent" />
          </div>

          <div className="absolute -bottom-5 -left-4 hidden overflow-hidden rounded-2xl border-4 border-magali-cream-50 bg-white shadow-lg sm:block sm:h-28 sm:w-28 lg:-bottom-6 lg:-left-8 lg:h-36 lg:w-36">
            <Image
              src="/images/products/pureheal-oil/01-hero-white.png"
              alt="Magali PureHeal Oil"
              fill
              sizes="144px"
              className="object-contain p-2"
            />
          </div>

          <div className="absolute -right-4 -top-4 hidden overflow-hidden rounded-2xl border-4 border-magali-cream-50 bg-white shadow-lg sm:block sm:h-24 sm:w-24 lg:-right-6 lg:-top-6 lg:h-32 lg:w-32">
            <Image
              src="/images/products/hair-grease/01-hero-white.png"
              alt="Magali Herbal Hair Grease"
              fill
              sizes="128px"
              className="object-contain p-2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
