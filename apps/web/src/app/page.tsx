import { HeroSection } from "@/components/home/HeroSection";
import { StatsSection } from "@/components/home/StatsSection";
import { FeaturedCourses } from "@/components/home/FeaturedCourses";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { Testimonials } from "@/components/home/Testimonials";
import { CTASection } from "@/components/home/CTASection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <StatsSection />
      <FeaturedCourses />
      <WhyChooseUs />
      <Testimonials />
      <CTASection />
    </>
  );
}
