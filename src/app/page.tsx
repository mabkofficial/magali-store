import { CategoryCards } from "@/components/home/category-cards";
import { EmailSignup } from "@/components/home/email-signup";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import {
  BrandStorySection,
  FoodSpotlight,
  TrustStrip,
  WellnessSpotlight,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoryCards />
      <FeaturedProducts />
      <BrandStorySection />
      <WellnessSpotlight />
      <FoodSpotlight />
      <TrustStrip />
      <EmailSignup />
    </>
  );
}
