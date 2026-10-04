import React from "react";
import Link from "next/link";
import {
  Database,
  FileText,
  ShieldAlert,
  Sparkles,
  MessageSquareCode,
  Send,
  ArrowUpRight,
} from "lucide-react";
import { Container, Section, Card, SectionHeading } from "./ui/primitives";

interface Feature {
  title: string;
  category: string;
  description: string;
  href: string;
  icon: React.ElementType;
}

const FEATURES: Feature[] = [
  {
    title: "Master Career Profile",
    category: "Source of Truth",
    description:
      "A centralized inventory of your technical skills, work history, academic projects, and verified outcomes. Update once, use everywhere.",
    href: "/profile",
    icon: Database,
  },
  {
    title: "XYZ Resume Builder",
    category: "Structured Authoring",
    description:
      "Build clean, single-column resumes with step-by-step guidance. Write measurable bullets that directly show your technical contribution.",
    href: "/resume",
    icon: FileText,
  },
  {
    title: "Resume Health Check",
    category: "Pre-flight Audit",
    description:
      "Audit your document for parsing errors, unreadable multi-column layouts, missing contact data, and weak or vague bullet points.",
    href: "/ats",
    icon: ShieldAlert,
  },
  {
    title: "XYZ Bullet Optimizer",
    category: "Clarity & Impact",
    description:
      "Transform passive task lists into quantifiable achievements without hallucinating fake percentages or inventing job titles.",
    href: "#interactive-demo",
    icon: Sparkles,
  },
  {
    title: "Role Mock Interview",
    category: "Preparation",
    description:
      "Practice technical and behavioral interview questions tailored to your target role. Receive structured feedback based on the STAR framework.",
    href: "/interview",
    icon: MessageSquareCode,
  },
  {
    title: "Targeted Cover Letter",
    category: "Application Suite",
    description:
      "Draft concise, role-specific cover letters that highlight your genuine background and reasons for applying without hollow AI buzzwords.",
    href: "/cover-letter",
    icon: Send,
  },
];

export function FeaturesGridSection() {
  return (
    <Section id="features">
      <Container>
        <SectionHeading
          badge="Product Capabilities"
          title="Everything you need to apply with confidence"
          description="Six integrated tools designed to help engineers and job seekers present their real qualifications clearly."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feat) => {
            const Icon = feat.icon;
            return (
              <Card
                key={feat.title}
                hoverable
                className="flex flex-col justify-between p-6 sm:p-7 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold uppercase tracking-wider text-accent bg-accent-light px-2.5 py-1 rounded-md">
                      {feat.category}
                    </span>
                    <div className="w-9 h-9 rounded-lg bg-slate-50 text-slate-700 flex items-center justify-center border border-slate-200/80 group-hover:border-accent group-hover:text-accent transition-colors">
                      <Icon className="w-4 h-4" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-ink mb-2 group-hover:text-accent transition-colors flex items-center gap-1.5">
                    <span>{feat.title}</span>
                  </h3>

                  <p className="text-base text-ink-muted leading-relaxed">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-5 mt-4 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={feat.href}
                    className="inline-flex items-center gap-1.5 text-sm font-semibold text-accent hover:text-accent-hover transition-colors"
                  >
                    <span>Explore feature</span>
                    <ArrowUpRight className="w-4 h-4" aria-hidden="true" />
                  </Link>
                </div>
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
