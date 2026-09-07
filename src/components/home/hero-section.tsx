import Link from "next/link";
import { SectionShell } from "@/components/layout/section-shell";
import { Button } from "@/components/ui/button";
import { SquareImageFrame } from "@/components/ui/square-image-frame";

export function HeroSection() {
  return (
    <SectionShell bordered muted={false}>
      <div className="grid min-w-0 items-center grid-gap lg:grid-cols-2">
        <div className="min-w-0 hero-fade-up">
          <h1 className="font-display text-4xl leading-[1.08] text-ink sm:text-5xl lg:text-[3.25rem]">
            Rooted in nature.
            <br />
            Made for everyday life.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
            Botanical hair care, wellness oils, and Caribbean food favorites.
            Thoughtfully crafted for the routines you rely on every day.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop">
              <Button size="lg">Shop Collection</Button>
            </Link>
            <Link href="/about">
              <Button size="lg" variant="outline">
                Our Story
              </Button>
            </Link>
          </div>
        </div>

        <SquareImageFrame
          src="/images/products/hair-oil/03-botanical-lifestyle.png"
          alt="Magali Botanical Hair Oil with botanical ingredients"
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          padding="none"
          imageClassName="object-cover"
        />
      </div>
    </SectionShell>
  );
}
