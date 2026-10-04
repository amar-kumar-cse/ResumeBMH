"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Check, ShieldCheck, ArrowRight } from "lucide-react";
import { Container, Section, Card, Button, SectionHeading, Badge } from "./ui/primitives";

interface PlanFeature {
  name: string;
  free: string | boolean;
  pro: string | boolean;
}

const COMPARISON_FEATURES: PlanFeature[] = [
  { name: "Master Career Profile", free: true, pro: true },
  { name: "Single-column ATS templates", free: true, pro: true },
  { name: "Resume Health Check", free: true, pro: true },
  { name: "XYZ Bullet optimizations", free: "3 / day", pro: "Unlimited" },
  { name: "Active Resumes stored", free: "1 resume", pro: "Unlimited" },
  { name: "Role-specific mock interviews", free: false, pro: "Unlimited practice" },
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

        {/* Billing cycle toggle */}
        <div className="flex justify-center mb-10">
          <div
            role="radiogroup"
            aria-label="Billing frequency"
            className="inline-flex items-center p-1 rounded-full bg-slate-200/70 border border-slate-300/60"
          >
            <button
              type="button"
              role="radio"
              aria-checked={billingCycle === "monthly"}
              onClick={() => setBillingCycle("monthly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all ${
                billingCycle === "monthly"
                  ? "bg-white text-ink shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={billingCycle === "yearly"}
              onClick={() => setBillingCycle("yearly")}
              className={`px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5 ${
                billingCycle === "yearly"
                  ? "bg-accent text-white shadow-sm"
                  : "text-ink-muted hover:text-ink"
              }`}
            >
              <span>Annual</span>
              <span className="text-xs px-1.5 py-0.5 rounded bg-white/20 text-white font-medium">
                Save 50%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16 items-stretch">
          {/* Free Tier */}
          <Card className="flex flex-col justify-between p-8 bg-white/85 backdrop-blur-xl border border-white/85 shadow-[0_10px_30px_-5px_rgba(30,58,138,0.06)] rounded-2xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="neutral">Free Forever</Badge>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 font-heading mb-2">Starter</h3>
              <p className="text-base text-slate-600 mb-6">
                Core tools for students, freshers, and individual job applications.
              </p>

              <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-slate-100">
                <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                <span className="text-base text-slate-500">free forever</span>
              </div>

              <ul className="space-y-3 text-base text-slate-600 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Master Career Profile</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>1 active resume with live preview</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Single-column ATS templates</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Resume Health Check scan</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>3 XYZ bullet improvements / day</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Clean PDF & plain text export</span>
                </li>
              </ul>
            </div>

            <Link href="/resume" className="w-full">
              <Button variant="secondary" className="w-full justify-center">
                Get Started Free
              </Button>
            </Link>
          </Card>

          {/* Pro Tier */}
          <Card className="flex flex-col justify-between p-8 bg-gradient-to-b from-white/95 via-blue-50/40 to-white/95 backdrop-blur-xl border-2 border-blue-500/80 shadow-[0_20px_50px_-10px_rgba(37,99,235,0.18)] relative rounded-2xl">
            <div className="absolute -top-3.5 right-6">
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 text-white text-xs font-bold uppercase tracking-wider px-3.5 py-1 rounded-full shadow-md shadow-blue-500/30">
                Most Popular
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <Badge variant="accent">Full Career Suite</Badge>
              </div>

              <h3 className="text-2xl font-bold text-slate-900 font-heading mb-2">Karyvo Pro</h3>
              <p className="text-base text-slate-600 mb-6">
                For active job seekers who want unlimited tailoring and interview prep.
              </p>

              <div className="flex items-baseline gap-2 mb-6 pb-6 border-b border-slate-100">
                <span className="text-4xl font-extrabold text-blue-600">
                  {billingCycle === "monthly" ? "₹499" : "₹2,999"}
                </span>
                <span className="text-base text-slate-500">
                  {billingCycle === "monthly" ? "/ month" : "/ year (₹250/mo)"}
                </span>
              </div>

              <ul className="space-y-3 text-base text-slate-600 mb-8">
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span className="font-semibold text-slate-900">Everything in Free, plus:</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Unlimited resumes & versions</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Unlimited XYZ bullet rewrites</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Role mock interviews with STAR feedback</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Targeted cover letter builder</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <Check className="w-5 h-5 text-emerald-600 shrink-0" aria-hidden="true" />
                  <span>Priority server processing</span>
                </li>
              </ul>
            </div>

            <Link href="/pricing" className="w-full">
              <Button variant="primary" className="w-full justify-center">
                <span>Upgrade to Pro</span>
                <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
              </Button>
            </Link>
          </Card>
        </div>

        {/* Feature Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-bold text-slate-900 font-heading mb-6 text-center">
            Detailed Feature Breakdown
          </h3>

          <div className="overflow-x-auto rounded-2xl border border-white/80 bg-white/85 backdrop-blur-xl shadow-card">
            <table className="w-full text-left border-collapse text-base">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70">
                  <th className="py-4 px-6 font-semibold text-ink">Capability</th>
                  <th className="py-4 px-6 font-semibold text-ink text-center w-1/4">Free</th>
                  <th className="py-4 px-6 font-semibold text-accent text-center w-1/4">Pro</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {COMPARISON_FEATURES.map((feat) => (
                  <tr key={feat.name} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3.5 px-6 font-medium text-ink">{feat.name}</td>
                    <td className="py-3.5 px-6 text-center text-ink-muted">
                      {typeof feat.free === "boolean" ? (
                        feat.free ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" aria-label="Included" />
                        ) : (
                          <span className="text-slate-300 font-mono">—</span>
                        )
                      ) : (
                        <span className="font-medium text-ink-muted">{feat.free}</span>
                      )}
                    </td>
                    <td className="py-3.5 px-6 text-center text-accent font-semibold">
                      {typeof feat.pro === "boolean" ? (
                        feat.pro ? (
                          <Check className="w-4 h-4 text-accent mx-auto" aria-label="Included" />
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

          <div className="mt-6 flex items-center justify-center gap-2 text-sm text-ink-subtle">
            <ShieldCheck className="w-4 h-4 text-slate-500" aria-hidden="true" />
            <span>All payments processed securely via RBI-compliant Razorpay. Cancel anytime.</span>
          </div>
        </div>
      </Container>
    </Section>
  );
}
