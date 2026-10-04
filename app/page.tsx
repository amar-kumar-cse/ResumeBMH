import React from "react";
import { HeroSection } from "@/components/landing/hero-section";
import { InteractiveBulletDemo } from "@/components/landing/interactive-bullet-demo";
import { XyzExplanationSection } from "@/components/landing/xyz-explanation-section";
import { HowItWorksSection } from "@/components/landing/how-it-works-section";
import { FeaturesGridSection } from "@/components/landing/features-grid-section";
import { PricingSection } from "@/components/landing/pricing-section";
import { FaqSection } from "@/components/landing/faq-section";
import { CtaSection } from "@/components/landing/cta-section";
import { Container, Section, SectionHeading } from "@/components/landing/ui/primitives";

export default function HomePage() {
  return (
    <div className="relative space-y-0 pb-16">
      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. LIVE INTERACTIVE FORMULA DEMO */}
      <Section background="subtle">
        <Container>
          <SectionHeading
            badge="Try It Live"
            title="See the XYZ formula in action"
            description="Select a role or paste a rough bullet point to see how Karyvo structures your real experience into quantifiable impact."
          />
          <InteractiveBulletDemo />
        </Container>
      </Section>

      {/* 3. THE XYZ METHOD EXPLANATION */}
      <XyzExplanationSection />

      {/* 4. HOW IT WORKS (3 STEPS) */}
      <HowItWorksSection />

      {/* 5. FEATURES GRID (6 CARDS MAX) */}
      <FeaturesGridSection />

      {/* 6. PRICING & FEATURE COMPARISON */}
      <PricingSection />

      {/* 7. HONEST FAQS */}
      <FaqSection />

      {/* 8. FINAL CTA */}
      <CtaSection />
    </div>
  );
}
