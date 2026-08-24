import { CategoryCards } from "@/components/home/category-cards";
import { EmailSignup } from "@/components/home/email-signup";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import {
  BrandStorySection,
  ProductHighlightsSection,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <CategoryCards />
      <BrandStorySection />
      <ProductHighlightsSection />
      <EmailSignup />
    </>
  );
}
