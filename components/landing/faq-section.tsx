"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Container, Section, Card, SectionHeading } from "./ui/primitives";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    question: "Does Karyvo guarantee that my resume will pass ATS screening?",
    answer:
      "No, and you should be skeptical of any tool that claims to guarantee an ATS pass. Every company configures its applicant tracking system differently, and human recruiters make the actual shortlist decisions. What Karyvo guarantees is clean, single-column document structure that eliminates technical parsing errors (like dropped text from tables or multi-column layouts) and ensures your real qualifications are clearly visible.",
  },
  {
    question: "Does Karyvo invent metrics or fake achievements?",
    answer:
      "Never. We do not invent percentages, fake project scopes, or imaginary team sizes. If your draft bullet point lacks a quantifiable result, Karyvo prompts you to input your actual numbers (e.g. users served, latency reduced, revenue impacted). If you don't know the exact figure, we help you frame the scope honestly without making things up.",
  },
  {
    question: "Where is my career data stored and is it private?",
    answer:
      "Your data is stored in dedicated, private databases secured with Row-Level Security (RLS). Only your authenticated account can access your profile and resume data. We never sell your personal information to third-party recruiters or use your private career history to train public AI models.",
  },
  {
    question: "What export formats are supported?",
    answer:
      "You can export your resume as a clean, high-resolution PDF or copy the formatted plain text. Our templates are designed specifically to adhere to standard single-column ATS specifications without graphics, sidebars, or floating text boxes.",
  },
  {
    question: "How is Karyvo different from pasting my resume into ChatGPT?",
    answer:
      "General AI chatbots tend to generate verbose, robotic text with unverifiable claims and hallucinated statistics. Karyvo is built around your verified Master Career Profile, optimizing bullet points with proven action verbs, quantifiable metrics, and strict ATS formatting standards.",
  },
  {
    question: "Can college freshers or career switchers use Karyvo?",
    answer:
      "Yes. The Master Profile includes options for academic projects, semester coursework, hackathon submissions, and foundational technical skills, allowing candidates without extensive corporate tenure to highlight genuine technical problem-solving.",
  },
];

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <Section id="faq">
      <Container size="narrow">
        <SectionHeading
          badge="Honest Answers"
          title="Frequently asked questions"
          description="Straightforward answers about our philosophy, ATS realities, and data privacy."
        />

        <div className="space-y-4">
          {FAQS.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <Card
                key={faq.question}
                className="overflow-hidden transition-colors border-slate-200"
              >
                <button
                  type="button"
                  onClick={() => toggle(idx)}
                  aria-expanded={isOpen}
                  className="w-full text-left p-6 sm:p-7 flex items-center justify-between gap-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                  <span className="text-lg font-bold text-ink pr-2">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg bg-slate-100 flex items-center justify-center shrink-0 transition-transform duration-200 ${
                      isOpen ? "rotate-180 bg-accent-light text-accent" : "text-ink-subtle"
                    }`}
                  >
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-6 pb-6 sm:px-7 sm:pb-7 pt-0 text-base text-ink-muted leading-relaxed border-t border-slate-100">
                    <p className="pt-4">{faq.answer}</p>
                  </div>
                )}
              </Card>
            );
          })}
        </div>
      </Container>
    </Section>
  );
}
