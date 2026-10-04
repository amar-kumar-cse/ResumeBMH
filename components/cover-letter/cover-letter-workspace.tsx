"use client";

import { useState } from "react";
import { CoverLetter, CoverLetterTone } from "@/types/cover-letter";
import {
  Card,
  Panel,
  Button,
  Badge,
  Input,
  PageHeader,
  EmptyState,
} from "@/components/ui/primitives";
import {
  Send,
  Sparkles,
  Copy,
  Check,
  Building,
  Briefcase,
  Sliders,
  Printer,
  FileText,
  RotateCcw,
} from "lucide-react";

interface Props {
  initialLetters: CoverLetter[];
}

export function CoverLetterWorkspace({ initialLetters }: Props) {
  const [companyName, setCompanyName] = useState("Google India");
  const [targetRole, setTargetRole] = useState("Software Development Engineer (SDE-1)");
  const [tone, setTone] = useState<CoverLetterTone>("Confident & High-Impact");
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentLetter, setCurrentLetter] = useState<CoverLetter | null>(
    initialLetters.length > 0 ? initialLetters[0] : null
  );
  const [copied, setCopied] = useState(false);
  const [lettersList, setLettersList] = useState<CoverLetter[]>(initialLetters);

  const handleGenerate = async () => {
    if (!companyName.trim() || !targetRole.trim()) return;
    setIsGenerating(true);
    try {
      const res = await fetch("/api/cover-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          companyName,
          targetRole,
          tone,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCurrentLetter(data.data);
        setLettersList([data.data, ...lettersList]);
      }
    } catch (err) {
      console.error("Cover letter error:", err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!currentLetter?.content) return;
    navigator.clipboard.writeText(currentLetter.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <PageHeader
        title="Role Cover Letter AI"
        description="Generate tailored, persuasive cover letters grounded in your Master Career Profile with zero fluff."
        badge={
          <Badge variant="brand" size="sm">
            <Send className="h-3.5 w-3.5 mr-1" />
            Company + Role Tailored
          </Badge>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Form: Inputs */}
        <div className="lg:col-span-5 space-y-6 no-print">
          <Panel title="Target Opportunity" subtitle="Specify company, role title, and desired tone.">
            <div className="space-y-4">
              <div>
                <label htmlFor="target-company" className="text-sm font-medium text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <Building className="h-4 w-4 text-brand-primary" /> Target Company Name
                </label>
                <Input
                  id="target-company"
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Razorpay, Google, Swiggy"
                />
              </div>

              <div>
                <label htmlFor="target-role" className="text-sm font-medium text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <Briefcase className="h-4 w-4 text-brand-primary" /> Target Role Title
                </label>
                <Input
                  id="target-role"
                  type="text"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                  placeholder="e.g. Senior Backend Engineer"
                />
              </div>

              <div>
                <label htmlFor="target-tone" className="text-sm font-medium text-slate-700 block mb-1.5 flex items-center gap-1.5">
                  <Sliders className="h-4 w-4 text-amber-500" /> Communication Tone
                </label>
                <select
                  id="target-tone"
                  value={tone}
                  onChange={(e) => setTone(e.target.value as CoverLetterTone)}
                  className="w-full bg-white border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-2xs"
                >
                  <option value="Professional & Polished">Professional & Polished (Corporate & Enterprise)</option>
                  <option value="Confident & High-Impact">Confident & High-Impact (High-Growth Startups)</option>
                  <option value="Modern & Creative">Modern & Creative (Product & Design Focus)</option>
                  <option value="Enthusiastic Fresher">Enthusiastic Fresher (Campus & Graduate Drives)</option>
                </select>
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleGenerate}
                disabled={isGenerating || !companyName.trim() || !targetRole.trim()}
                className="w-full mt-2"
              >
                {isGenerating ? (
                  <>
                    <span className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full" />
                    <span>Synthesizing Cover Letter...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Generate Tailored Cover Letter</span>
                  </>
                )}
              </Button>
            </div>
          </Panel>

          {/* Saved Letters History */}
          {lettersList.length > 0 && (
            <Card className="p-5 space-y-3">
              <span className="text-sm font-bold text-slate-900 block font-heading">
                Saved Cover Letters
              </span>
              <div className="space-y-2 max-h-[260px] overflow-y-auto">
                {lettersList.map((letItem) => (
                  <button
                    key={letItem.id}
                    onClick={() => setCurrentLetter(letItem)}
                    className={`w-full text-left p-3 rounded-lg border transition-all text-xs ${
                      currentLetter?.id === letItem.id
                        ? "bg-indigo-50 border-brand-primary text-brand-primary shadow-xs"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div className="font-bold text-slate-900 font-heading text-sm">{letItem.companyName}</div>
                    <div className="text-xs text-slate-600 font-medium mt-0.5">{letItem.targetRole} • {letItem.tone}</div>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>

        {/* Right Preview */}
        <div className="lg:col-span-7">
          {currentLetter ? (
            <Card className="p-6 sm:p-8 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 font-heading">{currentLetter.companyName}</h2>
                  <span className="text-xs text-brand-primary font-semibold">{currentLetter.targetRole}</span>
                </div>
                <div className="flex flex-wrap items-center gap-2 no-print">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleGenerate}
                    title="Regenerate with fresh phrasing"
                  >
                    <RotateCcw className="h-4 w-4" />
                    <span className="hidden sm:inline">Regenerate</span>
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                    <span>{copied ? "Copied!" : "Copy"}</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.print()}
                  >
                    <Printer className="h-4 w-4 text-slate-600" />
                    <span>Print PDF</span>
                  </Button>
                </div>
              </div>

              <div className="p-6 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-sm whitespace-pre-line leading-relaxed font-sans select-text">
                {currentLetter.content}
              </div>
            </Card>
          ) : (
            <EmptyState
              title="No Cover Letter Generated Yet"
              description="Fill in the target Company Name and Role on the left to generate an authentic, customized cover letter."
              icon={<FileText className="h-10 w-10 text-slate-400" />}
            />
          )}
        </div>
      </div>
    </div>
  );
}
