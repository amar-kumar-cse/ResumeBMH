import React from "react";
import { Container, SectionHeading, Card, Badge } from "@/components/landing/ui/primitives";
import { CheckCircle2, XCircle } from "lucide-react";

export function XyzExplanationSection() {
  return (
    <div id="xyz-method" className="w-full">
      <SectionHeading
        tag="The Winning Formula"
        title="Why Recruiter-Ready Bullets Win Interviews"
        description="Recruiters spend an average of 6 seconds scanning a resume. Karyvo transforms vague duty lists into quantified, high-impact achievements that pass ATS filters."
      />

      {/* 3-Box Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
        <Card className="p-6 border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-blue-600 font-mono tracking-wider">PILLAR 01</span>
            <span className="h-2 w-2 rounded-full bg-blue-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">
            Decisive Action Verb
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            Lead with decisive power verbs (Engineered, Architected, Accelerated, Deployed) instead of passive duties like &ldquo;responsible for&rdquo;.
          </p>
        </Card>

        <Card className="p-6 border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-500 font-mono tracking-wider">PILLAR 02</span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">
            Quantified Metric
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            Back achievements with genuine numbers: percentage improvement, latency drop, revenue growth, or scale handled.
          </p>
        </Card>

        <Card className="p-6 border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-600 font-mono tracking-wider">PILLAR 03</span>
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">
            Technical Method
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            Specify the exact tooling, architecture, or engineering approach that drove the result (e.g. Next.js, Redis, PostgreSQL).
          </p>
        </Card>
      </div>

      {/* Comparison: Bad vs Good Example */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bad Example */}
        <div className="p-6 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
            <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>Weak (Generic Task List)</span>
          </div>
          <p className="text-base text-slate-800 italic font-sans">
            &ldquo;Responsible for managing website bugs and helping team members deploy code updates.&rdquo;
          </p>
          <p className="text-xs text-rose-800">
            <strong>Why recruiters pass:</strong> Passive phrasing (&ldquo;responsible for&rdquo;), zero quantified metrics, and vague technical contribution.
          </p>
        </div>

        {/* Good Example */}
        <div className="p-6 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Optimized by Karyvo</span>
          </div>
          <p className="text-base text-slate-900 font-medium font-sans">
            &ldquo;Reduced deployment failure rate by 45% by automating CI/CD unit testing pipelines in GitHub Actions.&rdquo;
          </p>
          <p className="text-xs text-emerald-800">
            <strong>Why recruiters call:</strong> Decisive business outcome (&ldquo;reduced failure rate&rdquo;), verifiable metric (&ldquo;45%&rdquo;), and concrete modern stack.
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-slate-400 mt-6 font-medium">
        ✨ Standard framework favored by hiring managers at Google, Amazon, and leading Fortune 500 tech companies.
      </p>
    </div>
  );
}
