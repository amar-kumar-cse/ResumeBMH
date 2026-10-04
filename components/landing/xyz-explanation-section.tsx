import React from "react";
import { Container, SectionHeading, Card, Badge } from "@/components/landing/ui/primitives";
import { CheckCircle2, XCircle } from "lucide-react";

export function XyzExplanationSection() {
  return (
    <div id="how-it-works" className="w-full">
      <SectionHeading
        tag="Core Framework"
        title="What is the XYZ Method?"
        description="The simplest way to prove your impact to recruiters: describe what you accomplished (X), how it was measured (Y), and the exact steps you took (Z)."
      />

      {/* 3-Box Visual */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
        <Card className="p-6 border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 font-mono">STEP 01</span>
            <span className="h-2 w-2 rounded-full bg-slate-900" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">
            Accomplished [X]
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            Start with a decisive action verb. State the concrete outcome or capability you delivered, not your passive job responsibilities.
          </p>
        </Card>

        <Card className="p-6 border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 font-mono">STEP 02</span>
            <span className="h-2 w-2 rounded-full bg-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">
            Measured by [Y]
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            Add your genuine numbers: percentage improvement, latency drop, request scale, or time saved. Never guess or fabricate metrics.
          </p>
        </Card>

        <Card className="p-6 border-slate-200 bg-white space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 font-mono">STEP 03</span>
            <span className="h-2 w-2 rounded-full bg-emerald-600" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 font-heading">
            By Doing [Z]
          </h3>
          <p className="text-sm text-slate-600 leading-relaxed font-sans">
            Explain the exact method, tooling, or engineering decision that caused the result (e.g. Redis caching, indexes, or refactoring).
          </p>
        </Card>
      </div>

      {/* Comparison: Bad vs Good Example */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bad Example */}
        <div className="p-6 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-rose-700">
            <XCircle className="h-4 w-4 text-rose-600 shrink-0" />
            <span>Weak Example (Common Mistake)</span>
          </div>
          <p className="text-base text-slate-800 italic font-sans">
            &ldquo;Responsible for managing website bugs and helping team members deploy code updates.&rdquo;
          </p>
          <p className="text-xs text-rose-800">
            <strong>Why it fails:</strong> Uses passive phrasing (&ldquo;responsible for&rdquo;), includes zero numbers, and does not show your specific technical contribution.
          </p>
        </div>

        {/* Good Example */}
        <div className="p-6 rounded-xl border border-emerald-200 bg-emerald-50/40 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-emerald-800">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>Strong XYZ Example</span>
          </div>
          <p className="text-base text-slate-900 font-medium font-sans">
            &ldquo;Reduced deployment failure rate by 45% by automating CI/CD unit testing pipelines in GitHub Actions.&rdquo;
          </p>
          <p className="text-xs text-emerald-800">
            <strong>Why it wins:</strong> Direct outcome (&ldquo;reduced failure rate&rdquo;), verifiable metric (&ldquo;45%&rdquo;), and concrete technique (&ldquo;automating CI/CD pipelines&rdquo;).
          </p>
        </div>
      </div>

      <p className="text-center text-xs text-slate-500 mt-6">
        Note: The XYZ formula was popularised by Laszlo Bock, former Google Senior Vice President of People Operations. No corporate endorsement implied.
      </p>
    </div>
  );
}
