# Karyvo XML Sitemap & Robots Audit Report

**Target:** `http://localhost:3000/sitemap.xml` / `https://karyvo.com/sitemap.xml`  
**Auditor Engine:** Claude SEO v2.4.2 (`seo-sitemap` validator)  
**Status:** 🟢 **100% Valid & Production Compliant**  

---

## 1. Quality & Standards Checklist

| Metric / Check | Standard Limit | Karyvo Status | Result |
| :--- | :--- | :--- | :---: |
| **XML Schema** | `sitemaps.org/schemas/sitemap/0.9` | Declared & Valid XML UTF-8 | ✅ PASS |
| **URL Count** | ≤ 50,000 URLs per file | 9 Public URLs | ✅ PASS |
| **Uncompressed Size** | ≤ 50 MB | ~1.65 KB | ✅ PASS |
| **HTTP Status Codes** | 100% URLs must return HTTP 200 | All 9 URLs return `200 OK` (0 redirects, 0 errors) | ✅ PASS |
| **Robots.txt Reference** | Declared in `robots.txt` | `Sitemap: https://karyvo.com/sitemap.xml` | ✅ PASS |
| **W3C `<lastmod>`** | Accurate ISO 8601 Datetime | Valid ISO format generated dynamically | ✅ PASS |
| **No Private Redirects** | Private app paths excluded | Auth-gated routes (`/ats`, `/cover-letter`, etc.) isolated in `robots.txt` disallow | ✅ PASS |

---

## 2. Indexed Public URLs (All Verified HTTP 200)

1. `https://karyvo.com/` — **Priority: 1.0** (Daily) — Home & Master Career Profile Overview
2. `https://karyvo.com/pricing` — **Priority: 0.9** (Daily) — Transparent Tier Plans (₹0 & ₹99)
3. `https://karyvo.com/signup` — **Priority: 0.7** (Monthly) — Create Account
4. `https://karyvo.com/login` — **Priority: 0.6** (Monthly) — User Sign In
5. `https://karyvo.com/contact` — **Priority: 0.7** (Weekly) — Contact & Inquiries
6. `https://karyvo.com/support` — **Priority: 0.7** (Weekly) — Customer Support
7. `https://karyvo.com/privacy` — **Priority: 0.4** (Monthly) — Privacy Policy
8. `https://karyvo.com/terms` — **Priority: 0.4** (Monthly) — Terms of Service
9. `https://karyvo.com/refund-policy` — **Priority: 0.4** (Monthly) — Cancellation & Refund Policy

---

## 3. Disallowed Private Routes in `robots.txt`
To protect user privacy and avoid wasting search crawler budget on auth redirects:
- `/api/`
- `/dashboard/`
- `/auth/callback`
- `/resume`
- `/profile`
- `/ats`
- `/cover-letter`
- `/interview`
