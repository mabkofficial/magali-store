import Link from "next/link";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { PageContainer } from "@/components/layout/page-container";
import { PageHeader } from "@/components/layout/page-header";
import { SectionShell } from "@/components/layout/section-shell";
import { Button } from "@/components/ui/button";
import { SquareImageFrame } from "@/components/ui/square-image-frame";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "About Magali",
  description:
    "Magali makes botanical hair care, wellness oils, and Caribbean food favorites for everyday routines — thoughtfully sourced and made to use at home.",
  path: "/about",
});

const pillars = [
  {
    title: "Hair care",
    body: "Botanical hair oil and herbal hair grease for scalp and strand care — blended for regular use, not occasional treats.",
    href: "/collections/hair-care",
    cta: "Shop hair care",
    image: "/images/products/hair-oil/02-angled-white.png",
    alt: "Magali Botanical Hair Oil, angled product view",
  },
  {
    title: "Wellness",
    body: "PureHeal oil and related blends for targeted external application — small-batch botanicals you can keep within reach.",
    href: "/collections/wellness",
    cta: "Shop wellness",
    image: "/images/products/pureheal-oil/01-hero-white.png",
    alt: "Magali PureHeal oil",
  },
  {
    title: "Caribbean food",
    body: "Seasoned beef pies and family-size favorites, ready for your oven, air fryer, or skillet — bold flavor without starting from scratch.",
    href: "/collections/food",
    cta: "Shop food",
    image: "/images/products/beef-pies/03-plated-cooked-pies.png",
    alt: "Magali Caribbean-style beef pies, plated",
  },
] as const;

const principles = [
  {
    title: "Ingredients with intention",
    body: "Herbs, oils, and botanicals chosen for how they perform in real routines — not for label filler.",
  },
  {
    title: "Made for daily use",
    body: "Products sized and formulated for repeat use at home, from wash day to weeknight meals.",
  },
  {
    title: "One name, clear categories",
    body: "Hair, wellness, and food live under Magali so you know where to return when something works.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <SectionShell bordered={false} muted>
        <PageContainer sectionY className="pt-0">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "About" }]}
          />
          <div className="mt-10 grid min-w-0 items-center grid-gap lg:grid-cols-2">
            <PageHeader
              className="mb-0"
              titleClassName="text-4xl sm:text-5xl lg:text-[3.25rem] leading-[1.08]"
              title="Rooted in care, built for everyday life"
              description="Magali is a family of botanical hair care, wellness oils, and Caribbean food favorites. We focus on products you reach for weekly — with sourcing and formulas you can stand behind."
            />
            <SquareImageFrame
              src="/images/products/hair-oil/01-hero-white.png"
              alt="Magali Botanical Hair Oil"
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </PageContainer>
      </SectionShell>

      <PageContainer sectionY>
        <div className="max-w-2xl">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            Why Magali exists
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            We started with hair care rooted in herbal tradition and expanded
            into wellness and food that fit the same standard: honest
            ingredients, consistent quality, and packaging that belongs on your
            counter — not hidden in a drawer.
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Whether you are building a hair routine, stocking a wellness shelf,
            or feeding a table, the goal is the same: reliable products that
            feel considered, not generic.
          </p>
        </div>

        <div className="mt-20 border-t border-border">
          {pillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className="grid min-w-0 items-center grid-gap border-b border-border py-16 lg:grid-cols-2"
            >
              <div
                className={
                  index % 2 === 1 ? "lg:order-2" : undefined
                }
              >
                <h3 className="font-display text-xl text-ink sm:text-2xl">
                  {pillar.title}
                </h3>
                <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
                  {pillar.body}
                </p>
                <Link href={pillar.href} className="mt-6 inline-block">
                  <Button variant="outline" size="sm">
                    {pillar.cta}
                  </Button>
                </Link>
              </div>
              <SquareImageFrame
                className={index % 2 === 1 ? "lg:order-1" : undefined}
                src={pillar.image}
                alt={pillar.alt}
                sizes="(max-width: 1024px) 100vw, 480px"
                padding="sm"
              />
            </article>
          ))}
        </div>

        <section className="mt-20 max-w-3xl">
          <h2 className="font-display text-2xl text-ink sm:text-3xl">
            How we work
          </h2>
          <ul className="mt-10 divide-y divide-border border-y border-border">
            {principles.map(({ title, body }) => (
              <li key={title} className="py-6 sm:py-8">
                <p className="text-sm font-medium text-ink">{title}</p>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted">
                  {body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <div className="mt-16 flex flex-col gap-3 border-t border-border pt-16 sm:flex-row sm:items-center">
          <Link href="/shop">
            <Button size="lg">Shop the catalog</Button>
          </Link>
          <Link href="/find-your-routine">
            <Button variant="outline" size="lg">
              Find your hair routine
            </Button>
          </Link>
          <Link
            href="/contact"
            className="text-sm text-muted underline-offset-4 hover:text-ink hover:underline sm:ml-2"
          >
            Questions? Contact us
          </Link>
        </div>
      </PageContainer>
    </>
  );
}
