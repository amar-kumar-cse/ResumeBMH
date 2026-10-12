import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, FileText, CheckCircle2 } from "lucide-react";
import { Container, Section, Card } from "@/components/landing/ui/primitives";
import { SITE_URL, getBreadcrumbSchema } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: "Terms of Service & Usage Agreement",
  description:
    "Terms and conditions governing use of the ResumeBMH resume builder, ATS health checker, and career preparation tools.",
  alternates: {
    canonical: "/terms",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/terms`,
    title: "Terms of Service | ResumeBMH AI Career Platform",
    description:
      "Terms and conditions governing use of the ResumeBMH resume builder and career tools.",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "ResumeBMH Terms of Service",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Terms of Service | ResumeBMH AI Career Platform",
    description:
      "Terms and conditions governing use of the ResumeBMH resume builder and career tools.",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

const termsBreadcrumbs = [
  { name: "Home", item: "/" },
  { name: "Terms of Service", item: "/terms" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [getBreadcrumbSchema(termsBreadcrumbs)],
};

export default function TermsPage() {
  return (
    <Section background="subtle">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Container size="narrow">
        <div className="space-y-6">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent-light px-2.5 py-1 rounded-md">
              Legal Agreement
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-ink font-heading tracking-tight mt-2 mb-2">
              Terms of Service
            </h1>
            <p className="text-sm text-ink-muted">
              Last updated: October 2026. Please read these terms carefully before using ResumeBMH.
            </p>
          </div>

          <Card className="p-8 sm:p-10 space-y-8 text-base text-ink-muted leading-relaxed bg-white border-slate-200">
            <section className="space-y-3">
              <h2 className="text-xl font-bold text-ink font-heading">
                1. Acceptance of Terms
              </h2>
              <p>
                By creating an account or accessing ResumeBMH, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-ink font-heading">
                2. User Account and Accuracy of Information
              </h2>
              <p>
                You are responsible for maintaining the confidentiality of your account credentials. You represent that the career experience, education, and credentials you provide in your Master Career Profile are accurate and truthfully reflect your background. ResumeBMH provides optimization tools but does not verify the truthfulness of user-submitted qualifications.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-ink font-heading">
                3. Subscriptions and Payments
              </h2>
              <p>
                Certain features require a paid Pro subscription. Subscription fees are billed in Indian Rupees (INR) through RBI-compliant payment processors (Razorpay). You may cancel your subscription at any time; cancellation takes effect at the end of the current billing cycle.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-ink font-heading">
                4. No Employment Guarantee
              </h2>
              <p>
                ResumeBMH is a document preparation and interview preparation tool. We do not guarantee employment, interview callbacks, job offers, or specific ATS scores. Hiring decisions are made solely by individual employers.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold text-ink font-heading">
                5. Contact Information
              </h2>
              <p>
                For questions regarding these Terms of Service, please contact us at{" "}
                <a href="mailto:support@resumebmh.com" className="text-accent underline font-medium">
                  support@resumebmh.com
                </a>.
              </p>
            </section>
          </Card>
        </div>
      </Container>
    </Section>
  );
}
