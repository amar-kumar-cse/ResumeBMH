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
import {
  getSoftwareApplicationSchema,
  getOrganizationSchema,
  getWebSiteSchema,
  getFaqSchema,
} from "@/lib/seo/config";

const homeFaqs = [
  {
    question: "Does ResumeBMH guarantee that my resume will pass ATS screening?",
    answer:
      "No, and you should be skeptical of any tool that claims to guarantee an ATS pass. Every company configures its applicant tracking system differently, and human recruiters make the actual shortlist decisions. What ResumeBMH guarantees is clean, single-column document structure that eliminates technical parsing errors (like dropped text from tables or multi-column layouts) and ensures your real qualifications are clearly visible.",
  },
  {
    question: "Does ResumeBMH invent metrics or fake achievements?",
    answer:
      "Never. We do not invent percentages, fake project scopes, or imaginary team sizes. If your draft bullet point lacks a quantifiable result, ResumeBMH prompts you to input your actual numbers (e.g. users served, latency reduced, revenue impacted). If you don't know the exact figure, we help you frame the scope honestly without making things up.",
  },
  {
    question: "Where is my career data stored and is it private?",
    answer:
      "Your data is stored in dedicated, private databases secured with Row-Level Security (RLS). Only your authenticated account can access your profile and resume data. We never sell your personal information to third-party recruiters or use your private career history to train public AI models.",
  },
  {
    question: "What export formats are supported?",
    answer:
      "You can export your resume as a clean, high-resolution PDF or copy the formatted plain text. Our templates are designed specifically to adhere to standard single-column ATS specifications without graphics, sidebars, or floating text boxes.",
  },
  {
    question: "How is ResumeBMH different from pasting my resume into ChatGPT?",
    answer:
      "General AI chatbots tend to generate verbose, robotic text with unverifiable claims and hallucinated statistics. ResumeBMH is built around your verified Master Career Profile, optimizing bullet points with proven action verbs, quantifiable metrics, and strict ATS formatting standards.",
  },
  {
    question: "Can college freshers or career switchers use ResumeBMH?",
    answer:
      "Yes. The Master Profile includes options for academic projects, semester coursework, hackathon submissions, and foundational technical skills, allowing candidates without extensive corporate tenure to highlight genuine technical problem-solving.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    getSoftwareApplicationSchema(),
    getOrganizationSchema(),
    getWebSiteSchema(),
    getFaqSchema(homeFaqs, "faq"),
  ],
};

export default function HomePage() {
  return (
    <div className="relative space-y-0 pb-16">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* 1. HERO SECTION */}
      <HeroSection />

      {/* 2. LIVE INTERACTIVE FORMULA DEMO */}
      <Section id="interactive-demo" background="subtle">
        <Container>
          <SectionHeading
            badge="Interactive AI Tool"
            title="Turn Weak Bullets Into Recruiter-Ready Achievements"
            description="Select a role or paste a rough bullet point to see how ResumeBMH optimizes your real experience with proven action verbs and quantifiable results."
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
