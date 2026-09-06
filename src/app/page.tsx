import { CategoryCards } from "@/components/home/category-cards";
import { EmailSignup } from "@/components/home/email-signup";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import { StorySection } from "@/components/home/sections";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { TrustBadges } from "@/components/layout/trust-badges";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CategoryCards />
      <StorySection />
      <TrustBadges />
      <TestimonialsSection />
      <EmailSignup />
    </>
  );
}
