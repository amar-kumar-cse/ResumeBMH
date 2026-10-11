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
  badgeClass: string;
  iconBgClass: string;
}

const FEATURES: Feature[] = [
  {
    title: "Master Career Profile",
    category: "Source of Truth",
    description:
      "A centralized inventory of your technical skills, work history, projects, and verified achievements. Update once, export everywhere.",
    href: "/profile",
    icon: Database,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200/70",
    iconBgClass: "from-emerald-500 to-teal-600 shadow-emerald-500/20",
  },
  {
    title: "ATS Resume Builder",
    category: "Structured Builder",
    description:
      "Build clean, single-column resumes with step-by-step guidance. Craft recruiter-verified bullets that pass applicant tracking systems flawlessly.",
    href: "/resume",
    icon: FileText,
    badgeClass: "bg-blue-50 text-blue-700 border-blue-200/70",
    iconBgClass: "from-blue-600 to-indigo-600 shadow-blue-500/20",
  },
  {
    title: "Resume Health Check",
    category: "Pre-Flight Audit",
    description:
      "Audit your document for parsing errors, unreadable multi-column layouts, missing contact data, and weak or vague bullet points.",
    href: "/ats",
    icon: ShieldAlert,
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200/70",
    iconBgClass: "from-amber-500 to-orange-600 shadow-amber-500/20",
  },
  {
    title: "AI Impact Bullet Optimizer",
    category: "Metrics & Impact",
    description:
      "Transform passive task lists into quantifiable achievements without hallucinating fake percentages or inventing job titles.",
    href: "#interactive-demo",
    icon: Sparkles,
    badgeClass: "bg-indigo-50 text-indigo-700 border-indigo-200/70",
    iconBgClass: "from-indigo-600 to-violet-600 shadow-indigo-500/20",
  },
  {
    title: "Role Mock Interview",
    category: "Interview Prep",
    description:
      "Practice technical and behavioral interview questions tailored to your target role. Receive structured feedback based on the STAR framework.",
    href: "/interview",
    icon: MessageSquareCode,
    badgeClass: "bg-violet-50 text-violet-700 border-violet-200/70",
    iconBgClass: "from-violet-600 to-purple-600 shadow-purple-500/20",
  },
  {
    title: "Targeted Cover Letter",
    category: "Application Suite",
    description:
      "Draft concise, role-specific cover letters that highlight your genuine background and reasons for applying without hollow AI buzzwords.",
    href: "/cover-letter",
    icon: Send,
    badgeClass: "bg-sky-50 text-sky-700 border-sky-200/70",
    iconBgClass: "from-sky-500 to-blue-600 shadow-sky-500/20",
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
              <div
                key={feat.title}
                className="flex flex-col justify-between p-7 rounded-3xl bg-white/90 backdrop-blur-xl border border-slate-200/80 shadow-[0_4px_20px_-4px_rgba(15,23,42,0.05)] hover:shadow-[0_16px_40px_-8px_rgba(37,99,235,0.14)] hover:-translate-y-1 hover:border-blue-300/80 transition-all duration-300 group"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <span className={`text-[11px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border ${feat.badgeClass}`}>
                      {feat.category}
                    </span>
                    <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${feat.iconBgClass} text-white flex items-center justify-center shadow-md group-hover:scale-105 transition-transform duration-300`}>
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-2.5 font-heading group-hover:text-blue-600 transition-colors">
                    {feat.title}
                  </h3>

                  <p className="text-sm text-slate-600 leading-relaxed font-sans">
                    {feat.description}
                  </p>
                </div>

                <div className="pt-5 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <Link
                    href={feat.href}
                    className="inline-flex items-center gap-1.5 text-sm font-bold text-slate-700 group-hover:text-blue-600 transition-colors"
                  >
                    <span>Explore feature</span>
                    <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
