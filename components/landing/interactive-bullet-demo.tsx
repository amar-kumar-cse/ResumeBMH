"use client";

import { useState } from "react";
import Link from "next/link";
import { Sparkles, Zap, Check, Copy, AlertCircle } from "lucide-react";
import { GlassCard, GlassButton } from "@/components/ui/glass";

interface PresetExample {
  role: string;
  before: string;
  context: string;
  precomputed: {
    rewritten: string;
    result: string;
    metric: string | null;
    method: string;
    needsMetric: boolean;
    question: string | null;
  };
}

const PRESETS: PresetExample[] = [
  {
    role: "Backend SDE",
    before: "Built payment API and handled database queries",
    context: "SDE-1 at FinTech startup using Go, Kafka, PostgreSQL",
    precomputed: {
      rewritten:
        "Architected payment processing API and optimized database queries, achieving [add your number] latency reduction by introducing connection pooling.",
      result: "Architected payment processing API and optimized queries",
      metric: null,
      method: "Introducing connection pooling",
      needsMetric: true,
      question: "By how much did it improve? Add your real number.",
    },
  },
  {
    role: "Frontend Dev",
    before: "Made dashboard UI screens in React and fixed bugs",
    context: "Frontend engineer building SaaS analytics in Next.js & Tailwind",
    precomputed: {
      rewritten:
        "Engineered responsive dashboard interfaces in React and resolved critical rendering defects, improving load times by [add your number] through component code-splitting.",
      result: "Engineered responsive dashboard interfaces in React",
      metric: null,
      method: "Component code-splitting",
      needsMetric: true,
      question: "By how much did it improve? Add your real number.",
    },
  },
  {
    role: "Campus Fresher",
    before: "Completed final year college project using machine learning",
    context: "B.Tech CSE final year, Python, TensorFlow, Flask API",
    precomputed: {
      rewritten:
        "Delivered machine learning classification pipeline for academic capstone, reaching [add your number] validation accuracy by tuning hyperparameters in PyTorch.",
      result: "Delivered machine learning classification pipeline for academic capstone",
      metric: null,
      method: "Tuning hyperparameters in PyTorch",
      needsMetric: true,
      question: "By how much did it improve? Add your real number.",
    },
  },
];

