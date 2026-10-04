import React from "react";
import Link from "next/link";
import { ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Container, Button, Badge } from "./ui/primitives";
import { HeroBulletPreview } from "./hero-bullet-preview";

export function HeroSection() {
  return (
    <section className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Headline, Subhead, CTAs */}
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left flex flex-col items-center lg:items-start">
            <Badge variant="accent">
              <span>The XYZ Method • Popularised by Laszlo Bock</span>
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold text-ink font-heading tracking-tight leading-[1.12]">
              Write resumes hiring managers read.{" "}
              <span className="text-accent block sm:inline">
                Grounded in your real experience.
              </span>
            </h1>

            <p className="text-base sm:text-lg text-ink-muted max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Karyvo structures your career history into verified, measurable bullet points using Laszlo Bock&apos;s XYZ formula. No invented percentages. No robotic fluff.
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
                  <span>Try the formula demo ↓</span>
                </Button>
              </Link>
            </div>

            {/* Quick Proof Points */}
            <div className="pt-6 border-t border-slate-200/80 w-full grid grid-cols-3 gap-4 text-center lg:text-left">
              <div>
                <span className="block text-sm sm:text-base font-bold text-ink">Free ATS audit</span>
                <span className="text-xs text-ink-subtle">No card needed</span>
              </div>
              <div>
                <span className="block text-sm sm:text-base font-bold text-ink">Clean single-column</span>
                <span className="text-xs text-ink-subtle">ATS parseable PDF</span>
              </div>
              <div>
                <span className="block text-sm sm:text-base font-bold text-ink">Private & secure</span>
                <span className="text-xs text-ink-subtle">Your data stays yours</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Product Preview (Before/After XYZ transformation) */}
          <div className="lg:col-span-6 flex justify-center w-full">
            <HeroBulletPreview />
          </div>
        </div>
      </Container>
    </section>
  );
}
