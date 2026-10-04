import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { Container, Section, Card, Button } from "./ui/primitives";

export function CtaSection() {
  return (
    <Section background="subtle">
      <Container size="narrow">
        <Card className="p-8 sm:p-14 text-center bg-white border-slate-200 shadow-elevated relative overflow-hidden">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-light text-accent text-xs font-semibold uppercase tracking-wider mb-6">
            <Sparkles className="w-3.5 h-3.5" aria-hidden="true" />
            <span>Start Building Today</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-ink tracking-tight mb-4 leading-tight">
            Build a resume that hiring managers can verify.
          </h2>

          <p className="text-base sm:text-lg text-ink-muted max-w-xl mx-auto leading-relaxed mb-8">
            Stop relying on generic AI filler and unverifiable numbers. Structure your real career achievements into clear, high-impact bullets today.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/resume" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto justify-center">
                <span>Build Your Resume Free</span>
                <ArrowRight className="w-4 h-4 ml-1.5" aria-hidden="true" />
              </Button>
            </Link>

            <Link href="#interactive-demo" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto justify-center">
                Try the Formula Demo
              </Button>
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs sm:text-sm text-ink-subtle">
            <span>Free forever starter plan</span>
            <span aria-hidden="true">•</span>
            <span>No credit card required</span>
            <span aria-hidden="true">•</span>
            <span>Export clean ATS-friendly PDF</span>
          </div>
        </Card>
      </Container>
    </Section>
  );
}
