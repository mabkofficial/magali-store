import { BundleRoutineSection } from "@/components/home/bundle-routine-section";
import { CategoryCards } from "@/components/home/category-cards";
import { EmailSignup } from "@/components/home/email-signup";
import { FeaturedProducts } from "@/components/home/featured-products";
import { HeroSection } from "@/components/home/hero-section";
import { StorySection } from "@/components/home/sections";
import { TestimonialsSection } from "@/components/home/testimonials-section";
import { TrustBadges } from "@/components/layout/trust-badges";
import { buildPageMetadata } from "@/lib/seo/metadata";

export const metadata = buildPageMetadata({
  title: "Botanical Hair Care, Wellness Oils & Caribbean Favorites",
  description:
    "Discover Magali botanical hair oil, herbal hair grease, PureHeal wellness oil, curated hair care bundles, and Caribbean-style beef pies. Crafted for everyday life.",
  path: "/",
});

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FeaturedProducts />
      <BundleRoutineSection />
      <CategoryCards />
      <StorySection />
      <TrustBadges />
      <TestimonialsSection />
      <EmailSignup showIncentive={false} />
    </>
  );
}
