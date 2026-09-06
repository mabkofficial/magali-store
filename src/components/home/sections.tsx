import Link from "next/link";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export function StorySection() {
  return (
    <section className="border-b border-border">
      <PageContainer className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-ink lg:text-4xl">
            Botanical care, everyday rituals
          </h2>
          <p className="mt-5 text-sm leading-relaxed text-muted">
            Magali brings together herbal hair care, targeted wellness oils, and
            Caribbean food favorites — all rooted in thoughtfully selected
            ingredients and traditions you can trust for daily use.
          </p>
          <Link href="/about" className="mt-8 inline-block">
            <Button variant="outline">Read our story</Button>
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}
