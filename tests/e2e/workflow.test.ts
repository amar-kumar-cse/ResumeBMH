import { describe, expect, it } from "vitest";
import { repository, createEmptyProfile } from "@/lib/db/repository";
import { checkProStatus, enforceFeatureQuota } from "@/lib/payments/pro";
import { atsScanner } from "@/lib/ats/scanner";
import { karyvoAI } from "@/lib/ai/provider";
import { paymentService } from "@/lib/payments/razorpay";

describe("End-to-End Workflow: Profile -> Resume -> ATS -> Pro -> Quotas", () => {
  const userId = "e2e-tester-user-uuid-101";

  it("complete user career lifecycle: create profile, build resume, scan ATS, upgrade Pro, manage versions", async () => {
    // 1. Create Master Career Profile
    const base = createEmptyProfile(userId);
    const profile = await repository.saveProfile(userId, {
      ...base,
      fullName: "Ananya Deshmukh",
      email: "ananya@example.com",
      phone: "+91 9988776655",
      location: "Pune, India",
      summary: "Full Stack Engineer with 3 years building microservices",
      skills: {
        technical: ["TypeScript", "Node.js", "PostgreSQL"],
        frameworks: ["Next.js", "React"],
        tools: ["Docker", "Git"],
        soft: ["Team Leadership"],
      },
      experience: [
        {
          id: "exp-1",
          company: "Nexus Labs",
          role: "Software Engineer",
          location: "Pune",
          startDate: "2023",
          endDate: "Present",
          isCurrent: true,
          bullets: ["Engineered payment processing pipeline handling 100K daily transactions"],
        },
      ],
      education: [
        {
          id: "edu-1",
          college: "COEP Pune",
          degree: "B.Tech Computer Science",
          branch: "Computer Science",
          startYear: "2019",
          graduationYear: "2023",
          cgpa: "8.8",
        },
      ],
      projects: [],
      certifications: [],
      isFresherMode: false,
      updatedAt: new Date().toISOString(),
    });

    expect(profile.fullName).toBe("Ananya Deshmukh");

    // 2. Initial state is Free tier
    const initialStatus = await checkProStatus(userId);
    expect(initialStatus.isPro).toBe(false);
    expect(initialStatus.plan).toBe("free");

    // 3. Save Resume
    const resume = await repository.saveResume({
      id: "res-e2e-1",
      userId,
      title: "Senior Full Stack Resume",
      targetRole: "Full Stack Engineer",
      templateId: "modern-tech",
      content: {
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
        experience: profile.experience,
        education: profile.education,
        skills: profile.skills,
        projects: [],
        certifications: [],
        achievements: [],
      },
      isPrimary: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    expect(resume.id).toBe("res-e2e-1");

    // 4. Free user attempts version snapshot -> blocked by Pro paywall
    await expect(enforceFeatureQuota(userId, "version-snapshot")).rejects.toThrow(
      "Resume version snapshots require an active Karyvo Pro subscription"
    );

    // 5. Standalone ATS Scan
    const scanResult = atsScanner.analyzeResume(
      `Ananya Deshmukh
Email: ananya@example.com Phone: +91 9988776655
SUMMARY
Full Stack Engineer with 3 years building microservices in TypeScript, Next.js, and PostgreSQL.
EXPERIENCE
Software Engineer at Nexus Labs (2023 - Present)
- Engineered payment processing pipeline handling 100K daily transactions, reducing p99 latency by 35ms.
EDUCATION
B.Tech Computer Science from COEP Pune (CGPA: 8.8)
SKILLS
TypeScript, Node.js, PostgreSQL, Next.js, Docker, Git`
    );

    expect(scanResult.overallScore).toBeGreaterThanOrEqual(40);
    expect(scanResult.completenessScore).toBeGreaterThanOrEqual(40);

    // Save ATS scan to DB
    const savedScan = await repository.saveATSScan(
      {
        id: "scan-e2e-1",
        userId,
        resumeName: "Senior Full Stack Resume",
        overallScore: scanResult.overallScore,
        formattingScore: scanResult.formattingScore,
        completenessScore: scanResult.completenessScore,
        keywordStrengthScore: scanResult.keywordStrengthScore,
        quantificationScore: scanResult.quantificationScore,
        strengths: scanResult.strengths,
        issues: scanResult.issues,
        actionableFixes: scanResult.actionableFixes,
        scannedAt: new Date().toISOString(),
      },
      userId
    );
    expect(savedScan.id).toBe("scan-e2e-1");

    // 6. User purchases Karyvo Pro
    const order = await paymentService.createProOrder(userId, "yearly");
    const confirmResult = await repository.confirmPaymentAndUpgradePro({
      orderId: order.orderId,
      paymentId: "pay_e2e_verified_101",
      userId,
      billingCycle: "yearly",
    });

    expect(confirmResult.order.status).toBe("paid");
    expect(confirmResult.subscription.plan).toBe("pro");

    // 7. Pro status is now active
    const proStatus = await checkProStatus(userId);
    expect(proStatus.isPro).toBe(true);
    expect(proStatus.plan).toBe("pro");

    // 8. Version snapshot is now permitted and works smoothly
    await expect(enforceFeatureQuota(userId, "version-snapshot")).resolves.toBeUndefined();
    const version = await repository.createVersion({
      resumeId: resume.id,
      userId,
      versionNumber: 1,
      versionLabel: "v1 - Target Fintech",
      changeSummary: "Optimized for fintech platforms",
      snapshot: resume.content,
    });

    expect(version.versionNumber).toBe(1);
    expect(version.versionLabel).toBe("v1 - Target Fintech");

    // 9. Cover letter generation
    const coverLetterText = await karyvoAI.generateCoverLetter(
      profile,
      "Paytm",
      "Lead Full Stack Engineer",
      "Confident & High-Impact"
    );
    expect(coverLetterText).toContain("Paytm");
    expect(coverLetterText).toContain("Lead Full Stack Engineer");
  });
});
