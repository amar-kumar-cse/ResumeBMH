# ResumeBMH SEO Action Plan

Prioritized roadmap based on the Claude SEO audit.

---

### Phase 1: Critical & Quick Wins (Immediate - 15 mins)
- [ ] **Fix Title Character Entity:** In [app/layout.tsx](file:///c:/Users/yadav/OneDrive/Desktop/ResumeBMH/app/layout.tsx), ensure the title separator uses a clean unicode dash or standard hyphen instead of encoding artifacts.
- [ ] **Canonical URL:** Add `metadataBase` and `alternates: { canonical: '/' }` in [app/layout.tsx](file:///c:/Users/yadav/OneDrive/Desktop/ResumeBMH/app/layout.tsx).
- [ ] **Social Share Images:** Add `images: ['/images/og-resumebmh.png']` under `openGraph` and `twitter` in [app/layout.tsx](file:///c:/Users/yadav/OneDrive/Desktop/ResumeBMH/app/layout.tsx).

---

### Phase 2: Schema.org Rich Snippets (1-2 days)
- [ ] **SoftwareApplication Schema:** Embed JSON-LD in [app/page.tsx](file:///c:/Users/yadav/OneDrive/Desktop/ResumeBMH/app/page.tsx) to qualify for Google rich software snippets and price tags (INR 0 - 99).
- [ ] **FAQPage Schema:** Add FAQ JSON-LD to display expandable Q&A accordions directly on Google SERP.

---

### Phase 3: AI Search & GEO Optimization (1 week)
- [ ] **Add `/public/llms.txt`:** Include structured summary of ResumeBMH, ATS features, XYZ method, and URL routing for AI agents (ChatGPT Search, Perplexity, Claude, Google AI Overviews).
- [ ] **Keyword Landing Pages:** Build targeted pages for high-intent queries like:
  - `/ats-checker-india`
  - `/resume-builder-for-fresher`
  - `/xyz-resume-bullets`
