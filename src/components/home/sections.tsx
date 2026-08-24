import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { SquareImageFrame } from "@/components/ui/square-image-frame";

function EditorialBlock({
  eyebrow,
  title,
  description,
  href,
  cta,
  imageSrc,
  imageAlt,
  reverse = false,
}: {
  eyebrow: string;
  title: string;
  description: string;
  href: string;
  cta: string;
  imageSrc: string;
  imageAlt: string;
  reverse?: boolean;
}) {
  return (
    <div
      className={`grid min-w-0 items-center gap-8 lg:grid-cols-2 lg:gap-12 ${
        reverse ? "lg:[&>*:first-child]:order-2" : ""
      }`}
    >
      <SquareImageFrame
        src={imageSrc}
        alt={imageAlt}
        sizes="(max-width: 1024px) 100vw, 50vw"
        padding="md"
        className="border border-border bg-surface"
      />
      <div className="min-w-0 px-1 lg:px-0">
        <p className="eyebrow text-muted">{eyebrow}</p>
        <h2 className="mt-3 font-display text-2xl text-ink sm:text-3xl">{title}</h2>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">{description}</p>
        <Link href={href} className="mt-8 inline-block">
          <Button variant="outline">{cta}</Button>
        </Link>
      </div>
    </div>
  );
}

export function BrandStorySection() {
  return (
    <section className="border-b border-border">
      <PageContainer className="py-12 sm:py-16 lg:py-20">
        <EditorialBlock
          eyebrow="Hair Care"
          title="Botanical care from root to tip"
          description="Herbs and natural oils, including hibiscus, rosemary, castor, and coconut, work together to nourish the scalp and support stronger-looking, more manageable hair."
          href="/collections/hair-care"
          cta="Shop Hair Care"
          imageSrc="/images/products/hair-grease/01-hero-white.png"
          imageAlt="Magali Herbal Hair Grease"
        />
      </PageContainer>
    </section>
  );
}

export function ProductHighlightsSection() {
  return (
    <section className="border-b border-border bg-surface-muted">
      <PageContainer className="py-12 sm:py-16 lg:py-20">
        <div className="mb-10 border-b border-border pb-6">
          <p className="eyebrow text-muted">Highlights</p>
          <h2 className="mt-2 font-display text-3xl text-ink lg:text-4xl">
            More from Magali
          </h2>
        </div>

        <div className="grid min-w-0 gap-12 lg:grid-cols-2 lg:gap-16">
          <EditorialBlock
            eyebrow="Wellness"
            title="Targeted botanical care"
            description="PureHeal Oil delivers a concentrated castor and clove blend in a precise dropper format. For external use only."
            href="/products/magali-pureheal-oil"
            cta="Shop PureHeal Oil"
            imageSrc="/images/products/pureheal-oil/01-hero-white.png"
            imageAlt="Magali PureHeal Oil"
          />
          <EditorialBlock
            eyebrow="Food"
            title="A taste of the Caribbean"
            description="Golden flaky pastry and seasoned beef in a family-size 8 pack. Cook from frozen in the oven, air fryer, or skillet."
            href="/products/magali-caribbean-style-beef-pies-8-pack"
            cta="Shop Beef Pies"
            imageSrc="/images/products/beef-pies/01-package-white.png"
            imageAlt="Magali Caribbean Style Beef Pies"
          />
        </div>
      </PageContainer>
    </section>
  );
}
