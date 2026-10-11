/**
 * Centralized SEO & Structured Data Configuration for Karyvo.
 * Single source of truth for base URLs, canonical routes, metadata, and JSON-LD schemas.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") || "https://karyvo.com";

export const SITE_NAME = "Karyvo";
export const SITE_TAGLINE = "Build Your Resume. Beat ATS. Get Interview-Ready.";
export const SITE_TITLE_DEFAULT =
  "Karyvo | AI Resume Builder, Free ATS Checker & Career Platform";

export const SITE_DESCRIPTION =
  "India-first AI career platform. Master Career Profile powers single-column ATS Resume Builder, Standalone ATS Scanner, XYZ AI Bullet Improver, Cover Letter, and Role Interview simulator.";

export const SEO_KEYWORDS = [
  "AI Resume Builder",
  "ATS Resume Checker",
  "Free ATS Scanner India",
  "Single Column Resume Builder",
  "ATS Friendly Resume Format",
  "XYZ Resume Bullet Optimizer",
  "AI Bullet Improver",
  "Role Mock Interview AI",
  "Cover Letter Builder",
  "India Tech Jobs Resume",
  "SDE Placement Resume",
  "Karyvo AI Builder",
];

export interface SitemapRoute {
  path: string;
  changeFrequency: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority: number;
}

/**
 * Only publicly crawlable, indexable 200 OK pages are included in sitemap.xml.
 * Private/authenticated routes (/dashboard, /resume, /ats, /profile, etc.) and
 * noindexed auth pages (/login, /signup, etc.) are strictly excluded.
 */
export const INDEXABLE_PUBLIC_ROUTES: SitemapRoute[] = [
  { path: "", changeFrequency: "daily", priority: 1.0 },
  { path: "/pricing", changeFrequency: "daily", priority: 0.9 },
  { path: "/support", changeFrequency: "weekly", priority: 0.8 },
  { path: "/contact", changeFrequency: "monthly", priority: 0.7 },
  { path: "/privacy", changeFrequency: "monthly", priority: 0.4 },
  { path: "/terms", changeFrequency: "monthly", priority: 0.4 },
  { path: "/refund-policy", changeFrequency: "monthly", priority: 0.4 },
];

/**
 * Returns a fully qualified, normalized canonical URL without trailing slashes.
 */
export function getCanonicalUrl(path: string = ""): string {
  if (!path || path === "/") {
    return SITE_URL;
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath.replace(/\/$/, "")}`;
}

// -----------------------------------------------------------------------------
// Google Rich Results Compliant Schema.org JSON-LD Generators
// -----------------------------------------------------------------------------

export function getOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "Karyvo",
    legalName: "Karyvo Technologies",
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_URL}/logo-clean.png`,
      caption: "Karyvo AI Career Platform Logo",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "support@karyvo.com",
        availableLanguage: ["English", "Hindi"],
        areaServed: "IN",
      },
    ],
    sameAs: [
      "https://github.com/amar-kumar-cse/Karyvo",
    ],
  };
}

export function getWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: "Karyvo AI Career Platform",
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    inLanguage: "en-IN",
    description: SITE_DESCRIPTION,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/#interactive-demo?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getSoftwareApplicationSchema() {
  return {
    "@type": "SoftwareApplication",
    "@id": `${SITE_URL}/#software`,
    name: "Karyvo AI Builder",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Career & Resume Optimization",
    operatingSystem: "Web Browser",
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    offers: [
      {
        "@type": "Offer",
        name: "Starter Free Plan",
        price: "0",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        description: "Free single-column ATS resume builder, interactive AI bullet preview, 1 full mock interview session.",
      },
      {
        "@type": "Offer",
        name: "Karyvo Pro Plan",
        price: "99",
        priceCurrency: "INR",
        availability: "https://schema.org/InStock",
        description: "Unlimited AI bullet rewrites, unlimited mock interviews, unlimited tailored cover letters, and resume version snapshots.",
      },
    ],
    featureList: [
      "Master Career Profile inventory",
      "Single-column ATS resume builder",
      "XYZ formula AI bullet optimizer",
      "Standalone ATS parsing flaws scanner",
      "Job description-based mock interview simulator",
      "Targeted AI cover letter generator",
    ],
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "128",
      bestRating: "5",
      worstRating: "1",
    },
    author: {
      "@id": `${SITE_URL}/#organization`,
    },
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

export function getFaqSchema(faqs: FaqItem[], idSuffix: string = "faq") {
  return {
    "@type": "FAQPage",
    "@id": `${SITE_URL}/#${idSuffix}`,
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export interface BreadcrumbCrumb {
  name: string;
  item: string;
}

export function getBreadcrumbSchema(crumbs: BreadcrumbCrumb[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: crumb.name,
      item: crumb.item.startsWith("http") ? crumb.item : `${SITE_URL}${crumb.item}`,
    })),
  };
}

export function getProductPricingSchema() {
  return {
    "@type": "Product",
    "@id": `${SITE_URL}/pricing#product`,
    name: "Karyvo Pro Career Suite",
    description: "Full-stack AI resume optimization, ATS scanner, and mock interview suite.",
    brand: {
      "@type": "Brand",
      name: "Karyvo",
    },
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "INR",
      lowPrice: "0",
      highPrice: "99",
      offerCount: "2",
      offers: [
        {
          "@type": "Offer",
          name: "Starter Free",
          price: "0",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/pricing`,
        },
        {
          "@type": "Offer",
          name: "Karyvo Pro Monthly",
          price: "99",
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: `${SITE_URL}/pricing`,
        },
      ],
    },
  };
}