export function InteractiveBulletDemo() {
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [inputBullet, setInputBullet] = useState<string>(PRESETS[0].before);
  const [contextText, setContextText] = useState<string>(PRESETS[0].context);
  
  const [outputData, setOutputData] = useState(PRESETS[0].precomputed);
  const [userCustomNumber, setUserCustomNumber] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);

  const handleSelectPreset = (idx: number) => {
    setSelectedPreset(idx);
    setInputBullet(PRESETS[idx].before);
    setContextText(PRESETS[idx].context);
    setOutputData(PRESETS[idx].precomputed);
    setUserCustomNumber("");
    setErrorMsg(null);
  };

  const handleTransform = async () => {
    const trimmed = inputBullet.trim();
    if (!trimmed) return;

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/demo/improve-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet: trimmed }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        if (res.status === 429) {
          setErrorMsg(data.error || "Rate limit reached. Please wait a moment or sign up free.");
        } else {
          setErrorMsg(data.error || "Failed to transform bullet. Please check your text.");
        }
        return;
      }

      if (data.data) {
        setOutputData(data.data);
        setUserCustomNumber("");
      }
    } catch {
      setErrorMsg("Network connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Replace placeholder with user-provided metric if typed
  const displayRewritten =
    outputData.needsMetric && userCustomNumber.trim()
      ? outputData.rewritten.replace("[add your number]", userCustomNumber.trim())
      : outputData.rewritten;

  const handleCopy = () => {
    navigator.clipboard.writeText(displayRewritten);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div id="interactive-demo" className="w-full max-w-4xl mx-auto scroll-mt-24">
      <GlassCard variant="interactive" className="p-7 sm:p-9 rounded-2xl space-y-7 shadow-[0_20px_50px_-10px_rgba(30,58,138,0.1)]">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/70 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-semibold text-blue-600">
                Interactive Live Demo
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 font-heading tracking-tight mt-1">
              AI Action Bullet Optimizer
            </h3>
            <p className="text-sm text-slate-600 mt-0.5">
              Transform simple job tasks into quantified, results-driven achievements that impress hiring managers.
            </p>
          </div>

          {/* Presets */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/80 border border-slate-200/80 backdrop-blur-sm self-start sm:self-auto shadow-xs">
            {PRESETS.map((p, idx) => (
              <button
                key={p.role}
                suppressHydrationWarning
                onClick={() => handleSelectPreset(idx)}
                className={`h-9 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all inline-flex items-center justify-center cursor-pointer ${
                  selectedPreset === idx
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-sm shadow-blue-500/25"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                {p.role}
              </button>
            ))}
          </div>
        </div>

        {/* Error notification if any */}
        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 flex items-center gap-2.5 text-xs text-rose-700">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Interactive Comparison Box */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
          {/* Input: Average Weak Bullet */}
          <div className="p-5 sm:p-6 rounded-xl bg-white/85 border border-slate-200/80 shadow-sm flex flex-col justify-between min-h-[250px] backdrop-blur-md">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-rose-600 flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-rose-500" />
                  Your Bullet
                </span>
                <span className="text-xs text-slate-500 font-medium">Example</span>
              </div>
              <textarea
                suppressHydrationWarning
                value={inputBullet}
                onChange={(e) => setInputBullet(e.target.value)}
                maxLength={300}
                rows={3}
                className="w-full bg-transparent text-xs sm:text-sm text-slate-900 placeholder-slate-400 resize-none outline-none focus:ring-0 leading-relaxed font-sans"
                placeholder="Type any ordinary resume bullet here..."
              />
            </div>

            <div className="pt-4 mt-auto border-t border-slate-100 flex items-center justify-between gap-3 h-12">
              <span className="text-xs text-slate-400 font-mono">
                {inputBullet.length}/300
              </span>
              <button
                type="button"
                suppressHydrationWarning
                onClick={handleTransform}
                disabled={isLoading || !inputBullet.trim()}
                className="h-9 px-4 text-xs font-semibold rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 active:scale-[0.98] active:duration-75 disabled:opacity-50 disabled:cursor-not-allowed transition-[transform,background-color,box-shadow,opacity] duration-150 ease-out inline-flex items-center gap-2 text-white shadow-md shadow-blue-500/25 cursor-pointer touch-manipulation"
              >
                {isLoading ? (
                  <span className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Zap className="h-3.5 w-3.5 text-amber-300" />
                    <span>Optimize</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Output: AI Impact Optimized Bullet */}
          <div className="p-5 sm:p-6 rounded-xl bg-blue-50/70 border border-blue-200/70 flex flex-col justify-between min-h-[250px] shadow-sm backdrop-blur-md">
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-blue-600" />
                  High-Impact Transformation
                </span>
                <span className="text-xs text-ink-subtle font-medium bg-white px-2 py-0.5 rounded-md border border-slate-200">
                  Example
                </span>
              </div>

              {/* Rewritten Bullet Text with highlighted placeholder if needed */}
              <div className="text-xs sm:text-sm text-slate-900 font-medium leading-relaxed">
                {outputData.needsMetric && !userCustomNumber.trim() ? (
                  <>
                    {displayRewritten.split("[add your number]").map((part, i, arr) => (
                      <span key={i}>
                        {part}
                        {i < arr.length - 1 && (
                          <span className="inline-block px-1.5 py-0.5 mx-0.5 rounded bg-amber-200 text-amber-900 font-bold border border-amber-300">
                            [add your number]
                          </span>
                        )}
                      </span>
                    ))}
                  </>
                ) : (
                  <span>{displayRewritten}</span>
                )}
              </div>

              {/* Real Number Input when needsMetric is true */}
              {outputData.needsMetric && (
                <div className="mt-3 p-2.5 rounded-lg bg-white border border-amber-200 space-y-1.5">
                  <label htmlFor="user-real-number" className="block text-xs font-bold text-amber-800">
                    {outputData.question || "By how much did it improve? Add your real number:"}
                  </label>
                  <input
                    id="user-real-number"
                    type="text"
                    suppressHydrationWarning
                    value={userCustomNumber}
                    onChange={(e) => setUserCustomNumber(e.target.value)}
                    placeholder="e.g. 35%, 10k users, 2.5x, ₹15L"
                    maxLength={50}
                    className="w-full text-xs px-2.5 py-1.5 rounded border border-slate-200 focus:outline-none focus:ring-1 focus:ring-amber-500 bg-amber-50/30 text-slate-900"
                  />
                </div>
              )}
            </div>

            <div className="pt-4 mt-auto border-t border-indigo-200/60 flex items-center justify-between gap-3 h-12">
              {/* Honest Legend */}
              <div className="flex items-center gap-2.5 text-xs text-slate-600" aria-label="Bullet impact breakdown">
                <span className="flex items-center gap-1 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-600" aria-hidden="true" />
                  Result
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500" aria-hidden="true" />
                  Number
                </span>
                <span className="flex items-center gap-1 font-medium">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" aria-hidden="true" />
                  How
                </span>
              </div>

              <button
                onClick={handleCopy}
                type="button"
                suppressHydrationWarning
                aria-label={copied ? "Copied to clipboard" : "Copy transformed bullet to clipboard"}
                className="h-9 inline-flex items-center gap-1.5 px-3.5 rounded-lg text-xs font-semibold bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 border border-indigo-200 shadow-sm transition-[transform,background-color,border-color,box-shadow,color] duration-150 ease-out active:scale-[0.98] active:duration-75 touch-manipulation cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" aria-hidden="true" />
                    <span className="text-emerald-600">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-slate-500" aria-hidden="true" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Footer callout under demo */}
        <p className="text-center text-xs text-slate-600 pt-1">
          Sign up free to save bullets and improve your whole resume.{" "}
          <Link href="/signup" className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2">
            Create free account
          </Link>
        </p>
      </GlassCard>
    </div>
  );
}
