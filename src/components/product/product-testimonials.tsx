import { getTestimonialsForProduct } from "@/config/testimonials";
import { AccordionItem } from "@/components/ui/accordion";

interface ProductTestimonialsProps {
  productId: string;
}

export function ProductTestimonials({ productId }: ProductTestimonialsProps) {
  const quotes = getTestimonialsForProduct(productId);

  if (quotes.length === 0) return null;

  return (
    <AccordionItem title="What customers say">
      <ul className="space-y-6">
        {quotes.map((testimonial) => (
          <li key={testimonial.id}>
            <blockquote className="text-sm leading-relaxed text-ink">
              &ldquo;{testimonial.quote}&rdquo;
            </blockquote>
            <p className="mt-2 text-xs uppercase tracking-[0.1em] text-muted">
              — {testimonial.author}
            </p>
          </li>
        ))}
      </ul>
    </AccordionItem>
  );
}
