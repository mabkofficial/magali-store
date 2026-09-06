import { PageContainer } from "@/components/layout/page-container";
import { getFeaturedTestimonials } from "@/config/testimonials";

export function TestimonialsSection() {
  const quotes = getFeaturedTestimonials(2);

  return (
    <section className="border-b border-border bg-surface-muted">
      <PageContainer className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="eyebrow text-botanical">From our community</p>
          <h2 className="mt-3 font-display text-3xl text-ink lg:text-4xl">
            Real routines, real results
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-4xl gap-8 sm:grid-cols-2 sm:gap-10">
          {quotes.map((testimonial) => (
            <figure
              key={testimonial.id}
              className="border border-border bg-surface p-6 sm:p-8"
            >
              <blockquote className="text-sm leading-relaxed text-ink">
                &ldquo;{testimonial.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-4 text-xs uppercase tracking-[0.1em] text-muted">
                — {testimonial.author}
              </figcaption>
            </figure>
          ))}
        </div>
      </PageContainer>
    </section>
  );
}
