"use client";

import { useState } from "react";
import { MasterCareerProfile } from "@/types/profile";
import { Resume, ResumeContent, ResumeVersion } from "@/types/resume";
import { PhysicallyLitResumePreview } from "./physically-lit-preview";
import {
  Card,
  Panel,
  Button,
  Badge,
  Input,
  Textarea,
  Select,
} from "@/components/ui/primitives";
import {
  Sparkles,
  Save,
  History,
  Download,
  Plus,
  Trash2,
  Check,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Eye,
  Edit3,
  Layers,
  Wand2,
  FileDown,
  X,
} from "lucide-react";

interface Props {
  initialResume?: Resume;
  profile: MasterCareerProfile;
  versions: ResumeVersion[];
}

export function ResumeBuilderWorkspace({ initialResume, profile, versions: initialVersions }: Props) {
  const defaultResume: Resume = {
    id: `res-${profile?.userId || "user-default"}-01`,
    userId: profile?.userId || "user-default",
    title: `${profile?.fullName || "Technical"} Resume (2025 Standard)`,
    targetRole: profile?.experience?.[0]?.role || "Software Development Engineer",
    templateId: "modern-tech",
    isPrimary: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    content: {
      personal: {
        fullName: profile?.fullName || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        location: profile?.location || "",
        linkedinUrl: profile?.linkedinUrl || "",
        githubUrl: profile?.githubUrl || "",
        portfolioUrl: profile?.portfolioUrl || "",
        summary: profile?.summary || "",
      },
      education: profile?.education || [],
      experience: profile?.experience || [],
      projects: profile?.projects || [],
      skills: profile?.skills || { technical: [], frameworks: [], tools: [], soft: [] },
      certifications: profile?.certifications || [],
      achievements: profile?.achievements || [],
    },
  };

  const safeInitialResume = initialResume || defaultResume;
  const [resume, setResume] = useState<Resume>(safeInitialResume);
  const [content, setContent] = useState<ResumeContent>(safeInitialResume.content);
  const [savedContentSnapshot, setSavedContentSnapshot] = useState<string>(
    JSON.stringify(safeInitialResume.content)
  );
  const [step, setStep] = useState<number>(1);
  const [mobileTab, setMobileTab] = useState<"edit" | "preview">("edit");
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [improvingIndex, setImprovingIndex] = useState<string | null>(null);
  const [versions, setVersions] = useState<ResumeVersion[]>(initialVersions);
  const [showVersionModal, setShowVersionModal] = useState(false);
  const [newVersionLabel, setNewVersionLabel] = useState("");
  const [createVersionOnSave, setCreateVersionOnSave] = useState(false);

  const hasUnsavedChanges = JSON.stringify(content) !== savedContentSnapshot;

  // Steps definition
  const steps = [
    { num: 1, label: "Personal" },
    { num: 2, label: "Education" },
    { num: 3, label: "Experience" },
    { num: 4, label: "Projects" },
    { num: 5, label: "Skills" },
    { num: 6, label: "Certifications" },
    { num: 7, label: "Finalize & Export" },
  ];

  // AI Bullet Improver handler
  const handleImproveBullet = async (section: "exp" | "proj", itemId: string, bulletIdx: number) => {
    const key = `${section}-${itemId}-${bulletIdx}`;
    setImprovingIndex(key);

    let rawText = "";
    if (section === "exp") {
      const exp = content.experience.find((e) => e.id === itemId);
      rawText = exp?.bullets[bulletIdx] || "";
    } else {
      const proj = content.projects.find((p) => p.id === itemId);
      rawText = proj?.bullets[bulletIdx] || "";
    }

    try {
      const res = await fetch("/api/ai/improve-bullet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bullet: rawText, context: resume.targetRole }),
      });
      const data = await res.json();
      if (data.success && data.data?.improved) {
        if (section === "exp") {
          setContent((prev) => ({
            ...prev,
            experience: prev.experience.map((e) =>
              e.id === itemId
                ? {
                    ...e,
                    bullets: e.bullets.map((b, i) => (i === bulletIdx ? data.data.improved : b)),
                  }
                : e
            ),
          }));
        } else {
          setContent((prev) => ({
            ...prev,
            projects: prev.projects.map((p) =>
              p.id === itemId
                ? {
                    ...p,
                    bullets: p.bullets.map((b, i) => (i === bulletIdx ? data.data.improved : b)),
                  }
                : p
            ),
          }));
        }
      }
    } catch (err) {
      console.error("AI Bullet improvement failed:", err);
    } finally {
      setImprovingIndex(null);
    }
  };

  // AI Summary Generator handler
  const handleGenerateSummary = async () => {
    try {
      const res = await fetch("/api/ai/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ targetRole: resume.targetRole }),
      });
      const data = await res.json();
      if (data.success && data.data?.summary) {
        setContent((prev) => ({
          ...prev,
          personal: {
            ...prev.personal,
            summary: data.data.summary,
          },
        }));
      }
    } catch (err) {
      console.error("Failed to generate summary:", err);
    }
  };

  // Sync from Master Career Profile
  const handleSyncFromProfile = () => {
    setContent({
      personal: {
        fullName: profile.fullName,
        email: profile.email,
        phone: profile.phone,
        location: profile.location,
        linkedinUrl: profile.linkedinUrl,
        githubUrl: profile.githubUrl,
        portfolioUrl: profile.portfolioUrl,
        summary: profile.summary,
      },
      education: profile.education,
      experience: profile.experience,
      projects: profile.projects,
      skills: profile.skills,
      certifications: profile.certifications,
      achievements: profile.achievements,
    });
  };

  // Save Resume & create version if requested
  const handleSaveResume = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    setSaveError(null);
    try {
      const res = await fetch("/api/resume", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: resume.id,
          title: resume.title,
          targetRole: resume.targetRole,
          templateId: resume.templateId,
          content,
          createVersion: createVersionOnSave,
          versionLabel: newVersionLabel.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setSavedContentSnapshot(JSON.stringify(content));
        setTimeout(() => setSaveSuccess(false), 3000);
        if (createVersionOnSave) {
          const vRes = await fetch(`/api/resume/${resume.id}/versions`);
          const vData = await vRes.json();
          if (vData.success) {
            setVersions(vData.data);
          }
          setCreateVersionOnSave(false);
          setNewVersionLabel("");
        }
      } else {
        setSaveError(data.error || "Save failed. Please try again.");
        setTimeout(() => setSaveError(null), 5000);
      }
    } catch (err) {
      console.error("Save failed:", err);
      setSaveError("Network error — please check your connection and try again.");
      setTimeout(() => setSaveError(null), 5000);
    } finally {
      setIsSaving(false);
    }
  };

  // Restore Version
  const handleRestoreVersion = async (v: ResumeVersion) => {
    try {
      const res = await fetch(`/api/resume/${resume.id}/versions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ versionId: v.id }),
      });
      const data = await res.json();
      if (data.success) {
        setContent(data.data.content);
        setSavedContentSnapshot(JSON.stringify(data.data.content));
        setShowVersionModal(false);
      }
    } catch (err) {
      console.error("Restore failed:", err);
    }
  };

  return (
    <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Floating Control Bar */}
      <Card className="p-4 sm:p-5 no-print">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2.5">
              <input
                type="text"
                value={resume.title}
                onChange={(e) => setResume({ ...resume, title: e.target.value })}
                className="bg-transparent text-xl sm:text-2xl font-extrabold text-slate-900 font-heading focus:outline-none focus:border-b-2 border-brand-primary max-w-sm"
              />
              <Badge variant="brand" size="sm">
                {resume.templateId.replace("-", " ").toUpperCase()}
              </Badge>

              {/* Sticky Save Status Pill */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-white border-slate-200 shadow-2xs">
                {isSaving ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-amber-700">Saving...</span>
                  </>
                ) : saveSuccess ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-emerald-700 font-medium">Saved</span>
                  </>
                ) : hasUnsavedChanges ? (
                  <>
                    <span className="h-2 w-2 rounded-full bg-amber-400" />
                    <span className="text-amber-800">Unsaved changes</span>
                  </>
                ) : (
                  <>
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    <span className="text-slate-600">Saved</span>
                  </>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-600">
              <span className="font-medium text-slate-500">Target Role:</span>
              <span className="font-semibold text-slate-800 bg-slate-100 px-2.5 py-0.5 rounded-md border border-slate-200">
                {resume.targetRole || "Not specified"}
              </span>
            </div>
          </div>

          {/* Action Controls */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Template Selector */}
            <div className="flex items-center">
              <label htmlFor="resume-template-selector" className="sr-only">Resume Template</label>
              <select
                id="resume-template-selector"
                value={resume.templateId}
                onChange={(e) => setResume({ ...resume, templateId: e.target.value as any })}
                className="h-10 bg-white text-xs font-semibold text-slate-800 border border-slate-300 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary shadow-2xs"
              >
                <option value="modern-tech">Template: Modern Tech</option>
                <option value="minimal-ats">Template: Minimal ATS</option>
                <option value="executive">Template: Executive</option>
                <option value="fresher-friendly">Template: Fresher Friendly</option>
              </select>
            </div>

            {/* Action Buttons */}
            <Button
              variant="secondary"
              size="sm"
              onClick={handleSyncFromProfile}
              title="Import updated facts from Master Career Profile"
            >
              <RotateCcw className="h-4 w-4 text-brand-primary" />
              <span className="hidden sm:inline">Sync Profile</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowVersionModal(true)}
            >
              <History className="h-4 w-4 text-slate-600" />
              <span>Versions ({versions.length})</span>
            </Button>

            <Button
              variant="secondary"
              size="sm"
              onClick={() => window.print()}
            >
              <FileDown className="h-4 w-4 text-slate-600" />
              <span>Print</span>
            </Button>

            <Button
              variant="primary"
              size="sm"
              onClick={handleSaveResume}
              disabled={isSaving}
            >
              {saveSuccess ? <Check className="h-4 w-4 text-emerald-200" /> : <Save className="h-4 w-4" />}
              <span>{saveSuccess ? "Saved" : isSaving ? "Saving..." : "Save Resume"}</span>
            </Button>
          </div>
        </div>

        {/* Save error banner */}
        {saveError && (
          <div className="mt-3 px-4 py-2.5 rounded-lg bg-red-50 border border-red-200 text-xs font-medium text-red-700 flex items-center gap-2">
            <span>⚠</span>
            <span>{saveError}</span>
          </div>
        )}
      </Card>

      {/* Step Progress Indicator Bar */}
      <div className="space-y-2 no-print bg-white p-4 rounded-xl border border-slate-200 shadow-2xs">
        <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
          <span>Step {step} of 7: {steps[step - 1].label}</span>
          <span className="text-brand-primary font-bold">{Math.round((step / 7) * 100)}% Complete</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden border border-slate-200">
          <div
            className="h-full bg-brand-primary rounded-full transition-all duration-300"
            style={{ width: `${(step / 7) * 100}%` }}
          />
        </div>
      </div>

      {/* Mobile Tab Switcher (Edit vs Preview) */}
      <div className="flex md:hidden items-center justify-center p-1 rounded-xl border border-slate-200 bg-slate-100 no-print">
        <button
          type="button"
          onClick={() => setMobileTab("edit")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
            mobileTab === "edit" ? "bg-brand-primary text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Edit3 className="h-4 w-4" /> Edit Resume
        </button>
        <button
          type="button"
          onClick={() => setMobileTab("preview")}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all ${
            mobileTab === "preview" ? "bg-brand-primary text-white shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Eye className="h-4 w-4" /> Live Preview
        </button>
      </div>

      {/* 7-Step Navigation Pills */}
      <div className="overflow-x-auto no-print pb-1">
        <div className="flex items-center gap-2 min-w-[720px]">
          {steps.map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold border transition-all duration-150 ${
                step === s.num
                  ? "bg-brand-primary text-white border-brand-primary shadow-sm"
                  : step > s.num
                  ? "bg-slate-50 text-slate-800 border-slate-200 hover:bg-slate-100"
                  : "bg-white text-slate-600 border-slate-200 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <span
                className={`h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold ${
                  step === s.num
                    ? "bg-white text-brand-primary"
                    : step > s.num
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {step > s.num ? "✓" : s.num}
              </span>
              <span>{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Workspace Split Layout: Desktop (Editor | Physically-Lit Preview) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mt-2">
        {/* LEFT COLUMN: 7-STEP EDITOR */}
        <div
          className={`lg:col-span-6 space-y-6 no-print ${
            mobileTab === "preview" ? "hidden lg:block" : "block"
          }`}
        >
          {/* STEP 1: PERSONAL */}
          {step === 1 && (
            <Panel title="1. Personal & Contact Information" subtitle="Ensure your name, contact details, and links are correct.">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="p-name" className="text-sm font-medium text-slate-700 block mb-1.5">Full Name</label>
                  <Input
                    id="p-name"
                    type="text"
                    value={content.personal.fullName}
                    onChange={(e) =>
                      setContent({ ...content, personal: { ...content.personal, fullName: e.target.value } })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="p-role" className="text-sm font-medium text-slate-700 block mb-1.5">Target Role</label>
                  <Input
                    id="p-role"
                    type="text"
                    placeholder="e.g. Full-Stack Developer"
                    value={resume.targetRole}
                    onChange={(e) => setResume({ ...resume, targetRole: e.target.value })}
                  />
                </div>
                <div>
                  <label htmlFor="p-email" className="text-sm font-medium text-slate-700 block mb-1.5">Email</label>
                  <Input
                    id="p-email"
                    type="email"
                    value={content.personal.email}
                    onChange={(e) =>
                      setContent({ ...content, personal: { ...content.personal, email: e.target.value } })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="p-phone" className="text-sm font-medium text-slate-700 block mb-1.5">Phone</label>
                  <Input
                    id="p-phone"
                    type="text"
                    value={content.personal.phone}
                    onChange={(e) =>
                      setContent({ ...content, personal: { ...content.personal, phone: e.target.value } })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="p-loc" className="text-sm font-medium text-slate-700 block mb-1.5">Location</label>
                  <Input
                    id="p-loc"
                    type="text"
                    value={content.personal.location}
                    onChange={(e) =>
                      setContent({ ...content, personal: { ...content.personal, location: e.target.value } })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="p-li" className="text-sm font-medium text-slate-700 block mb-1.5">LinkedIn URL</label>
                  <Input
                    id="p-li"
                    type="text"
                    value={content.personal.linkedinUrl}
                    onChange={(e) =>
                      setContent({ ...content, personal: { ...content.personal, linkedinUrl: e.target.value } })
                    }
                  />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="p-gh" className="text-sm font-medium text-slate-700 block mb-1.5">GitHub / Portfolio URL</label>
                  <Input
                    id="p-gh"
                    type="text"
                    value={content.personal.githubUrl}
                    onChange={(e) =>
                      setContent({ ...content, personal: { ...content.personal, githubUrl: e.target.value } })
                    }
                  />
                </div>
              </div>

              {/* Summary with AI Generator */}
              <div className="pt-4 border-t border-slate-200 mt-4">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <label htmlFor="p-sum" className="text-sm font-medium text-slate-700">Professional Summary</label>
                  <button
                    type="button"
                    onClick={handleGenerateSummary}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-xs font-semibold text-brand-primary transition-colors"
                  >
                    <Wand2 className="h-3.5 w-3.5 text-brand-primary" />
                    <span>AI Generate Summary</span>
                  </button>
                </div>
                <Textarea
                  id="p-sum"
                  rows={4}
                  value={content.personal.summary}
                  onChange={(e) =>
                    setContent({ ...content, personal: { ...content.personal, summary: e.target.value } })
                  }
                />
              </div>
            </Panel>
          )}

          {/* STEP 2: EDUCATION */}
          {step === 2 && (
            <Panel
              title="2. Education & Degree"
              subtitle="Add your university, college degrees, and academic marks."
              actions={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      education: [
                        ...prev.education,
                        {
                          id: `edu-${Date.now()}`,
                          college: "",
                          degree: "B.Tech",
                          branch: "Computer Science",
                          cgpa: "",
                          startYear: "2020",
                          graduationYear: "2024",
                        },
                      ],
                    }))
                  }
                >
                  <Plus className="h-4 w-4" /> Add Degree
                </Button>
              }
            >
              <div className="space-y-4">
                {content.education.map((edu, idx) => (
                  <div key={edu.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-900 font-heading">Degree #{idx + 1}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setContent((prev) => ({
                            ...prev,
                            education: prev.education.filter((e) => e.id !== edu.id),
                          }))
                        }
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete Degree"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">College / University</label>
                        <Input
                          type="text"
                          value={edu.college}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              education: prev.education.map((item) =>
                                item.id === edu.id ? { ...item, college: e.target.value } : item
                              ),
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">Degree & Branch</label>
                        <Input
                          type="text"
                          value={`${edu.degree} in ${edu.branch}`}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              education: prev.education.map((item) =>
                                item.id === edu.id ? { ...item, degree: e.target.value } : item
                              ),
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">CGPA / Percentage</label>
                        <Input
                          type="text"
                          value={edu.cgpa}
                          placeholder="e.g. 8.92"
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              education: prev.education.map((item) =>
                                item.id === edu.id ? { ...item, cgpa: e.target.value } : item
                              ),
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">Graduation Year</label>
                        <Input
                          type="text"
                          value={edu.graduationYear}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              education: prev.education.map((item) =>
                                item.id === edu.id ? { ...item, graduationYear: e.target.value } : item
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* STEP 3: EXPERIENCE */}
          {step === 3 && (
            <Panel
              title="3. Professional Experience & Internships"
              subtitle="Describe your roles with action verbs and measurable metrics."
              actions={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      experience: [
                        ...prev.experience,
                        {
                          id: `exp-${Date.now()}`,
                          company: "",
                          role: "",
                          location: "India",
                          startDate: "2023",
                          endDate: "Present",
                          isCurrent: true,
                          bullets: ["Architected scalable service delivering measurable outcome."],
                        },
                      ],
                    }))
                  }
                >
                  <Plus className="h-4 w-4" /> Add Experience
                </Button>
              }
            >
              <div className="space-y-4">
                {content.experience.map((exp) => (
                  <div key={exp.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-900 font-heading">
                        {exp.company || "New Company"}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setContent((prev) => ({
                            ...prev,
                            experience: prev.experience.filter((e) => e.id !== exp.id),
                          }))
                        }
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete Experience"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">Company</label>
                        <Input
                          type="text"
                          value={exp.company}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              experience: prev.experience.map((item) =>
                                item.id === exp.id ? { ...item, company: e.target.value } : item
                              ),
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">Role Title</label>
                        <Input
                          type="text"
                          value={exp.role}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              experience: prev.experience.map((item) =>
                                item.id === exp.id ? { ...item, role: e.target.value } : item
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Bullet points */}
                    <div className="space-y-2 pt-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm font-semibold text-slate-800">Accomplishment Bullets</label>
                        <button
                          type="button"
                          onClick={() =>
                            setContent((prev) => ({
                              ...prev,
                              experience: prev.experience.map((item) =>
                                item.id === exp.id
                                  ? { ...item, bullets: [...item.bullets, "Developed high-impact deliverable."] }
                                  : item
                              ),
                            }))
                          }
                          className="text-xs font-semibold text-brand-primary hover:underline"
                        >
                          + Add Bullet
                        </button>
                      </div>

                      {exp.bullets.map((bullet, bIdx) => (
                        <div key={bIdx} className="space-y-1">
                          <div className="flex items-start gap-2">
                            <Textarea
                              rows={2}
                              value={bullet}
                              onChange={(e) =>
                                setContent((prev) => ({
                                  ...prev,
                                  experience: prev.experience.map((item) =>
                                    item.id === exp.id
                                      ? {
                                          ...item,
                                          bullets: item.bullets.map((b, i) => (i === bIdx ? e.target.value : b)),
                                        }
                                      : item
                                  ),
                                }))
                              }
                              className="text-sm"
                            />
                            <button
                              type="button"
                              onClick={() => handleImproveBullet("exp", exp.id, bIdx)}
                              disabled={improvingIndex === `exp-${exp.id}-${bIdx}`}
                              title="Transform using the XYZ Method"
                              className="px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-brand-primary text-xs flex items-center gap-1 font-semibold transition-colors shrink-0 disabled:opacity-50"
                            >
                              <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
                              <span className="hidden sm:inline">XYZ AI</span>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* STEP 4: PROJECTS */}
          {step === 4 && (
            <Panel
              title="4. Technical Projects"
              subtitle="Showcase technical skills, architecture decisions, and live URLs."
              actions={
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() =>
                    setContent((prev) => ({
                      ...prev,
                      projects: [
                        ...prev.projects,
                        {
                          id: `proj-${Date.now()}`,
                          title: "",
                          techStack: ["React", "TypeScript", "Node.js"],
                          liveUrl: "",
                          bullets: ["Engineered full-stack system with sub-second latency."],
                        },
                      ],
                    }))
                  }
                >
                  <Plus className="h-4 w-4" /> Add Project
                </Button>
              }
            >
              <div className="space-y-4">
                {content.projects.map((proj) => (
                  <div key={proj.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-900 font-heading">
                        {proj.title || "Project Title"}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          setContent((prev) => ({
                            ...prev,
                            projects: prev.projects.filter((p) => p.id !== proj.id),
                          }))
                        }
                        className="text-slate-400 hover:text-red-600 transition-colors"
                        title="Delete Project"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">Project Title</label>
                        <Input
                          type="text"
                          value={proj.title}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              projects: prev.projects.map((item) =>
                                item.id === proj.id ? { ...item, title: e.target.value } : item
                              ),
                            }))
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-slate-700 block mb-1.5">Tech Stack (comma separated)</label>
                        <Input
                          type="text"
                          value={proj.techStack?.join(", ") || ""}
                          onChange={(e) =>
                            setContent((prev) => ({
                              ...prev,
                              projects: prev.projects.map((item) =>
                                item.id === proj.id
                                  ? { ...item, techStack: e.target.value.split(",").map((s) => s.trim()) }
                                  : item
                              ),
                            }))
                          }
                        />
                      </div>
                    </div>

                    {/* Bullets with AI improver */}
                    <div className="space-y-2 pt-1">
                      {proj.bullets.map((b, bIdx) => (
                        <div key={bIdx} className="flex items-start gap-2">
                          <Textarea
                            rows={2}
                            value={b}
                            onChange={(e) =>
                              setContent((prev) => ({
                                ...prev,
                                projects: prev.projects.map((item) =>
                                  item.id === proj.id
                                    ? {
                                        ...item,
                                        bullets: item.bullets.map((bul, i) => (i === bIdx ? e.target.value : bul)),
                                      }
                                    : item
                                ),
                              }))
                            }
                            className="text-sm"
                          />
                          <button
                            type="button"
                            onClick={() => handleImproveBullet("proj", proj.id, bIdx)}
                            className="px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-brand-primary text-xs flex items-center gap-1 font-semibold transition-colors shrink-0"
                          >
                            <Sparkles className="h-3.5 w-3.5 text-brand-primary" />
                            <span className="hidden sm:inline">XYZ AI</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Panel>
          )}

          {/* STEP 5: SKILLS */}
          {step === 5 && (
            <Panel title="5. Technical & Leadership Competencies" subtitle="Group skills by categories for clean ATS keyword matching.">
              <div className="space-y-4">
                <div>
                  <label htmlFor="s-tech" className="text-sm font-medium text-slate-700 block mb-1.5">Core & Technical Skills</label>
                  <Input
                    id="s-tech"
                    type="text"
                    value={content.skills.technical.join(", ")}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        skills: {
                          ...content.skills,
                          technical: e.target.value.split(",").map((s) => s.trim()),
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="s-fw" className="text-sm font-medium text-slate-700 block mb-1.5">Frameworks & Libraries</label>
                  <Input
                    id="s-fw"
                    type="text"
                    value={content.skills.frameworks.join(", ")}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        skills: {
                          ...content.skills,
                          frameworks: e.target.value.split(",").map((s) => s.trim()),
                        },
                      })
                    }
                  />
                </div>
                <div>
                  <label htmlFor="s-tools" className="text-sm font-medium text-slate-700 block mb-1.5">Tools, Databases & Cloud</label>
                  <Input
                    id="s-tools"
                    type="text"
                    value={content.skills.tools.join(", ")}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        skills: {
                          ...content.skills,
                          tools: e.target.value.split(",").map((s) => s.trim()),
                        },
                      })
                    }
                  />
                </div>
              </div>
            </Panel>
          )}

          {/* STEP 6: CERTIFICATIONS */}
          {step === 6 && (
            <Panel title="6. Certifications & Key Achievements" subtitle="Add awards, hackathon wins, and verified industry credentials.">
              <div className="space-y-4">
                <div>
                  <label htmlFor="cert-ach" className="text-sm font-medium text-slate-700 block mb-1.5">Key Honors & Hackathon Ranks</label>
                  <Textarea
                    id="cert-ach"
                    rows={4}
                    value={content.achievements.join("\n")}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        achievements: e.target.value.split("\n").filter((a) => a.trim()),
                      })
                    }
                    placeholder="Enter one achievement per line"
                  />
                </div>
              </div>
            </Panel>
          )}

          {/* STEP 7: FINALIZE, LABEL-BASED VERSIONING & PRINT */}
          {step === 7 && (
            <Panel title="7. Finalize, Version & Export" subtitle="Save named snapshots or download your standard PDF.">
              <div className="space-y-5">
                {/* Version Snapshot Section */}
                <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-brand-primary" />
                    <span className="text-sm font-bold text-slate-900 font-heading">Save as Labeled Version</span>
                  </div>
                  <p className="text-xs text-slate-600">
                    Tag this snapshot so you can instantly switch between focused variants (e.g. &quot;Backend Focus&quot;, &quot;Fresher Placement&quot;, &quot;SDE-2&quot;).
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2 pt-1">
                    <Input
                      type="text"
                      value={newVersionLabel}
                      onChange={(e) => setNewVersionLabel(e.target.value)}
                      placeholder="e.g. Backend Focus v2"
                      className="flex-1 text-sm"
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => {
                        setCreateVersionOnSave(true);
                        handleSaveResume();
                      }}
                    >
                      Snapshot Version
                    </Button>
                  </div>
                </div>

                {/* PDF Export Banner */}
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <span className="text-sm font-bold text-slate-900 block font-heading">
                    Print & Chromium Export Ready
                  </span>
                  <p className="text-xs text-slate-600">
                    Your resume preview matches the exported PDF pixel-for-pixel with zero client-side layout distortion.
                  </p>
                  <Button
                    variant="primary"
                    size="md"
                    onClick={() => window.print()}
                    className="mt-2"
                  >
                    <Download className="h-4 w-4" />
                    <span>Download / Print Clean PDF</span>
                  </Button>
                </div>
              </div>
            </Panel>
          )}

          {/* Bottom Step Prev/Next Navigator */}
          <div className="flex justify-between items-center pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1}
            >
              <ArrowLeft className="h-4 w-4" /> Previous
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setStep((s) => Math.min(7, s + 1))}
              disabled={step === 7}
            >
              Next Step <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* RIGHT COLUMN: LIVE RESUME PREVIEW */}
        <div
          className={`lg:col-span-6 sticky top-24 ${
            mobileTab === "edit" ? "hidden lg:block" : "block"
          }`}
        >
          <div className="flex justify-between items-center px-4 py-2.5 mb-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-600 no-print shadow-2xs">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-time Tactile Document Rendering</span>
            </div>
            <span className="font-heading text-xs text-brand-primary font-bold">Standard Single-Column Layout</span>
          </div>

          <PhysicallyLitResumePreview content={content} templateId={resume.templateId} />
        </div>
      </div>

      {/* Version History Modal */}
      {showVersionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <History className="h-5 w-5 text-brand-primary" />
                <h3 className="text-base font-bold text-slate-900 font-heading">Resume Version History</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowVersionModal(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="max-h-[350px] overflow-y-auto space-y-2.5">
              {versions.length === 0 ? (
                <p className="text-xs text-slate-500 text-center py-6">No snapshots saved yet.</p>
              ) : (
                versions.map((v) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 font-heading">
                        <span>{v.versionLabel}</span>
                        <Badge variant="brand" size="sm">
                          v{v.versionNumber}
                        </Badge>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">
                        {new Date(v.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      {v.changeSummary && (
                        <p className="text-xs text-slate-500 mt-1 italic">{v.changeSummary}</p>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRestoreVersion(v)}
                    >
                      Restore
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
