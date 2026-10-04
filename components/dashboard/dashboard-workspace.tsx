"use client";

import Link from "next/link";
import { MasterCareerProfile } from "@/types/profile";
import { Resume, ResumeVersion } from "@/types/resume";
import { ATSScanResult } from "@/types/ats";
import { InterviewSession } from "@/types/interview";
import {
  Card,
  Badge,
  Button,
  PageHeader,
  EmptyState,
} from "@/components/ui/primitives";
import {
  User,
  FileText,
  ShieldCheck,
  Send,
  Headphones,
  Crown,
  ArrowRight,
  History,
  Plus,
} from "lucide-react";

interface Props {
  profile: MasterCareerProfile;
  resumes: Resume[];
  versions: ResumeVersion[];
  atsScans: ATSScanResult[];
  interviews: InterviewSession[];
}

export function DashboardWorkspace({
  profile,
  resumes,
  versions,
  atsScans,
  interviews,
}: Props) {
  const hasResumes = resumes && resumes.length > 0;
  const primaryResume = hasResumes ? resumes[0] : null;
  const latestScan = atsScans?.[0];
  const latestInterview = interviews?.[0];

  // Calculate profile completeness %
  let profileScore = 40;
  if (profile?.education?.length) profileScore += 15;
  if (profile?.experience?.length) profileScore += 15;
  if (profile?.projects?.length) profileScore += 15;
  if (profile?.skills?.technical?.length) profileScore += 15;

  const displayName = profile?.fullName ? profile.fullName.split(" ")[0] : "Professional";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <PageHeader
        badge="Career Cockpit"
        title={`Welcome back, ${displayName}`}
        description="One unified hub for your Master Career Profile, ATS documents, and interview practice."
        actions={
          <Link href="/resume">
            <Button size="md" className="gap-2">
              <Plus className="w-4 h-4" />
              <span>New Resume</span>
            </Button>
          </Link>
        }
      />

      {/* Top Quick Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Profile Strength */}
        <Card className="p-5 space-y-3 bg-white">
          <div className="flex justify-between items-center">
            <span className="text-sm text-ink-muted font-semibold flex items-center gap-1.5">
              <User className="w-4 h-4 text-accent" aria-hidden="true" />
              <span>Profile strength</span>
            </span>
            <span className="font-heading font-extrabold text-accent text-sm">
              {profileScore}%
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"
            role="progressbar"
            aria-valuenow={profileScore}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Profile strength: ${profileScore}%`}
          >
            <div
              className="h-full bg-accent rounded-full transition-all"
              style={{ width: `${profileScore}%` }}
            />
          </div>
          <Link
            href="/profile"
            className="text-xs text-accent hover:text-accent-hover font-semibold flex items-center gap-1"
          >
            <span>Edit Master Profile</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </Card>

        {/* ATS Baseline */}
        <Card className="p-5 space-y-3 bg-white">
          <div className="flex justify-between items-center">
            <span className="text-sm text-ink-muted font-semibold flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
              <span>ATS audit score</span>
            </span>
            <span className="font-heading font-extrabold text-emerald-700 text-sm">
              {latestScan ? `${latestScan.overallScore}/100` : "Ready"}
            </span>
          </div>
          <div
            className="w-full h-2 rounded-full bg-slate-100 overflow-hidden"
            role="progressbar"
            aria-valuenow={latestScan ? latestScan.overallScore : 85}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`ATS score: ${latestScan ? latestScan.overallScore : 85}`}
          >
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${latestScan ? latestScan.overallScore : 85}%` }}
            />
          </div>
          <Link
            href="/ats"
            className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
          >
            <span>Run standalone scan</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </Card>

        {/* Version Snapshots */}
        <Card className="p-5 space-y-3 bg-white">
          <div className="flex justify-between items-center">
            <span className="text-sm text-ink-muted font-semibold flex items-center gap-1.5">
              <History className="w-4 h-4 text-amber-600" aria-hidden="true" />
              <span>Resume versions</span>
            </span>
            <span className="font-heading font-extrabold text-amber-800 text-sm">
              {versions?.length || 0} saved
            </span>
          </div>
          <p className="text-xs text-ink-muted truncate">
            Latest: {versions?.[0]?.versionLabel || "No snapshots yet"}
          </p>
          <Link
            href="/resume"
            className="text-xs text-amber-700 hover:text-amber-800 font-semibold flex items-center gap-1"
          >
            <span>Manage snapshots</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </Card>

        {/* Mock Interview Status */}
        <Card className="p-5 space-y-3 bg-white">
          <div className="flex justify-between items-center">
            <span className="text-sm text-ink-muted font-semibold flex items-center gap-1.5">
              <Headphones className="w-4 h-4 text-accent" aria-hidden="true" />
              <span>Interview prep</span>
            </span>
            <span className="font-heading font-extrabold text-accent text-sm">
              {latestInterview ? `${latestInterview.overallScore || 85}%` : "5 roles"}
            </span>
          </div>
          <p className="text-xs text-ink-muted truncate">
            {latestInterview ? latestInterview.targetRole : "Practice tech roles"}
          </p>
          <Link
            href="/interview"
            className="text-xs text-accent hover:text-accent-hover font-semibold flex items-center gap-1"
          >
            <span>Start mock session</span>
            <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
          </Link>
        </Card>
      </div>

      {/* Main Grid: Active Resume & Connected Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Primary Resume & Version Snapshots */}
        <div className="lg:col-span-7 space-y-6">
          <Card className="p-6 sm:p-7 space-y-4 bg-white">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-accent" aria-hidden="true" />
                <h2 className="text-base font-bold text-ink font-heading">
                  Active primary resume
                </h2>
              </div>
              {primaryResume && (
                <Badge variant="accent">
                  {primaryResume.templateId.toUpperCase()}
                </Badge>
              )}
            </div>

            {primaryResume ? (
              <>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-ink font-heading">
                    {primaryResume.title}
                  </h3>
                  <p className="text-sm text-ink-muted">
                    Target role:{" "}
                    <span className="font-semibold text-accent">
                      {primaryResume.targetRole}
                    </span>
                  </p>
                  <p className="text-sm text-ink-muted line-clamp-2 leading-relaxed pt-1">
                    {primaryResume.content.personal.summary ||
                      "Complete professional summary configured."}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-100">
                  <Link href="/resume">
                    <Button variant="primary" size="sm">
                      Edit in 7-step builder
                    </Button>
                  </Link>
                  <Link href="/ats">
                    <Button variant="outline" size="sm">
                      Run ATS audit
                    </Button>
                  </Link>
                </div>
              </>
            ) : (
              <EmptyState
                icon={FileText}
                title="No resumes created yet"
                description="Use the 7-step wizard to build your first tailored resume using verified XYZ bullet formatting."
                action={
                  <Link href="/resume">
                    <Button size="sm">Create first resume</Button>
                  </Link>
                }
              />
            )}
          </Card>

          {/* Version History Quick Viewer */}
          <Card className="p-6 sm:p-7 space-y-4 bg-white">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-amber-600" aria-hidden="true" />
                <h3 className="text-sm font-bold text-ink font-heading">
                  Labeled resume versions
                </h3>
              </div>
              <Link
                href="/resume"
                className="text-xs text-accent hover:text-accent-hover font-semibold"
              >
                View all ({versions?.length || 0})
              </Link>
            </div>

            {versions && versions.length > 0 ? (
              <div className="space-y-2.5">
                {versions.map((v) => (
                  <div
                    key={v.id}
                    className="p-3.5 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-between transition-colors"
                  >
                    <div>
                      <span className="text-sm font-bold text-ink">
                        {v.versionLabel}
                      </span>
                      <span className="text-xs text-ink-subtle block mt-0.5">
                        {new Date(v.createdAt).toLocaleDateString("en-IN")} · v{v.versionNumber}
                      </span>
                    </div>
                    <Link href="/resume">
                      <Badge variant="accent" className="cursor-pointer">
                        Restore
                      </Badge>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-ink-muted py-4 text-center">
                No snapshots saved yet. Save named versions in the resume builder as you apply to different roles.
              </p>
            )}
          </Card>
        </div>

        {/* Right Column: Connected Platform Shortcuts */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-6 sm:p-7 space-y-4 bg-white">
            <h3 className="text-sm font-bold text-ink pb-2 border-b border-slate-100 font-heading">
              Connected platform tools
            </h3>

            <div className="space-y-3">
              {/* Standalone ATS Scanner */}
              <Link
                href="/ats"
                className="group block p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-emerald-500/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-ink flex items-center gap-1.5 group-hover:text-emerald-700">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" aria-hidden="true" />
                    <span>Standalone ATS scanner</span>
                  </span>
                  <ArrowRight
                    className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Grades formatting, completeness, keyword strength &amp; quantified metrics without needing a job description.
                </p>
              </Link>

              {/* Cover Letter AI */}
              <Link
                href="/cover-letter"
                className="group block p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-accent transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-ink flex items-center gap-1.5 group-hover:text-accent">
                    <Send className="w-4 h-4 text-accent" aria-hidden="true" />
                    <span>Role cover letter builder</span>
                  </span>
                  <ArrowRight
                    className="w-4 h-4 text-slate-400 group-hover:text-accent transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Enter company, role &amp; tone for a persuasive, grounded cover letter ready for export.
                </p>
              </Link>

              {/* Interview AI */}
              <Link
                href="/interview"
                className="group block p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-amber-500/50 transition-all duration-200"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-bold text-ink flex items-center gap-1.5 group-hover:text-amber-700">
                    <Headphones className="w-4 h-4 text-amber-600" aria-hidden="true" />
                    <span>Role mock interview AI</span>
                  </span>
                  <ArrowRight
                    className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </div>
                <p className="text-xs text-ink-muted leading-relaxed">
                  Select your target role, submit answers, and receive instant scoring with model solutions.
                </p>
              </Link>
            </div>
          </Card>

          {/* Pro Upgrade Promotion */}
          <Card className="p-6 space-y-3 bg-amber-50/40 border-amber-200">
            <div className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-amber-600" aria-hidden="true" />
              <h3 className="text-sm font-bold text-ink font-heading">
                Upgrade to Karyvo Pro
              </h3>
            </div>
            <p className="text-xs text-ink-muted leading-relaxed">
              Unlock unlimited AI bullet enhancements, unlimited named version snapshots, and role-specific mock interview simulations.
            </p>
            <Link href="/pricing" className="block pt-1">
              <Button variant="primary" size="sm" className="w-full">
                View Pro plans (₹499/mo)
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
