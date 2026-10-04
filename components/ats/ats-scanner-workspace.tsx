"use client";

import { useState, useRef, ChangeEvent, DragEvent } from "react";
import { ATSScanResult } from "@/types/ats";
import {
  Card,
  Panel,
  Button,
  Badge,
  Input,
} from "@/components/ui/primitives";
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  FileText,
  Sparkles,
  Zap,
  Check,
  SlidersHorizontal,
  UploadCloud,
  Image as ImageIcon,
  FileCheck,
  X,
  Eye,
  EyeOff,
  Copy,
  Briefcase,
  HelpCircle,
} from "lucide-react";
import Link from "next/link";

interface Props {
  initialScans: ATSScanResult[];
  sampleResumeText?: string;
}

export function ATSScannerWorkspace({ initialScans, sampleResumeText }: Props) {
  const [activeTab, setActiveTab] = useState<"ats-audit" | "tailoring-studio">("ats-audit");
  const [inputMode, setInputMode] = useState<"upload" | "text">("upload");

  // File Upload states
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Resume text states
  const [resumeText, setResumeText] = useState(sampleResumeText || "");
  const [resumeName, setResumeName] = useState(
    initialScans.length > 0 ? initialScans[0].resumeName : "Arjun_Sharma_Resume.pdf"
  );

  // Scanning & Result states
  const [isScanning, setIsScanning] = useState(false);
  const [scanStep, setScanStep] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showExtractedText, setShowExtractedText] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const [currentResult, setCurrentResult] = useState<ATSScanResult | null>(
    initialScans.length > 0 ? initialScans[0] : null
  );

  // Tailoring Studio states
  const [tailorRole, setTailorRole] = useState(
    currentResult?.detectedRole || "Senior Full-Stack Engineer"
  );
  const [tailorApproved, setTailorApproved] = useState<{ [key: string]: boolean }>({
    s1: true,
    s2: false,
    s3: true,
  });
  const [versionSaved, setVersionSaved] = useState(false);

  // Helper to format file sizes
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  // Drag & drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    setUploadError(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFileSelection(file);
    }
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUploadError(null);
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleFileSelection = (file: File) => {
    const validExtensions = [".pdf", ".png", ".jpg", ".jpeg", ".webp", ".txt", ".md"];
    const ext = "." + file.name.split(".").pop()?.toLowerCase();

    if (!validExtensions.includes(ext) && !file.type.startsWith("image/") && file.type !== "application/pdf") {
      setUploadError("Please upload a PDF (.pdf), Image (.png, .jpg, .webp), or plain text file.");
      return;
    }

    if (file.size > 12 * 1024 * 1024) {
      setUploadError("File size exceeds 12MB limit. Please upload a smaller file.");
      return;
    }

    setSelectedFile(file);
    setResumeName(file.name);
    setUploadError(null);
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Main scan execution
  const handleRunScan = async () => {
    setUploadError(null);

    if (inputMode === "upload") {
      if (!selectedFile) {
        setUploadError("Please select or drop a resume file to scan.");
        return;
      }

      setIsScanning(true);
      setScanStep("Reading document & extracting layout...");

      try {
        const formData = new FormData();
        formData.append("file", selectedFile);

        setTimeout(() => setScanStep("Auditing headers & layout against parsing standards..."), 1200);
        setTimeout(() => setScanStep("Evaluating power action verbs & quantification metrics..."), 2400);

        const res = await fetch("/api/ats/scan", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to scan document.");
        }

        if (data.data) {
          setCurrentResult(data.data);
          if (data.extractedText) {
            setResumeText(data.extractedText);
          }
          if (data.data.detectedRole) {
            setTailorRole(data.data.detectedRole);
          }
        }
      } catch (err: any) {
        console.error("Scan error:", err);
        setUploadError(err.message || "An error occurred during scanning. Please try again.");
      } finally {
        setIsScanning(false);
        setScanStep("");
      }
    } else {
      if (!resumeText.trim()) {
        setUploadError("Please paste or enter your resume text first.");
        return;
      }

      setIsScanning(true);
      setScanStep("Analyzing text payload against ATS layout criteria...");

      try {
        const res = await fetch("/api/ats/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            resumeText,
            resumeName: resumeName || "Resume_Payload.txt",
          }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.error || "Failed to analyze resume text.");
        }

        if (data.data) {
          setCurrentResult(data.data);
          if (data.data.detectedRole) {
            setTailorRole(data.data.detectedRole);
          }
        }
      } catch (err: any) {
        console.error("Scan error:", err);
        setUploadError(err.message || "An error occurred during scanning.");
      } finally {
        setIsScanning(false);
        setScanStep("");
      }
    }
  };

  const handleCopyExtractedText = () => {
    if (!resumeText) return;
    navigator.clipboard.writeText(resumeText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-emerald-700 border-emerald-500 bg-emerald-50";
    if (score >= 70) return "text-brand-primary border-brand-primary bg-indigo-50";
    return "text-amber-700 border-amber-500 bg-amber-50";
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85)
      return {
        label: "Ready for Applications (Strong Parse Fidelity)",
        variant: "emerald" as const,
        description: "Clear single-column layout, power action verbs, and measurable impact detected.",
      };
    if (score >= 70)
      return {
        label: "Good Baseline (Few Recommended Upgrades)",
        variant: "brand" as const,
        description: "Solid structure and keyword coverage. Adding more concrete metrics will boost ranking.",
      };
    return {
      label: "Needs Attention (Actionable Improvements Found)",
      variant: "amber" as const,
      description: "Needs metric quantification and stronger action verbs to avoid automated filtration.",
    };
  };

  // Group actionable fixes into Critical vs Warning
  const categorizeFixes = (fixes: string[] = []) => {
    const criticalKeywords = ["contact", "email", "phone", "table", "column", "unparseable", "missing section", "header"];
    const critical: { text: string; howToFix: string }[] = [];
    const warning: { text: string; howToFix: string }[] = [];

    fixes.forEach((fix) => {
      const lower = fix.toLowerCase();
      const isCritical = criticalKeywords.some((k) => lower.includes(k));

      if (isCritical) {
        critical.push({
          text: fix,
          howToFix: "Use standard single-column sections without nested multi-column tables or header boxes.",
        });
      } else {
        warning.push({
          text: fix,
          howToFix: "Rewrite with the XYZ formula: 'Accomplished [X] as measured by [Y], by doing [Z]'. Add concrete numbers.",
        });
      }
    });

    return { critical, warning };
  };

  const { critical: criticalIssues, warning: warningIssues } = categorizeFixes(
    currentResult?.actionableFixes || []
  );

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="space-y-4 pb-6 border-b border-slate-200">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-heading flex items-center gap-2">
              <ShieldCheck className="h-7 w-7 text-emerald-600" />
              ATS Resume Health Scanner
            </h1>
            <Badge variant="brand" size="sm">
              Standard Parser Audit
            </Badge>
          </div>
          <p className="text-sm text-slate-600 max-w-2xl">
            Audit your resume layout, keyword density, and metric quantification against single-column ATS parsing standards.
          </p>
        </div>

        {/* View Switcher: ATS Audit vs Tailoring Studio */}
        <div className="inline-flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200 shadow-2xs">
          <button
            type="button"
            onClick={() => setActiveTab("ats-audit")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "ats-audit"
                ? "bg-brand-primary text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            Standalone ATS Audit
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("tailoring-studio")}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              activeTab === "tailoring-studio"
                ? "bg-brand-primary text-white shadow-sm"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            AI Tailoring Studio
          </button>
        </div>
      </div>

      {/* ============================================================= */}
      {/* TAB 1: STANDALONE ATS AUDIT */}
      {/* ============================================================= */}
      {activeTab === "ats-audit" && (
        <div className="space-y-8">
          {/* Input Panel with Mode Toggle (Upload File vs Text) */}
          <Panel
            title="Resume Document Input"
            subtitle="Upload a PDF / Image, or paste plain text directly for parsing analysis."
            actions={
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200">
                <button
                  type="button"
                  onClick={() => {
                    setInputMode("upload");
                    setUploadError(null);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                    inputMode === "upload"
                      ? "bg-white text-brand-primary shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>Upload File</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setInputMode("text");
                    setUploadError(null);
                  }}
                  className={`px-3 py-1 text-xs font-semibold rounded-md transition-all flex items-center gap-1.5 ${
                    inputMode === "text"
                      ? "bg-white text-brand-primary shadow-xs"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Paste Text</span>
                </button>
              </div>
            }
          >
            {/* MODE 1: FILE UPLOAD (DRAG & DROP ZONE) */}
            {inputMode === "upload" && (
              <div className="space-y-4">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileInputChange}
                  accept=".pdf,image/png,image/jpeg,image/jpg,image/webp,.txt,.md"
                  className="hidden"
                />

                {!selectedFile ? (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200 ${
                      isDragOver
                        ? "border-brand-primary bg-indigo-50/80 scale-[1.01]"
                        : "border-slate-300 hover:border-brand-primary bg-slate-50/60 hover:bg-indigo-50/30"
                    }`}
                  >
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 border border-indigo-100 text-brand-primary mb-3 shadow-2xs">
                      <UploadCloud className="h-7 w-7" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 font-heading">
                      Drag & Drop your Resume (PDF or Image)
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                      Click to browse your device. Our parser extracts text, layout structures, and contact information.
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
                      <span className="text-xs font-semibold text-brand-primary bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-md">
                        PDF (Recommended)
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                        PNG / JPG / WEBP
                      </span>
                      <span className="text-xs font-semibold text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-md">
                        Max 12MB
                      </span>
                    </div>
                  </div>
                ) : (
                  /* Selected File Card */
                  <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-brand-primary border border-indigo-100">
                        {selectedFile.type.startsWith("image/") ? (
                          <ImageIcon className="h-5 w-5" />
                        ) : (
                          <FileCheck className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-bold text-slate-900 font-heading max-w-xs sm:max-w-md truncate">
                            {selectedFile.name}
                          </span>
                          <span className="text-xs font-semibold uppercase px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Ready to scan
                          </span>
                        </div>
                        <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                          <span>{formatFileSize(selectedFile.size)}</span>
                          <span>•</span>
                          <span>{selectedFile.type || "Document"}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs font-semibold text-brand-primary hover:underline px-2.5 py-1"
                      >
                        Change File
                      </button>
                      <button
                        type="button"
                        onClick={handleRemoveFile}
                        className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-200 transition-colors"
                        title="Remove file"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* MODE 2: PASTE TEXT AREA */}
            {inputMode === "text" && (
              <div className="space-y-3">
                <textarea
                  rows={8}
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste full resume text or load from current active resume..."
                  className="w-full bg-white border border-slate-300 rounded-lg p-3.5 text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary leading-relaxed shadow-2xs"
                />

                <div className="flex items-center gap-3">
                  <label htmlFor="ats-file-label" className="text-sm font-medium text-slate-700 shrink-0">
                    File Label:
                  </label>
                  <Input
                    id="ats-file-label"
                    type="text"
                    value={resumeName}
                    onChange={(e) => setResumeName(e.target.value)}
                    className="w-full sm:w-72"
                  />
                </div>
              </div>
            )}

            {/* Error Message */}
            {uploadError && (
              <div className="p-3.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 mt-3">
                <AlertTriangle className="h-4 w-4 shrink-0 text-rose-600" />
                <span>{uploadError}</span>
              </div>
            )}

            {/* Privacy & Transparency Notice */}
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600 mt-4">
              <ShieldCheck className="h-4 w-4 text-slate-400 shrink-0" />
              <span>
                Your resume is processed securely. Images or complex PDFs may use Google Gemini Vision OCR in accordance with our{" "}
                <Link href="/privacy" className="text-brand-primary underline font-medium">Privacy Policy</Link>.
              </span>
            </div>

            {/* Action Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-slate-200 mt-4">
              <div className="flex items-center gap-2">
                {resumeText && (
                  <button
                    type="button"
                    onClick={() => setShowExtractedText(!showExtractedText)}
                    className="text-xs text-slate-600 hover:text-brand-primary font-medium flex items-center gap-1.5 py-1 px-2.5 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    {showExtractedText ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                    <span>{showExtractedText ? "Hide Parsed Text" : "View Extracted Text"}</span>
                  </button>
                )}
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={handleRunScan}
                disabled={isScanning || (inputMode === "upload" ? !selectedFile : !resumeText.trim())}
                className="w-full sm:w-auto"
              >
                <Zap className="h-4 w-4 text-white" />
                <span>
                  {isScanning
                    ? scanStep || "Auditing Resume..."
                    : inputMode === "upload"
                    ? "Scan Uploaded Resume"
                    : "Run ATS Scan"}
                </span>
              </Button>
            </div>

            {/* Collapsible Parsed Text Viewer */}
            {showExtractedText && resumeText && (
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 mt-4 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 font-heading flex items-center gap-1.5">
                    <FileText className="h-4 w-4 text-brand-primary" />
                    Exact Text Parsed ({resumeText.split(/\s+/).length} words)
                  </span>
                  <button
                    type="button"
                    onClick={handleCopyExtractedText}
                    className="text-xs font-semibold text-brand-primary hover:underline flex items-center gap-1 px-2 py-1 rounded"
                  >
                    {copiedText ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copiedText ? "Copied!" : "Copy Text"}</span>
                  </button>
                </div>
                <pre className="text-xs font-mono text-slate-700 bg-white p-3.5 rounded-lg border border-slate-200 overflow-x-auto max-h-60 leading-relaxed whitespace-pre-wrap">
                  {resumeText}
                </pre>
              </div>
            )}
          </Panel>

          {/* Results Dashboard */}
          {currentResult && (
            <div className="space-y-6 animate-in fade-in duration-300">
              {/* Top Score Banner with Methodology */}
              <Card className="p-6 sm:p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  {/* Overall Radial Gauge */}
                  <div className="md:col-span-4 flex flex-col items-center justify-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-200">
                    <div
                      className={`flex h-28 w-28 items-center justify-center rounded-full border-4 ${getScoreColor(
                        currentResult.overallScore
                      )} shadow-sm mb-3`}
                    >
                      <span className="text-3xl font-extrabold font-heading text-slate-900">
                        {currentResult.overallScore}
                      </span>
                      <span className="text-xs text-slate-500 font-heading">/100</span>
                    </div>
                    <div className="text-base font-bold text-slate-900 font-heading">Resume Health Score</div>
                    <p className="text-xs text-slate-500 mt-1">Calculated across 4 objective pillars</p>

                    {/* Verdict Badge */}
                    <div className="mt-2.5">
                      <Badge variant={getScoreBadge(currentResult.overallScore).variant} size="sm">
                        {getScoreBadge(currentResult.overallScore).label}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-600 mt-2 px-2 leading-relaxed">
                      {getScoreBadge(currentResult.overallScore).description}
                    </p>
                  </div>

                  {/* 4 Pillar Breakdown Bars */}
                  <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Pillar 1: Formatting */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800">1. Formatting Compliance</span>
                        <span className="font-heading font-extrabold text-emerald-600">
                          {currentResult.formattingScore}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-emerald-500 rounded-full transition-all duration-700"
                          style={{ width: `${currentResult.formattingScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 block">Single-column headers, safe fonts, no multi-column tables</span>
                    </div>

                    {/* Pillar 2: Completeness */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800">2. Section Completeness</span>
                        <span className="font-heading font-extrabold text-brand-primary">
                          {currentResult.completenessScore}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-brand-primary rounded-full transition-all duration-700"
                          style={{ width: `${currentResult.completenessScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 block">Contact info, education, work history, skills density</span>
                    </div>

                    {/* Pillar 3: Keyword Strength */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800">3. Action Verbs & Keywords</span>
                        <span className="font-heading font-extrabold text-amber-600">
                          {currentResult.keywordStrengthScore}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-700"
                          style={{ width: `${currentResult.keywordStrengthScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 block">Power verbs density, zero passive phrases, domain keywords</span>
                    </div>

                    {/* Pillar 4: Quantification */}
                    <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-2xs space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800">4. Quantification & Metrics</span>
                        <span className="font-heading font-extrabold text-amber-600">
                          {currentResult.quantificationScore}%
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                        <div
                          className="h-full bg-amber-500 rounded-full transition-all duration-700"
                          style={{ width: `${currentResult.quantificationScore}%` }}
                        />
                      </div>
                      <span className="text-xs text-slate-500 block">Numbers, % improvements, scale, throughput metrics</span>
                    </div>
                  </div>
                </div>

                {/* Plain-Language Calculation Methodology Box */}
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <HelpCircle className="h-5 w-5 text-slate-400 shrink-0 mt-0.5" />
                  <div className="space-y-1 text-xs text-slate-600">
                    <span className="font-bold text-slate-900 block">How this score is calculated:</span>
                    <p className="leading-relaxed">
                      Your overall score is an unweighted average of 4 objective pillars (25% each): Formatting Compliance,
                      Section Completeness, Keyword Strength, and Metric Quantification. No subjective or paywalled bias is applied.
                      Scores above 80 indicate strong readiness for applicant tracking systems.
                    </p>
                  </div>
                </div>
              </Card>

              {/* Detected Profile & Keyword Matrix */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
                {/* Detected Domain & Skills */}
                <Card className="p-6 h-full flex flex-col space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                      <Briefcase className="h-4 w-4 text-brand-primary shrink-0" />
                      <span>Detected Domain Profile</span>
                    </h3>
                    <Badge variant="brand" size="sm">
                      {currentResult.detectedRole || "Software Engineer"}
                    </Badge>
                  </div>

                  <p className="text-xs text-slate-600">
                    High-value technical competencies recognized in your document:
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentResult.detectedSkills && currentResult.detectedSkills.length > 0 ? (
                      currentResult.detectedSkills.map((sk) => (
                        <span
                          key={sk}
                          className="text-xs font-medium text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg"
                        >
                          ✓ {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 italic">No specific skills cataloged yet.</span>
                    )}
                  </div>
                </Card>

                {/* Missing Keyword Recommendations */}
                <Card className="p-6 h-full flex flex-col space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                    <h3 className="text-sm font-bold text-slate-900 font-heading flex items-center gap-2">
                      <Sparkles className="h-4 w-4 text-amber-600 shrink-0" />
                      <span>Recommended Industry Keywords</span>
                    </h3>
                    <span className="text-xs font-semibold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      Opportunity
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Commonly parsed keywords for {currentResult.detectedRole || "your role"}:
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {currentResult.missingKeywords && currentResult.missingKeywords.length > 0 ? (
                      currentResult.missingKeywords.map((kw) => (
                        <span
                          key={kw}
                          className="text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-lg"
                        >
                          + {kw}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-emerald-600 font-medium">
                        ✓ All top industry keyword categories covered!
                      </span>
                    )}
                  </div>
                </Card>
              </div>

              {/* Grouped Findings by Severity: Critical, Warnings, Passed */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-slate-900 font-heading">
                  Audit Findings by Severity
                </h3>

                {/* 1. CRITICAL ISSUES (MUST FIX) */}
                {criticalIssues.length > 0 && (
                  <Card className="p-6 border-red-200 bg-red-50/30 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-red-200">
                      <div className="flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-red-600" />
                        <h4 className="text-sm font-bold text-red-900 font-heading">
                          Critical Issues ({criticalIssues.length}) — Must Fix
                        </h4>
                      </div>
                      <Badge variant="rose" size="sm">High Priority</Badge>
                    </div>

                    <div className="space-y-3 pt-1">
                      {criticalIssues.map((issue, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-white border border-red-200 space-y-1">
                          <p className="text-xs font-semibold text-red-900">{issue.text}</p>
                          <p className="text-xs text-slate-600">
                            <span className="font-semibold text-slate-700">How to fix:</span> {issue.howToFix}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* 2. WARNINGS (RECOMMENDED IMPROVEMENTS) */}
                {warningIssues.length > 0 && (
                  <Card className="p-6 border-amber-200 bg-amber-50/30 space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-amber-200">
                      <div className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-amber-600" />
                        <h4 className="text-sm font-bold text-amber-900 font-heading">
                          Recommended Improvements ({warningIssues.length})
                        </h4>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("tailoring-studio")}
                        className="text-xs text-brand-primary hover:underline font-semibold flex items-center gap-1"
                      >
                        <Sparkles className="h-3.5 w-3.5" /> Fix in Studio →
                      </button>
                    </div>

                    <div className="space-y-3 pt-1">
                      {warningIssues.map((issue, idx) => (
                        <div key={idx} className="p-3 rounded-lg bg-white border border-amber-200 space-y-1">
                          <p className="text-xs font-semibold text-amber-900">{issue.text}</p>
                          <p className="text-xs text-slate-600">
                            <span className="font-semibold text-slate-700">How to fix:</span> {issue.howToFix}
                          </p>
                        </div>
                      ))}
                    </div>
                  </Card>
                )}

                {/* 3. PASSED CHECKS / VERIFIED STRENGTHS */}
                <Card className="p-6 border-emerald-200 bg-emerald-50/20 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      <h4 className="text-sm font-bold text-emerald-900 font-heading">
                        Passed Checks & Verified Strengths ({currentResult.strengths?.length || 0})
                      </h4>
                    </div>
                    <Badge variant="emerald" size="sm">Passed</Badge>
                  </div>

                  <div className="pt-1">
                    {currentResult.strengths && currentResult.strengths.length > 0 ? (
                      <ul className="space-y-2">
                        {currentResult.strengths.map((str, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <span>{str}</span>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-500 italic">No specific strengths cataloged yet.</p>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 2: AI TAILORING STUDIO */}
      {/* ============================================================= */}
      {activeTab === "tailoring-studio" && (
        <div className="space-y-6">
          <Panel
            title="AI Resume Tailoring Studio"
            subtitle="Target a specific specialization. Identify gaps, incorporate approved upgrades, and save a distinct version."
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="sm:col-span-2">
                <label className="text-sm font-medium text-slate-700 block mb-1.5">
                  Target Specialization / Role Focus
                </label>
                <Input
                  type="text"
                  value={tailorRole}
                  onChange={(e) => setTailorRole(e.target.value)}
                  placeholder="e.g. Senior Backend / Distributed Systems Engineer"
                />
              </div>
              <div className="flex items-end">
                <Button variant="primary" size="md" className="w-full">
                  <Sparkles className="h-4 w-4 text-white" />
                  <span>Synthesize Role Gaps</span>
                </Button>
              </div>
            </div>
          </Panel>

          {/* Comparison Flow Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Column 1: Current Resume Gaps */}
            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <FileText className="h-4 w-4 text-brand-primary" />
                <h3 className="text-sm font-bold text-slate-900 font-heading">1. Detected Keywords</h3>
              </div>
              <p className="text-xs text-slate-600">High-value terms found in your current Master Profile:</p>
              <div className="flex flex-wrap gap-1.5">
                {(currentResult?.detectedSkills && currentResult.detectedSkills.length > 0
                  ? currentResult.detectedSkills.slice(0, 6)
                  : ["PostgreSQL", "Next.js", "Redis", "Distributed Systems", "REST/gRPC"]
                ).map((t) => (
                  <Badge key={t} variant="emerald" size="sm">
                    ✓ {t}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Column 2: Missing Skill Opportunities */}
            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <h3 className="text-sm font-bold text-slate-900 font-heading">2. Missing Power Keywords</h3>
              </div>
              <p className="text-xs text-slate-600">High-impact terms that elevate rank for {tailorRole}:</p>
              <div className="flex flex-wrap gap-1.5">
                {(currentResult?.missingKeywords && currentResult.missingKeywords.length > 0
                  ? currentResult.missingKeywords
                  : ["High Throughput", "Fault Tolerance", "Canary Rollouts", "p99 SLA", "Micro-benchmarking"]
                ).map((t) => (
                  <Badge key={t} variant="amber" size="sm">
                    + {t}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Column 3: Tailoring Suggestions with Approval */}
            <Card className="p-6 space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
                <SlidersHorizontal className="h-4 w-4 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 font-heading">3. Proposed Upgrades</h3>
              </div>
              <p className="text-xs text-slate-600">Select suggestions to incorporate into new version:</p>

              <div className="space-y-2">
                {[
                  { id: "s1", label: "Quantify project throughput to 4.2M daily transactions", approved: tailorApproved.s1 },
                  { id: "s2", label: "Elevate Distributed Workflow Architecture to top project", approved: tailorApproved.s2 },
                  { id: "s3", label: "Inject sub-50ms p99 latency metric in Summary", approved: tailorApproved.s3 },
                ].map((sug) => (
                  <div
                    key={sug.id}
                    onClick={() => setTailorApproved({ ...tailorApproved, [sug.id]: !sug.approved })}
                    className={`p-3 rounded-lg border text-xs cursor-pointer transition-all flex items-start gap-2.5 ${
                      tailorApproved[sug.id]
                        ? "bg-emerald-50 border-emerald-300 text-emerald-800 font-medium"
                        : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <div
                      className={`h-4 w-4 rounded flex items-center justify-center mt-0.5 shrink-0 ${
                        tailorApproved[sug.id] ? "bg-emerald-600 text-white font-bold" : "border border-slate-300 bg-white"
                      }`}
                    >
                      {tailorApproved[sug.id] && "✓"}
                    </div>
                    <span className="text-xs leading-relaxed">{sug.label}</span>
                  </div>
                ))}
              </div>

              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setVersionSaved(true);
                  setTimeout(() => setVersionSaved(false), 3000);
                }}
                className="w-full mt-2"
              >
                <Check className="h-4 w-4" />
                <span>{versionSaved ? "Snapshot Saved to Versions!" : "Create Tailored Version"}</span>
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
