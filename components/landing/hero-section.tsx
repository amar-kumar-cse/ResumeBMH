import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container, Button, Badge } from "./ui/primitives";
import { Hero3DResumeCard } from "./hero-3d-card";

export function HeroSection() {
  return (
    <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Subhead, CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 border border-blue-200/80 text-blue-700 shadow-sm text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              <span>ATS-Optimized • Recruiter-Approved AI</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-slate-900 font-heading tracking-tight leading-[1.12]">
              Write resumes hiring managers read.{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent block sm:inline">
                Grounded in your real experience.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Karyvo structures your real career achievements into high-impact, quantified bullet points. Beat ATS filters, land top interviews, and build resumes that recruiters actually read.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2 w-full sm:w-auto">
              <Link href="/resume" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto justify-center">
                  <span>Build your resume free</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
                </Button>
              </Link>

              <Link href="#interactive-demo" className="w-full sm:w-auto">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
                  <span>Try the live demo ↓</span>
                </Button>
              </Link>
            </div>

            {/* Quick Proof Points */}
            <div className="pt-6 border-t border-slate-200/80 w-full grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <span className="block text-sm sm:text-base font-bold text-slate-900 font-heading">Free ATS audit</span>
                <span className="text-xs text-slate-500">No card needed</span>
              </div>
              <div>
                <span className="block text-sm sm:text-base font-bold text-slate-900 font-heading">Clean single-column</span>
                <span className="text-xs text-slate-500">ATS parseable PDF</span>
              </div>
              <div>
                <span className="block text-sm sm:text-base font-bold text-slate-900 font-heading">Private & secure</span>
                <span className="text-xs text-slate-500">Your data stays yours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero 3D Interactive Rotating Resume Card */}
          <div className="lg:col-span-6 flex justify-center w-full z-10">
            <Hero3DResumeCard />
          </div>
        </div>
      </Container>
    </section>
  );
}
