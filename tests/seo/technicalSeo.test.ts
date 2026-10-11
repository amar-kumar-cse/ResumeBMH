import { describe, it, expect } from "vitest";
import sitemap from "@/app/sitemap";
import robots from "@/app/robots";
import manifest from "@/app/manifest";
import {
  SITE_URL,
  INDEXABLE_PUBLIC_ROUTES,
  getCanonicalUrl,
  getOrganizationSchema,
  getWebSiteSchema,
  getSoftwareApplicationSchema,
  getFaqSchema,
  getBreadcrumbSchema,
  getProductPricingSchema,
} from "@/lib/seo/config";

describe("Technical SEO Implementation", () => {
  describe("XML Sitemap (sitemap.ts)", () => {
    it("generates an array of indexable canonical URLs", () => {
      const urls = sitemap();
      expect(Array.isArray(urls)).toBe(true);
      expect(urls.length).toBe(INDEXABLE_PUBLIC_ROUTES.length);
    });

    it("includes key public pages with high priority", () => {
      const urls = sitemap();
      const homeEntry = urls.find((u) => u.url === `${SITE_URL}`);
      const pricingEntry = urls.find((u) => u.url === `${SITE_URL}/pricing`);
      const supportEntry = urls.find((u) => u.url === `${SITE_URL}/support`);

      expect(homeEntry).toBeDefined();
      expect(homeEntry?.priority).toBe(1.0);
      expect(pricingEntry).toBeDefined();
      expect(pricingEntry?.priority).toBe(0.9);
      expect(supportEntry).toBeDefined();
    });

    it("strictly excludes private app routes and noindexed auth pages", () => {
      const urls = sitemap();
      const forbiddenPrefixes = [
        "/api",
        "/dashboard",
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

      for (const entry of urls) {
        for (const prefix of forbiddenPrefixes) {
          expect(entry.url).not.toBe(`${SITE_URL}${prefix}`);
        }
      }
    });

    it("ensures each entry has valid lastModified and changeFrequency", () => {
      const urls = sitemap();
      for (const entry of urls) {
        expect(entry.lastModified).toBeInstanceOf(Date);
        expect(entry.changeFrequency).toBeDefined();
        expect(typeof entry.priority).toBe("number");
        expect(entry.priority).toBeGreaterThanOrEqual(0.1);
        expect(entry.priority).toBeLessThanOrEqual(1.0);
      }
    });
  });

  describe("Robots Specification (robots.ts)", () => {
    it("provides valid robots directives and references sitemap.xml", () => {
      const config = robots();
      expect(config.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
      expect(config.host).toBe(SITE_URL.replace(/^https?:\/\//, ""));
      expect(Array.isArray(config.rules)).toBe(true);
    });

    it("disallows private app suites and auth pages for wildcard user-agent", () => {
      const config = robots();
      const wildRule = (config.rules as any[]).find(
        (r) => r.userAgent === "*" || (Array.isArray(r.userAgent) && r.userAgent.includes("*"))
      );
      expect(wildRule).toBeDefined();
      expect(wildRule.disallow).toContain("/api/");
      expect(wildRule.disallow).toContain("/dashboard/");
      expect(wildRule.disallow).toContain("/resume");
      expect(wildRule.disallow).toContain("/ats");
      expect(wildRule.disallow).toContain("/login");
    });

    it("explicitly welcomes AI search engines for citability and GEO", () => {
      const config = robots();
      const aiRule = (config.rules as any[]).find((r) =>
        Array.isArray(r.userAgent)
          ? r.userAgent.includes("OAI-SearchBot") || r.userAgent.includes("PerplexityBot")
          : false
      );
      expect(aiRule).toBeDefined();
      expect(aiRule.allow).toContain("/");
      expect(aiRule.allow).toContain("/pricing");
      expect(aiRule.allow).toContain("/support");
      expect(aiRule.allow).toContain("/llms.txt");
    });
  });

  describe("Web App Manifest (manifest.ts)", () => {
    it("returns valid PWA & mobile search manifest attributes", () => {
      const m = manifest();
      expect(m.name).toContain("Karyvo");
      expect(m.short_name).toBe("Karyvo");
      expect(m.start_url).toBe("/");
      expect(m.display).toBe("standalone");
      expect(m.theme_color).toBe("#2563eb");
      expect(m.icons?.length).toBeGreaterThan(0);
    });
  });

  describe("Canonical URL Generation (config.ts)", () => {
    it("constructs clean absolute canonical URLs without double slashes", () => {
      expect(getCanonicalUrl("")).toBe(SITE_URL);
      expect(getCanonicalUrl("/")).toBe(SITE_URL);
      expect(getCanonicalUrl("/pricing")).toBe(`${SITE_URL}/pricing`);
      expect(getCanonicalUrl("support")).toBe(`${SITE_URL}/support`);
    });
  });

  describe("Schema.org JSON-LD Generators", () => {
    it("generates valid Organization schema", () => {
      const org = getOrganizationSchema();
      expect(org["@type"]).toBe("Organization");
      expect(org.name).toBe("Karyvo");
      expect(org.url).toBe(SITE_URL);
      expect(org.contactPoint.length).toBeGreaterThan(0);
    });

    it("generates valid WebSite schema with SearchAction", () => {
      const site = getWebSiteSchema();
      expect(site["@type"]).toBe("WebSite");
      expect(site.url).toBe(SITE_URL);
      expect(site.potentialAction["@type"]).toBe("SearchAction");
    });

    it("generates valid SoftwareApplication schema with pricing offers", () => {
      const app = getSoftwareApplicationSchema();
      expect(app["@type"]).toBe("SoftwareApplication");
      expect(app.name).toContain("Karyvo");
      expect(app.applicationCategory).toBe("BusinessApplication");
      expect(app.offers.length).toBe(2);
      expect(app.offers[0].price).toBe("0");
      expect(app.offers[1].price).toBe("99");
      expect(app.aggregateRating.ratingValue).toBe("4.9");
    });

    it("generates valid FAQPage schema", () => {
      const faqs = [
        { question: "Is Karyvo free?", answer: "Yes, you can build single-column ATS resumes for free." },
        { question: "Does it pass ATS?", answer: "Karyvo generates single-column formats that parse cleanly." },
      ];
      const faqSchema = getFaqSchema(faqs, "test-faq");
      expect(faqSchema["@type"]).toBe("FAQPage");
      expect(faqSchema.mainEntity.length).toBe(2);
      expect(faqSchema.mainEntity[0].name).toBe(faqs[0].question);
      expect(faqSchema.mainEntity[0].acceptedAnswer.text).toBe(faqs[0].answer);
    });

    it("generates valid BreadcrumbList schema", () => {
      const crumbs = [
        { name: "Home", item: "/" },
        { name: "Pricing", item: "/pricing" },
      ];
      const breadcrumbs = getBreadcrumbSchema(crumbs);
      expect(breadcrumbs["@type"]).toBe("BreadcrumbList");
      expect(breadcrumbs.itemListElement.length).toBe(2);
      expect(breadcrumbs.itemListElement[0].position).toBe(1);
      expect(breadcrumbs.itemListElement[0].name).toBe("Home");
      expect(breadcrumbs.itemListElement[1].position).toBe(2);
      expect(breadcrumbs.itemListElement[1].name).toBe("Pricing");
      expect(breadcrumbs.itemListElement[1].item).toBe(`${SITE_URL}/pricing`);
    });

    it("generates valid ProductPricing schema for the pricing page", () => {
      const product = getProductPricingSchema();
      expect(product["@type"]).toBe("Product");
      expect(product.offers["@type"]).toBe("AggregateOffer");
      expect(product.offers.lowPrice).toBe("0");
      expect(product.offers.highPrice).toBe("99");
    });
  });
});
