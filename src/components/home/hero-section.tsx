import Link from "next/link";
import { HomeHeroVideo } from "@/components/home/home-hero-video";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function HeroSection() {
  return (
    <section className="relative min-h-[100svh] overflow-hidden border-b border-border bg-ink">
      <HomeHeroVideo className="absolute inset-0 h-full w-full" />

      {/* Legibility scrims — functional overlay, not decorative chrome */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/25 to-transparent sm:from-black/55 sm:via-black/15"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/55 via-black/15 to-transparent sm:from-black/45"
        aria-hidden
      />

      <PageContainer
        className={cn(
          "relative z-10 flex min-h-[100svh] flex-col justify-end",
          "pb-12 pt-[calc(5.5rem+2.25rem)] sm:pb-16 sm:pt-[calc(4.5rem+2.5rem)] lg:pb-20",
        )}
      >
        <div className="max-w-xl">
          <h1 className="font-display text-4xl leading-[1.06] text-surface sm:text-5xl lg:text-[3.5rem]">
            Rooted in nature.
            <br />
            Made for everyday life.
          </h1>
          <p className="mt-5 max-w-md text-sm leading-relaxed text-surface/85">
            Botanical hair care, wellness oils, and Caribbean food favorites —
            formulated for the routines you repeat every week.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/shop">
              <Button
                size="lg"
                className="bg-surface text-ink hover:bg-surface/90"
              >
                Shop collection
              </Button>
            </Link>
            <Link href="/find-your-routine">
              <Button
                size="lg"
                variant="outline"
                className="border-surface/90 bg-transparent text-surface hover:bg-surface/10 hover:text-surface"
              >
                Find your routine
              </Button>
            </Link>
          </div>
          <p className="mt-8 text-sm text-surface/70">
            <Link
              href="/about"
              className="underline-offset-4 hover:text-surface hover:underline"
            >
              Read our story
            </Link>
          </p>
        </div>
      </PageContainer>
    </section>
  );
}
