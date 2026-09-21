import Link from "next/link";
import { HomeHeroVideo } from "@/components/home/home-hero-video";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="border-b border-border bg-surface">
      <PageContainer sectionY>
        <div className="grid min-w-0 grid-gap lg:grid-cols-12 lg:items-end">
          <div className="min-w-0 lg:col-span-5 lg:pb-2">
            <h1 className="font-display text-4xl leading-[1.06] text-ink sm:text-5xl lg:text-[3.5rem]">
              Rooted in nature.
              <br />
              Made for everyday life.
            </h1>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-muted">
              Botanical hair care, wellness oils, and Caribbean food favorites —
              formulated for the routines you repeat every week.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/shop">
                <Button size="lg">Shop collection</Button>
              </Link>
              <Link href="/find-your-routine">
                <Button size="lg" variant="outline">
                  Find your routine
                </Button>
              </Link>
            </div>
          </div>
          <div className="min-w-0 lg:col-span-7">
            <HomeHeroVideo />
          </div>
        </div>
        <p className="mt-6 text-sm text-muted lg:mt-8">
          <Link
            href="/about"
            className="underline-offset-4 hover:text-ink hover:underline"
          >
            Read our story
          </Link>
        </p>
      </PageContainer>
    </section>
  );
}
