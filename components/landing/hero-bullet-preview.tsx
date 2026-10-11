"use client";

import React from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { Card, Badge } from "@/components/landing/ui/primitives";

export function HeroBulletPreview() {
  return (
    <div className="w-full max-w-[500px] mx-auto select-none">
      <Card className="p-6 sm:p-8 space-y-6 shadow-md border-slate-200/90 relative overflow-hidden bg-white">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-900 font-heading">
              Quantified Impact in Action
            </span>
          </div>
          <Badge variant="neutral" className="text-xs">
            Real Example
          </Badge>
        </div>

        {/* Before Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-rose-600 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
              Before: Weak & Passive
            </span>
            <span className="text-slate-400">Gets overlooked by recruiters</span>
          </div>
          <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/70 text-sm text-slate-700 leading-relaxed font-sans">
            &ldquo;Built payment API and handled database queries for users.&rdquo;
          </div>
        </div>

        {/* Transition indicator */}
        <div className="flex items-center justify-center -my-2 text-slate-400">
          <div className="h-7 w-7 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center text-[#1e3a8a]">
            <Sparkles className="h-3.5 w-3.5" />
          </div>
        </div>

        {/* After Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold uppercase tracking-wider text-[#1e3a8a] flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1e3a8a]" />
              After: High-Impact Optimized
            </span>
            <span className="text-emerald-700 font-medium">Clear & verifiable</span>
          </div>
          <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-200/70 space-y-2">
            <p className="text-sm sm:text-base text-slate-900 leading-relaxed font-sans">
              <span className="font-semibold text-slate-900 bg-white px-1.5 py-0.5 rounded border border-slate-200 shadow-2xs">
                Architected distributed payment routing API
              </span>
              {", handling "}
              <span className="inline-block px-2 py-0.5 rounded bg-amber-100 text-amber-900 font-bold border border-amber-300 text-xs sm:text-sm">
                [add your number]
              </span>
              {" daily requests, by "}
              <span className="text-emerald-800 font-medium bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                implementing Go microservices and Redis connection pooling.
              </span>
            </p>
          </div>
        </div>

        {/* Breakdown Legend */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
          <span className="font-medium text-slate-500">Method Breakdown:</span>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-slate-900" />
              <strong className="text-slate-800">Result (X)</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              <strong className="text-slate-800">Number (Y)</strong>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-600" />
              <strong className="text-slate-800">How (Z)</strong>
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
