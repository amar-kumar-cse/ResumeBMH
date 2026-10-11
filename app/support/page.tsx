import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, LifeBuoy, HelpCircle, FileCheck2, Cpu, CreditCard, ChevronRight } from "lucide-react";
import { Card, Badge } from "@/components/ui/primitives";
import { SITE_URL, getBreadcrumbSchema, getFaqSchema } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: "Help Center, FAQs & Product Guides",
  description:
    "Find guides, frequently asked questions, and troubleshooting for Karyvo. Learn about ATS single-column formatting, factual AI bullet optimization, and billing.",
  alternates: {
    canonical: "/support",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/support`,
    title: "Help & Support Center | Karyvo AI Career Platform",
    description:
      "Find guides, frequently asked questions, and troubleshooting for Karyvo ATS resume building and mock interviews.",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Karyvo Help & Support Center",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Help & Support Center | Karyvo AI Career Platform",
    description:
      "Find guides, frequently asked questions, and troubleshooting for Karyvo ATS resume building and mock interviews.",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

const supportBreadcrumbs = [
  { name: "Home", item: "/" },
  { name: "Support", item: "/support" },
];

const faqsData = [
  {
    q: "How does the AI Impact Bullet improver avoid hallucinating fake metrics?",
    a: "Unlike generic chatbots that inject fake numbers like 'increased sales by 45%', Karyvo enforces strict factual grounding. If you provided metrics in your draft, we sharpen the wording. If no metric is present, we articulate the engineering deliverable or place a clear '[add your metric]' placeholder.",
    category: "AI Features",
    icon: Cpu,
  },
  {
    q: "Will my uploaded PDF resume work with ATS scanners?",
    a: "Yes. Karyvo exports clean, single-column and multi-section layouts formatted in clean typography without background images, nested tables, or hidden glyphs that break Applicant Tracking Systems (Workday, Greenhouse, Lever).",
    category: "ATS Scanner",
    icon: FileCheck2,
  },
  {
    q: "What is included in the Free tier vs Karyvo Pro?",
    a: "Free tier users can build resumes, test the interactive AI bullet demo, create 1 tailored cover letter, conduct 1 full mock interview session, and optimize up to 3 AI bullets daily. Karyvo Pro unlocks unlimited cover letters, unlimited mock interviews, unlimited AI bullet improvements, and resume checkpoint version snapshots.",
    category: "Plans & Billing",
    icon: CreditCard,
  },
  {
    q: "How do I cancel my subscription or request a refund?",
    a: "You can cancel auto-renewal at any time from the Pricing or Settings page. You retain full Pro access until your current paid billing period ends. We also provide a full 7-day money-back guarantee for first-time Karyvo Pro subscribers.",
    category: "Billing",
    icon: CreditCard,
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    getBreadcrumbSchema(supportBreadcrumbs),
    getFaqSchema(
      faqsData.map((f) => ({ question: f.q, answer: f.a })),
      "support-faq"
    ),
  ],
};

export default function SupportPage() {
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
            <LifeBuoy className="h-3.5 w-3.5 mr-1" />
            Knowledge Base & FAQ
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Help & Support Center
          </h1>
          <p className="text-sm text-slate-600">
            Everything you need to know about building ATS-optimized resumes and preparing for interviews.
          </p>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <HelpCircle className="h-5 w-5 text-brand-primary" />
            <span>Frequently Asked Questions</span>
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {faqsData.map((faq, idx) => {
              const Icon = faq.icon;
              return (
                <Card key={idx} className="p-6 bg-white border-slate-200 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-semibold text-brand-primary">
                    <Icon className="h-4 w-4" />
                    <span>{faq.category}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 font-heading">{faq.q}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{faq.a}</p>
                </Card>
              );
            })}
          </div>
        </div>

        <Card className="p-8 bg-gradient-to-r from-indigo-50/60 to-sky-50/60 border-indigo-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <h3 className="font-bold text-slate-900 font-heading text-sm">Still have questions?</h3>
            <p className="text-xs text-slate-600">Our engineering support team is available Mon–Sat.</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-primary text-white font-semibold text-xs shadow-sm hover:bg-brand-primary/95 transition-all"
          >
            <span>Contact Support Desk</span>
            <ChevronRight className="h-4 w-4" />
          </Link>
        </Card>
      </div>
    </div>
  );
}
