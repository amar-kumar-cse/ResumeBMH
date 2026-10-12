import type { Metadata } from "next";
import { PricingWorkspace } from "@/components/pricing/pricing-workspace";
import {
  SITE_URL,
  getBreadcrumbSchema,
  getProductPricingSchema,
} from "@/lib/seo/config";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Pricing Plans & Pro Upgrade | AI Resume Builder",
  description:
    "Explore ResumeBMH pricing plans. Build ATS-compliant resumes for free or upgrade to ResumeBMH Pro for ₹99 for unlimited AI bullet optimizations, ATS audits, and mock interviews.",
  alternates: {
    canonical: "/pricing",
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: `${SITE_URL}/pricing`,
    title: "ResumeBMH Pricing | Affordable AI Career Suite & Pro Upgrade",
    description:
      "Start building your resume for free. Upgrade to ResumeBMH Pro for ₹99 for unlimited AI bullet optimizations, ATS audits, and mock interviews.",
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "ResumeBMH Pricing Plans",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ResumeBMH Pricing | Affordable AI Career Suite & Pro Upgrade",
    description:
      "Start building your resume for free. Upgrade to ResumeBMH Pro for ₹99 for unlimited AI bullet optimizations, ATS audits, and mock interviews.",
    images: [`${SITE_URL}/opengraph-image`],
  },
};

const pricingBreadcrumbs = [
  { name: "Home", item: "/" },
  { name: "Pricing", item: "/pricing" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    getBreadcrumbSchema(pricingBreadcrumbs),
    getProductPricingSchema(),
  ],
};

export default function PricingPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <PricingWorkspace />
    </>
  );
}
