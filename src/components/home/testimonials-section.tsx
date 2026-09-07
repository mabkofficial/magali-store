import { SectionShell } from "@/components/layout/section-shell";
import { getFeaturedTestimonials } from "@/config/testimonials";

export function TestimonialsSection() {
  const quotes = getFeaturedTestimonials(2);

  return (
    <SectionShell muted>
      <div className="mx-auto max-w-3xl text-center">
        <p className="eyebrow text-botanical">From our community</p>
        <h2 className="mt-3 font-display text-3xl text-ink lg:text-4xl">
          Real routines, real results
        </h2>
      </div>

      <div className="mx-auto mt-8 grid max-w-4xl grid-gap sm:grid-cols-2">
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
    </SectionShell>
  );
}
