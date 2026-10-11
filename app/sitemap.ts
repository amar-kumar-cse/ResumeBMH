import { MetadataRoute } from "next";
import { INDEXABLE_PUBLIC_ROUTES, getCanonicalUrl } from "@/lib/seo/config";

/**
 * Dynamic XML Sitemap generator for ResumeBMH.
 * Served by Next.js App Router at /sitemap.xml
 *
 * Adheres strictly to Google Search Console standards:
 * - Only 200 OK indexable canonical pages are included.
 * - Authenticated routes (/dashboard, /resume, /ats, etc.) and noindexed pages (/login, /signup) are excluded.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  // Use a fixed build date baseline to prevent artificial crawl churning
  const lastModified = new Date("2026-10-12T00:00:00.000Z");

  return INDEXABLE_PUBLIC_ROUTES.map((route) => ({
    url: getCanonicalUrl(route.path),
    lastModified,
    changeFrequency: route.changeFrequency,
    priority: route.priority,
  }));
}
