"use client";

import { useState } from "react";
import { MasterCareerProfile } from "@/types/profile";
import {
  Card,
  Panel,
  Button,
  Input,
  Textarea,
  Badge,
  PageHeader,
} from "@/components/ui/primitives";
import {
  Save,
  Check,
  User,
  GraduationCap,
  Code2,
  Zap,
  Plus,
  Trash2,
  Coins,
  Clock,
  Download,
  Upload,
} from "lucide-react";

interface Props {
  initialProfile: MasterCareerProfile;
}

export function MasterProfileWorkspace({ initialProfile }: Props) {
  const [profile, setProfile] = useState<MasterCareerProfile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleExportJson = () => {
    const dataStr =
      "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    const safeName = profile.fullName ? profile.fullName.replace(/\s+/g, "_") : "user";
    downloadAnchor.setAttribute("download", `resumebmh_profile_${safeName}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], "UTF-8");
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (
            parsed &&
            typeof parsed === "object" &&
            ("fullName" in parsed || "personalInfo" in parsed)
          ) {
            setProfile((prev) => ({
              ...prev,
              ...parsed,
              skills: {
                technical: parsed.skills?.technical || prev.skills.technical,
                frameworks: parsed.skills?.frameworks || prev.skills.frameworks,
                tools: parsed.skills?.tools || prev.skills.tools,
                soft: parsed.skills?.soft || prev.skills.soft,
              },
            }));
          }
        } catch (err) {
          console.error("Failed to parse imported JSON:", err);
        }
      };
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      const data = await res.json();
      if (data.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Save profile error:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <PageHeader
        badge="Single Source of Truth"
        title="Master Career Profile"
        description="Enter your career details once. ResumeBMH routes verified information into your Resume Builder, ATS Scanner, and Interview Coach."
        actions={
          <div className="flex flex-wrap items-center gap-2.5">
            <input
              type="file"
              id="import-profile-input"
              accept=".json"
              onChange={handleImportJson}
              className="hidden"
            />
            <Button
              variant="outline"
              size="md"
              onClick={() => document.getElementById("import-profile-input")?.click()}
              title="Import profile from JSON"
              className="gap-2"
            >
              <Upload className="w-4 h-4 text-accent" />
              <span>Import JSON</span>
            </Button>

            <Button
              variant="outline"
              size="md"
              onClick={handleExportJson}
              title="Download backup as JSON"
              className="gap-2"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Export JSON</span>
            </Button>

            <Button
              variant="primary"
              size="md"
              onClick={handleSave}
              disabled={isSaving}
              className="gap-2"
            >
              {isSaving ? (
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : saveSuccess ? (
                <Check className="w-4 h-4 text-emerald-400" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              <span>{saveSuccess ? "Profile Saved!" : "Save Profile"}</span>
            </Button>
          </div>
        }
      />

      {/* Fresher Mode & Market Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Fresher Mode Card */}
        <Card className="p-5 sm:p-6 flex items-center justify-between bg-white">
          <div className="space-y-1">
            <span className="text-base font-bold text-ink font-heading flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-500" />
              <span>Fresher Acceleration Mode</span>
            </span>
            <p className="text-sm text-ink-muted leading-relaxed">
              Emphasizes College, CGPA, Projects, and Hackathons over years of corporate tenure.
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
            <input
              type="checkbox"
              checked={profile.isFresherMode}
              onChange={(e) => setProfile({ ...profile, isFresherMode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
          </label>
        </Card>

        {/* Indian Market Metrics (CTC & Notice Period) */}
        <Card className="p-5 sm:p-6 grid grid-cols-2 gap-4 bg-white">
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5 flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-amber-500" />
              <span>Current / Target CTC</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={profile.currentCtc}
                placeholder="Current (e.g. 18 LPA)"
                onChange={(e) => setProfile({ ...profile, currentCtc: e.target.value })}
                className="w-full h-11 px-3 rounded-lg border border-slate-200 text-sm focus:border-accent focus:ring-2 focus:ring-accent"
              />
              <input
                type="text"
                value={profile.expectedCtc}
                placeholder="Target (e.g. 28 LPA)"
                onChange={(e) => setProfile({ ...profile, expectedCtc: e.target.value })}
                className="w-full h-11 px-3 rounded-lg border border-slate-200 text-sm focus:border-accent focus:ring-2 focus:ring-accent"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-ink mb-1.5 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-accent" />
              <span>Notice Period</span>
            </label>
            <select
              value={profile.noticePeriod}
              onChange={(e) => setProfile({ ...profile, noticePeriod: e.target.value })}
              className="w-full h-11 px-3 rounded-lg border border-slate-200 text-sm text-ink bg-white focus:border-accent focus:ring-2 focus:ring-accent"
            >
              <option value="Immediate">Immediate</option>
              <option value="15 Days">15 Days</option>
              <option value="30 Days">30 Days</option>
              <option value="60 Days">60 Days</option>
              <option value="90 Days">90 Days</option>
            </select>
          </div>
        </Card>
      </div>

      {/* SECTION 1: PERSONAL & CONTACT */}
      <Panel
        header={
          <span className="flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            <span>1. Personal &amp; Contact Information</span>
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
          <div className="sm:col-span-4">
            <Input
              label="Full Name"
              type="text"
              value={profile.fullName}
              onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
            />
          </div>
          <div className="sm:col-span-4">
            <Input
              label="Email Address"
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            />
          </div>
          <div className="sm:col-span-4">
            <Input
              label="Phone Number"
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            />
          </div>
          <div className="sm:col-span-4">
            <Input
              label="Location"
              type="text"
              value={profile.location}
              onChange={(e) => setProfile({ ...profile, location: e.target.value })}
            />
          </div>
          <div className="sm:col-span-4">
            <Input
              label="LinkedIn URL"
              type="text"
              value={profile.linkedinUrl}
              onChange={(e) => setProfile({ ...profile, linkedinUrl: e.target.value })}
            />
          </div>
          <div className="sm:col-span-4">
            <Input
              label="GitHub URL"
              type="text"
              value={profile.githubUrl}
              onChange={(e) => setProfile({ ...profile, githubUrl: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Textarea
            label="Default Professional Summary"
            rows={3}
            value={profile.summary}
            onChange={(e) => setProfile({ ...profile, summary: e.target.value })}
            helperText="A 2-3 sentence overview of your domain expertise and key career milestones."
          />
        </div>
      </Panel>

      {/* SECTION 2: EDUCATION */}
      <Panel
        header={
          <span className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-accent" />
            <span>2. Academic Background</span>
          </span>
        }
      >
        <div className="space-y-4">
          {profile.education.map((edu) => (
            <div
              key={edu.id}
              className="p-4 sm:p-5 rounded-lg bg-slate-50 border border-slate-200 space-y-3"
            >
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-4">
                  <Input
                    label="College / Institute"
                    type="text"
                    value={edu.college}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        education: prev.education.map((item) =>
                          item.id === edu.id ? { ...item, college: e.target.value } : item
                        ),
                      }))
                    }
                  />
                </div>
                <div className="sm:col-span-4">
                  <Input
                    label="Degree & Branch"
                    type="text"
                    value={edu.branch ? `${edu.degree} - ${edu.branch}` : edu.degree}
                    onChange={(e) => {
                      const val = e.target.value;
                      const dashIdx = val.indexOf("-");
                      const degree = dashIdx > -1 ? val.substring(0, dashIdx).trim() : val;
                      const branch = dashIdx > -1 ? val.substring(dashIdx + 1).trim() : "";
                      setProfile((prev) => ({
                        ...prev,
                        education: prev.education.map((item) =>
                          item.id === edu.id ? { ...item, degree, branch } : item
                        ),
                      }));
                    }}
                  />
                </div>
                <div className="sm:col-span-2">
                  <Input
                    label="CGPA / %"
                    type="text"
                    value={edu.cgpa}
                    onChange={(e) =>
                      setProfile((prev) => ({
                        ...prev,
                        education: prev.education.map((item) =>
                          item.id === edu.id ? { ...item, cgpa: e.target.value } : item
                        ),
                      }))
                    }
                  />
                </div>
                <div className="sm:col-span-2 flex items-end gap-2">
                  <div className="flex-1">
                    <Input
                      label="Grad Year"
                      type="text"
                      value={edu.graduationYear || ""}
                      placeholder="YYYY"
                      onChange={(e) =>
                        setProfile((prev) => ({
                          ...prev,
                          education: prev.education.map((item) =>
                            item.id === edu.id ? { ...item, graduationYear: e.target.value } : item
                          ),
                        }))
                      }
                    />
                  </div>
                  {profile.education.length > 1 && (
                    <button
                      type="button"
                      aria-label="Remove college entry"
                      onClick={() =>
                        setProfile((prev) => ({
                          ...prev,
                          education: prev.education.filter((item) => item.id !== edu.id),
                        }))
                      }
                      className="h-11 px-3 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors border border-transparent hover:border-rose-200"
                      title="Remove this college"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add College button */}
          <div className="pt-1 flex justify-start">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                setProfile((prev) => ({
                  ...prev,
                  education: [
                    ...prev.education,
                    {
                      id: `edu-${Date.now()}`,
                      college: "",
                      degree: "B.Tech",
                      branch: "Computer Science",
                      cgpa: "8.5",
                      startYear: "2020",
                      graduationYear: "2024",
                    },
                  ],
                }))
              }
              className="gap-1.5"
            >
              <Plus className="w-4 h-4 text-accent" />
              <span>Add College</span>
            </Button>
          </div>
        </div>
      </Panel>

      {/* SECTION 3: SKILLS */}
      <Panel
        header={
          <span className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-accent" />
            <span>3. Verified Technical Skills</span>
          </span>
        }
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Core & Technical Skills (comma separated)"
            type="text"
            value={profile.skills.technical.join(", ")}
            onChange={(e) =>
              setProfile({
                ...profile,
                skills: {
                  ...profile.skills,
                  technical: e.target.value.split(",").map((s) => s.trim()),
                },
              })
            }
          />
          <Input
            label="Frameworks & Libraries (comma separated)"
            type="text"
            value={profile.skills.frameworks.join(", ")}
            onChange={(e) =>
              setProfile({
                ...profile,
                skills: {
                  ...profile.skills,
                  frameworks: e.target.value.split(",").map((s) => s.trim()),
                },
              })
            }
          />
          <Input
            label="Databases & Cloud Tools (comma separated)"
            type="text"
            value={profile.skills.tools.join(", ")}
            onChange={(e) =>
              setProfile({
                ...profile,
                skills: {
                  ...profile.skills,
                  tools: e.target.value.split(",").map((s) => s.trim()),
                },
              })
            }
          />
          <Input
            label="Leadership & Core Soft Skills (comma separated)"
            type="text"
            value={profile.skills.soft.join(", ")}
            onChange={(e) =>
              setProfile({
                ...profile,
                skills: {
                  ...profile.skills,
                  soft: e.target.value.split(",").map((s) => s.trim()),
                },
              })
            }
          />
        </div>
      </Panel>

      {/* Bottom Save Action Bar */}
      <Card className="p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-slate-200">
        <div className="space-y-0.5 text-center sm:text-left">
          <p className="text-base font-bold text-ink font-heading">
            Ready to save your profile updates?
          </p>
          <p className="text-sm text-ink-muted">
            Changes saved to your Master Profile automatically sync across your Resume Builder, ATS Scanner, and Interview Coach.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={handleSave}
          disabled={isSaving}
          className="w-full sm:w-auto gap-2"
        >
          {isSaving ? (
            <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : saveSuccess ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          <span>{saveSuccess ? "Profile Saved!" : "Save Master Profile"}</span>
        </Button>
      </Card>
    </div>
  );
}
