import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, RefreshCw, CheckCircle2, HelpCircle, ShieldCheck } from "lucide-react";
import { Card, Badge } from "@/components/ui/primitives";
import { SITE_URL, getBreadcrumbSchema } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: "Refund Policy & 7-Day Money-Back Guarantee",
  description:
    "Learn about ResumeBMH's transparent refund policy, billing terms, and 7-day money-back guarantee for first-time Pro subscribers.",
  alternates: {
    canonical: "/refund-policy",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/refund-policy`,
    title: "Refund Policy | ResumeBMH AI Career Platform",
    description:
      "Learn about ResumeBMH's transparent refund policy, billing terms, and cancellation guarantees.",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "ResumeBMH Refund Policy",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Refund Policy | ResumeBMH AI Career Platform",
    description:
      "Learn about ResumeBMH's transparent refund policy, billing terms, and cancellation guarantees.",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

const refundBreadcrumbs = [
  { name: "Home", item: "/" },
  { name: "Refund Policy", item: "/refund-policy" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [getBreadcrumbSchema(refundBreadcrumbs)],
};

export default function RefundPolicyPage() {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      {/* Schema.org Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto space-y-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 hover:text-brand-primary transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        <div className="space-y-2">
          <Badge variant="brand" size="sm">
            <RefreshCw className="h-3.5 w-3.5 mr-1" />
            Billing & Guarantee
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Cancellation & Refund Policy
          </h1>
          <p className="text-sm text-slate-600">
            Last updated: October 2026. Fair, transparent terms with no hidden lock-ins.
          </p>
        </div>

        <Card className="p-8 sm:p-10 space-y-8 text-slate-700 leading-relaxed text-sm bg-white border-slate-200">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-brand-primary" />
              <span>1. 7-Day Money-Back Guarantee</span>
            </h2>
            <p>
              We want you to be completely satisfied with ResumeBMH Pro. If you upgrade to ResumeBMH Pro (Monthly or Annual) and
              find that our AI bullet optimization, ATS scanning, or mock interview prep does not meet your expectations, you
              can request a full refund within <strong>7 calendar days</strong> of your initial payment date.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>2. No-Hassle Cancellation</span>
            </h2>
            <p>
              You can cancel your subscription renewal at any time directly from your account settings or pricing page. When you cancel:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Retain Full Pro Access:</strong> You keep full access to all Pro features until the end of your
                currently paid billing period (no premature access cutoff).
              </li>
              <li>
                <strong>No Surprise Renewals:</strong> You will never be billed again after initiating cancellation.
              </li>
              <li>
                <strong>Data Retention:</strong> All your generated resumes, versions, and cover letters remain safely stored in your account.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
              <HelpCircle className="h-5 w-5 text-brand-primary" />
              <span>3. How to Request a Refund</span>
            </h2>
            <p>
              To request a refund within the 7-day guarantee window, please contact our support desk:
            </p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1 font-mono text-xs text-slate-800">
              <p>Email: <strong>support@resumebmh.com</strong></p>
              <p>Subject: <em>Refund Request - [Your Registered Email]</em></p>
              <p>Please include your Razorpay Order ID or payment receipt.</p>
            </div>
            <p className="text-xs text-slate-500">
              Refunds are processed through Razorpay back to your original payment method within 5–7 business days.
            </p>
          </section>
        </Card>
      </div>
    </div>
  );
}
