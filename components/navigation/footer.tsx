import React from "react";
import Link from "next/link";
import { ShieldCheck } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white py-12 text-ink-muted">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          {/* Brand info */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <span className="text-xl font-extrabold text-ink tracking-tight font-heading">
                Karyvo
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-ink-muted">
              Career platform grounded in Laszlo Bock&apos;s XYZ formula. Write verified, quantifiable resume bullets and format clean, ATS-parseable documents without hallucinated metrics.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs text-ink-subtle bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200 select-none">
              <ShieldCheck className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
              <span>No Invented Numbers Guarantee</span>
            </div>
          </div>

          {/* Product Tools */}
          <div>
            <h2 className="text-sm font-bold text-ink mb-3 tracking-tight">Product Tools</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/profile" className="text-ink-muted hover:text-accent transition-colors">Master Career Profile</Link></li>
              <li><Link href="/resume" className="text-ink-muted hover:text-accent transition-colors">Resume Builder</Link></li>
              <li><Link href="/ats" className="text-ink-muted hover:text-accent transition-colors">Resume Health Check</Link></li>
              <li><Link href="/cover-letter" className="text-ink-muted hover:text-accent transition-colors">Cover Letter Builder</Link></li>
              <li><Link href="/interview" className="text-ink-muted hover:text-accent transition-colors">Role Mock Interview</Link></li>
            </ul>
          </div>

          {/* Standards & Links */}
          <div>
            <h2 className="text-sm font-bold text-ink mb-3 tracking-tight">Architecture & Standards</h2>
            <ul className="space-y-2 text-sm">
              <li><Link href="/#how-it-works" className="text-ink-muted hover:text-accent transition-colors">How Karyvo Works</Link></li>
              <li><Link href="/#features" className="text-ink-muted hover:text-accent transition-colors">Feature Overview</Link></li>
              <li><Link href="/pricing" className="text-ink-muted hover:text-accent transition-colors">Pricing Plans</Link></li>
              <li><Link href="/#faq" className="text-ink-muted hover:text-accent transition-colors">Frequently Asked Questions</Link></li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div>
            <h2 className="text-sm font-bold text-ink mb-3 tracking-tight">Trust & Privacy</h2>
            <p className="text-sm text-ink-muted mb-3 leading-relaxed">
              Your career data is isolated with row-level security. We never sell your personal information or use it to train public AI models.
            </p>
            <div className="text-xs text-ink-subtle space-y-1">
              <p>Database: Dedicated Supabase RLS</p>
              <p>Payments: RBI-compliant Razorpay</p>
              <p>Formats: ATS single-column standard</p>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-ink-subtle gap-4">
          <p>© {new Date().getFullYear()} Karyvo. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-accent transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-accent transition-colors">
              Terms of Service
            </Link>
            <Link href="mailto:support@karyvo.com" className="hover:text-accent transition-colors">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
