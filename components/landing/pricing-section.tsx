"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, ArrowRight, Sparkles, Zap } from "lucide-react";
import { Container, Section, SectionHeading } from "./ui/primitives";

interface PlanFeature {
  name: string;
  free: string | boolean;
  pro: string | boolean;
}

const COMPARISON_FEATURES: PlanFeature[] = [
  { name: "Master Career Profile", free: true, pro: true },
  { name: "Single-column ATS templates", free: true, pro: true },
  { name: "Resume Health Check scan", free: true, pro: true },
  { name: "AI Bullet rewrites", free: "3 / day", pro: "Unlimited" },
  { name: "Active Resumes stored", free: "1 resume", pro: "Unlimited" },
  { name: "Role mock interviews with STAR feedback", free: false, pro: "Unlimited practice" },
  { name: "Targeted cover letter builder", free: false, pro: true },
  { name: "PDF & plain text export", free: true, pro: true },
  { name: "Version history & snapshots", free: false, pro: true },
];

export function PricingSection() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  return (
    <Section id="pricing" background="subtle">
      <Container>
        <SectionHeading
          badge="Fair & Transparent Pricing"
          title="Simple pricing. No hidden renewals."
          description="Start building your resume for free. Upgrade when you need unlimited optimizations, cover letters, and mock interviews."
        />

        {/* Modern Billing Cycle Toggle */}
        <div className="flex justify-center mb-12">
          <div
            role="radiogroup"
            aria-label="Billing frequency"
            className="inline-flex items-center p-1.5 rounded-full bg-white/90 backdrop-blur-md border border-slate-200/90 shadow-sm"
          >
            <button
              type="button"
              role="radio"
              suppressHydrationWarning
              aria-checked={billingCycle === "monthly"}
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-slate-900 text-white shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              role="radio"
              suppressHydrationWarning
              aria-checked={billingCycle === "yearly"}
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-2 ${
                billingCycle === "yearly"
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <span>Annual</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                billingCycle === "yearly"
                  ? "bg-emerald-400 text-emerald-950"
                  : "bg-emerald-100 text-emerald-800"
              }`}>
                Save 50%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 items-stretch">
          {/* Starter Tier */}
          <div className="flex flex-col justify-between p-8 sm:p-9 bg-white/90 backdrop-blur-xl border border-slate-200/90 shadow-[0_10px_35px_-8px_rgba(15,23,42,0.06)] rounded-3xl hover:border-slate-300 hover:shadow-lg transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200/70">
                  Free Forever
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 font-heading mb-2">Starter</h3>
              <p className="text-sm text-slate-600 mb-6 min-h-[40px] leading-relaxed">
                Core tools for students, freshers, and individual job applications.
              </p>

              <div className="mb-6 pb-6 border-b border-slate-100">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-slate-700">₹</span>
                  <span className="text-5xl font-black text-slate-900 font-brand tracking-tight">0</span>
                  <span className="text-sm font-semibold text-slate-500 ml-1.5">free forever</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 font-medium">No credit card or payment info needed</p>
              </div>

              <ul className="space-y-3.5 text-sm text-slate-600 mb-8">
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                  </div>
                  <span className="text-slate-700 font-medium">Master Career Profile</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                  </div>
                  <span className="text-slate-700 font-medium">1 active resume with live preview</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                  </div>
                  <span className="text-slate-700 font-medium">Single-column ATS templates</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                  </div>
                  <span className="text-slate-700 font-medium">Resume Health Check scan</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                  </div>
                  <span className="text-slate-700 font-medium">3 AI bullet rewrites / day</span>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" aria-hidden="true" />
                  </div>
                  <span className="text-slate-700 font-medium">Clean PDF & plain text export</span>
                </li>
              </ul>
            </div>

            <Link href="/resume" className="w-full block">
              <button className="w-full py-3.5 px-5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-sm transition-all shadow-xs hover:shadow-sm text-center flex items-center justify-center gap-2">
                Get Started Free
              </button>
            </Link>
          </div>

          {/* Pro Tier (Elevated Hero Card) */}
          <div className="relative flex flex-col justify-between p-8 sm:p-9 bg-gradient-to-b from-white via-blue-50/40 to-white/95 backdrop-blur-2xl border-2 border-blue-600 shadow-[0_20px_50px_-10px_rgba(37,99,235,0.22)] rounded-3xl ring-4 ring-blue-500/10 hover:shadow-[0_25px_60px_-10px_rgba(37,99,235,0.28)] transition-all duration-300">
            {/* Floating Popular Pill */}
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 z-10">
              <span className="inline-flex items-center gap-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full shadow-lg shadow-blue-500/30 border border-blue-400/40">
                <Sparkles className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                Most Popular
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4 mt-1">
                <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full bg-blue-100 text-blue-700 border border-blue-200/80">
                  Full Career Suite
                </span>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 font-heading mb-2 flex items-center gap-2">
                ResumeBMH Pro
                <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-blue-600 text-white tracking-wider">
                  PRO
                </span>
              </h3>
              <p className="text-sm text-slate-600 mb-6 min-h-[40px] leading-relaxed">
                For active job seekers who want unlimited tailoring, interview prep, and high response rates.
              </p>

              <div className="mb-6 pb-6 border-b border-blue-100/80">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-blue-600">₹</span>
                  <span className="text-5xl font-black text-slate-900 font-brand tracking-tight">
                    {billingCycle === "monthly" ? "499" : "2,999"}
                  </span>
                  <span className="text-sm font-semibold text-slate-500 ml-1.5">
                    {billingCycle === "monthly" ? "/ month" : "/ year"}
                  </span>
                </div>
                <div className="mt-1.5 flex items-center gap-2">
                  {billingCycle === "yearly" ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200/70">
                      Effective ₹250/mo • Save 50%
                    </span>
                  ) : (
                    <span className="text-xs text-slate-400 font-medium">Billed monthly • Cancel anytime</span>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-wider text-blue-600 mb-3.5 flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 fill-blue-600" />
                  Everything in Starter, plus:
                </p>
                <ul className="space-y-3.5 text-sm text-slate-700">
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/30">
                      <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                    </div>
                    <span className="font-semibold text-slate-900">Unlimited resumes & version snapshots</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/30">
                      <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                    </div>
                    <span className="font-medium text-slate-800">Unlimited AI bullet rewrites (Quantified Impact)</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/30">
                      <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                    </div>
                    <span className="font-medium text-slate-800">Role mock interviews with STAR feedback</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/30">
                      <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                    </div>
                    <span className="font-medium text-slate-800">Targeted AI cover letter generator</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/30">
                      <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                    </div>
                    <span className="font-medium text-slate-800">Priority AI processing & instant scans</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs shadow-blue-500/30">
                      <Check className="w-3.5 h-3.5 stroke-[3]" aria-hidden="true" />
                    </div>
                    <span className="font-medium text-slate-800">Clean PDF & recruiter-ready TXT export</span>
                  </li>
                </ul>
              </div>
            </div>

            <Link href="/pricing" className="w-full block">
              <button className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-800 text-white font-bold text-sm shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 group">
                <span>Upgrade to Pro</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </button>
            </Link>
          </div>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 font-heading mb-6 text-center">
            Detailed Feature Breakdown
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-slate-200/80 bg-white/90 backdrop-blur-xl shadow-sm">
            <table className="w-full text-left border-collapse text-base">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/80">
                  <th className="py-4 px-6 font-semibold text-slate-900">Capability</th>
                  <th className="py-4 px-6 font-semibold text-slate-700 text-center w-1/4">Free</th>
                  <th className="py-4 px-6 font-bold text-blue-600 text-center w-1/4">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {COMPARISON_FEATURES.map((feat) => (
                  <tr key={feat.name} className="hover:bg-blue-50/30 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-slate-800">{feat.name}</td>
                    <td className="py-3.5 px-6 text-center text-slate-500">
                      {typeof feat.free === "boolean" ? (
                        feat.free ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" aria-label="Included" />
                        ) : (
                          <span className="text-slate-300 font-mono">—</span>
                        )
                      ) : (
                        <span className="font-medium text-slate-600">{feat.free}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center text-blue-600 font-semibold">
                      {typeof feat.pro === "boolean" ? (
                        feat.pro ? (
                          <Check className="w-4 h-4 text-blue-600 mx-auto" aria-label="Included" />
                        ) : (
                          <span className="text-slate-300 font-mono">—</span>
                        )
                      ) : (
                        <span>{feat.pro}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-slate-500">
            <ShieldCheck className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>All payments processed securely via RBI-compliant Razorpay. Cancel anytime.</span>
          </div>
        </div>
      </Container>
    </Section>
  );
}
