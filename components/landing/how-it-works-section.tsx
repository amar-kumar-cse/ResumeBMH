import React from "react";
import Link from "next/link";
import { ArrowRight, UserCheck, Wand2, FileCheck2 } from "lucide-react";
import { Container, Section, Card, SectionHeading } from "./ui/primitives";

interface Step {
  number: string;
  title: string;
  description: string;
  detail: string;
  icon: React.ElementType;
}

const STEPS: Step[] = [
  {
    number: "01",
    title: "Build your Master Profile once",
    description:
      "Save your work history, projects, tech stack, and real outcomes in one place. No need to retype your career details for every application.",
    detail: "Supports fresher projects, academic coursework, tech stacks, and full-time engineering roles.",
    icon: UserCheck,
  },
  {
    number: "02",
    title: "Generate targeted materials",
    description:
      "Select a target role or paste a job description. Karyvo pulls relevant achievements from your profile and formats them with quantifiable impact.",
    detail: "Every bullet is framed around measurable impact without hallucinating fake percentages.",
    icon: Wand2,
  },
  {
    number: "03",
    title: "Check health and export",
    description:
      "Run the ATS health audit to verify clean parsing, keyword alignment, and single-column formatting before downloading as PDF or DOCX.",
    detail: "Clean single-column documents that human recruiters and automated parsers read accurately.",
    icon: FileCheck2,
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how-it-works" background="subtle">
      <Container>
        <SectionHeading
          badge="Three-Step Workflow"
          title="From scattered notes to an interview-ready resume"
          description="A systematic process designed to eliminate repetitive resume editing while ensuring your real experience stands out."
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <Card key={step.number} className="flex flex-col justify-between p-6 sm:p-8">
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-2xl font-bold text-accent">
                      {step.number}
                    </span>
                    <div className="w-10 h-10 rounded-xl bg-accent-light text-accent flex items-center justify-center border border-accent-border/40">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-ink mb-3 tracking-tight">
                    {step.title}
                  </h3>

                  <p className="text-base text-ink-muted leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 text-sm text-ink-subtle">
                  {step.detail}
                </div>
              </Card>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link
            href="/resume"
            className="inline-flex items-center gap-2 text-base font-semibold text-accent hover:text-accent-hover transition-colors"
          >
            <span>Start building your Master Profile</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </Link>
        </div>
      </Container>
    </Section>
  );
}
