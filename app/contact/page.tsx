import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Mail, MessageSquare, MapPin, Clock, Send } from "lucide-react";
import { Card, Badge, Button } from "@/components/ui/primitives";
import { SITE_URL, getBreadcrumbSchema } from "@/lib/seo/config";

export const metadata: Metadata = {
  title: "Contact Customer Support & Product Team",
  description:
    "Get in touch with ResumeBMH product and technical support. Quick assistance for subscriptions, ATS resume exports, and career tool inquiries.",
  alternates: {
    canonical: "/contact",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/contact`,
    title: "Contact ResumeBMH | Customer Support & Assistance",
    description:
      "Get in touch with ResumeBMH product and technical support. Inquiries for billing, account assistance, and feature guidance.",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "Contact ResumeBMH Support",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Contact ResumeBMH | Customer Support & Assistance",
    description:
      "Get in touch with ResumeBMH product and technical support. Inquiries for billing, account assistance, and feature guidance.",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

const contactBreadcrumbs = [
  { name: "Home", item: "/" },
  { name: "Contact", item: "/contact" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    getBreadcrumbSchema(contactBreadcrumbs),
    {
      "@type": "ContactPage",
      "@id": `${SITE_URL}/contact#webpage`,
      url: `${SITE_URL}/contact`,
      name: "Contact ResumeBMH Support",
      description: "Get in touch with the ResumeBMH engineering and product support team.",
      mainEntity: {
        "@type": "Organization",
        name: "ResumeBMH",
        url: SITE_URL,
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: "support@resumebmh.com",
          availableLanguage: ["English", "Hindi"],
          areaServed: "IN",
        },
      },
    },
  ],
};

export default function ContactPage() {
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
            <Mail className="h-3.5 w-3.5 mr-1" />
            Support & Inquiries
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-heading">
            Contact ResumeBMH Support
          </h1>
          <p className="text-sm text-slate-600">
            Have questions about your subscription, career exports, or technical features? We are here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 bg-white border-slate-200 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-50 text-brand-primary flex items-center justify-center">
              <Mail className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-900 font-heading text-sm">Email Inquiries</h2>
            <p className="text-xs text-slate-600">General assistance and billing:</p>
            <a href="mailto:support@resumebmh.com" className="text-xs font-semibold text-brand-primary hover:underline block">
              support@resumebmh.com
            </a>
          </Card>

          <Card className="p-6 bg-white border-slate-200 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Clock className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-900 font-heading text-sm">Response Time</h2>
            <p className="text-xs text-slate-600">Engineering support response SLA:</p>
            <span className="text-xs font-semibold text-slate-800 block">Under 24 hours (Mon–Sat)</span>
          </Card>

          <Card className="p-6 bg-white border-slate-200 space-y-3">
            <div className="h-10 w-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="font-bold text-slate-900 font-heading text-sm">Headquarters</h2>
            <p className="text-xs text-slate-600">ResumeBMH Career Suite</p>
            <span className="text-xs font-semibold text-slate-800 block">Bengaluru, Karnataka, India</span>
          </Card>
        </div>

        <Card className="p-8 bg-white border-slate-200 space-y-6">
          <h2 className="text-lg font-bold text-slate-900 font-heading flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-brand-primary" />
            <span>Send Us a Direct Message</span>
          </h2>

          <form
            action="mailto:support@resumebmh.com"
            method="GET"
            className="space-y-4"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Your Name</label>
                <input
                  type="text"
                  name="name"
                  placeholder="e.g. Priya Sharma"
                  className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Registered Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="e.g. priya@example.com"
                  className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="e.g. Billing Question / Feature Request / Bug Report"
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Message</label>
              <textarea
                name="body"
                rows={4}
                placeholder="Describe what you need assistance with..."
                className="w-full text-xs rounded-xl border border-slate-300 px-3.5 py-2.5 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary outline-none"
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full sm:w-auto">
              <Send className="h-4 w-4 mr-1.5" />
              Open Support Email Client
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
}
