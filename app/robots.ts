import { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";

/**
 * Dynamic robots.txt generator for Karyvo.
 * Served by Next.js App Router at /robots.txt
 *
 * Configured for modern search engines (Googlebot, Bingbot),
 * AI search engines (OAI-SearchBot, Claude-SearchBot, PerplexityBot) for citability,
 * while protecting private APIs, authenticated app suites, and auth routes.
 */
export default function robots(): MetadataRoute.Robots {
  const privateDisallows = [
    "/api/",
    "/dashboard/",
    "/auth/",
    "/resume",
    "/profile",
    "/ats",
    "/cover-letter",
    "/interview",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
  ];

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/llms.txt"],
        disallow: privateDisallows,
      },
      {
        userAgent: ["Googlebot", "Bingbot", "Applebot"],
        allow: "/",
        disallow: privateDisallows,
      },
      {
        // Explicitly allow AI search agents to index public marketing & documentation for GEO & citations
        userAgent: [
          "OAI-SearchBot",
          "Claude-SearchBot",
          "PerplexityBot",
          "ChatGPT-User",
        ],
        allow: [
          "/",
          "/pricing",
          "/support",
          "/contact",
          "/privacy",
          "/terms",
          "/refund-policy",
          "/llms.txt",
        ],
        disallow: [
          "/api/",
          "/dashboard/",
          "/auth/",
          "/resume",
          "/profile",
          "/ats",
          "/cover-letter",
          "/interview",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL.replace(/^https?:\/\//, ""),
  };
}
