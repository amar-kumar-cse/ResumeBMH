import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Check } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white/90 backdrop-blur-xl py-12 text-ink-muted relative z-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10 mb-10">
          {/* Brand info */}
          <div className="space-y-3.5">
            <Link href="/" className="inline-flex items-center gap-2.5 group select-none">
              <div className="relative h-8 w-8 rounded-xl overflow-hidden shadow-sm shadow-blue-500/25 group-hover:scale-105 transition-transform bg-blue-600 flex items-center justify-center">
                <Image
                  src="/favicon.ico"
                  alt="Karyvo Logo"
                  width={32}
                  height={32}
                  className="h-full w-full object-cover"
                />
              </div>
              <span className="font-brand text-xl font-extrabold text-slate-900 tracking-[-0.03em]">
                Resume<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent font-black ml-0.5">BMH</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-600">
              AI-powered career suite designed to help engineers and job seekers present verified, quantifiable achievements that beat ATS filters and impress recruiters.
            </p>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/80 select-none">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
              <span>100% Verifiable Career Data</span>
            </div>
          </div>

          {/* Product Tools */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3.5 tracking-tight font-heading">Product Tools</h2>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/profile" className="text-slate-600 hover:text-blue-600 transition-colors">Master Career Profile</Link></li>
              <li><Link href="/resume" className="text-slate-600 hover:text-blue-600 transition-colors">ATS Resume Builder</Link></li>
              <li><Link href="/ats" className="text-slate-600 hover:text-blue-600 transition-colors">Resume Health Check</Link></li>
              <li><Link href="/#interactive-demo" className="text-slate-600 hover:text-blue-600 transition-colors">AI Bullet Optimizer</Link></li>
              <li><Link href="/cover-letter" className="text-slate-600 hover:text-blue-600 transition-colors">Cover Letter Builder</Link></li>
              <li><Link href="/interview" className="text-slate-600 hover:text-blue-600 transition-colors">Role Mock Interview</Link></li>
            </ul>
          </div>

          {/* Platform & Resources */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3.5 tracking-tight font-heading">Platform & Resources</h2>
            <ul className="space-y-2.5 text-sm">
              <li><Link href="/#how-it-works" className="text-slate-600 hover:text-blue-600 transition-colors">How Karyvo Works</Link></li>
              <li><Link href="/#features" className="text-slate-600 hover:text-blue-600 transition-colors">Product Capabilities</Link></li>
              <li><Link href="/pricing" className="text-slate-600 hover:text-blue-600 transition-colors">Pricing Plans</Link></li>
              <li><Link href="/#faq" className="text-slate-600 hover:text-blue-600 transition-colors">Frequently Asked Questions</Link></li>
              <li><Link href="/support" className="text-slate-600 hover:text-blue-600 transition-colors">Help & Support</Link></li>
            </ul>
          </div>

          {/* Trust & Security */}
          <div>
            <h2 className="text-sm font-bold text-slate-900 mb-3.5 tracking-tight font-heading">Trust & Security</h2>
            <p className="text-sm text-slate-600 mb-3.5 leading-relaxed">
              Your career data is isolated with enterprise row-level security. We never sell your personal data or use it to train public models.
            </p>
            <div className="text-xs text-slate-600 space-y-2">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" aria-hidden="true" />
                <span>Dedicated Supabase RLS Security</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" aria-hidden="true" />
                <span>RBI-Compliant Razorpay Gateway</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 stroke-[2.5]" aria-hidden="true" />
                <span>ATS Single-Column Format Standard</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Karyvo. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/privacy" className="hover:text-blue-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-blue-600 transition-colors">
              Terms of Service
            </Link>
            <Link href="/refund-policy" className="hover:text-blue-600 transition-colors">
              Refund Policy
            </Link>
            <Link href="/support" className="hover:text-blue-600 transition-colors">
              Support
            </Link>
            <Link href="/contact" className="hover:text-blue-600 transition-colors">
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
