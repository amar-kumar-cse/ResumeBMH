import { describe, expect, it, beforeEach } from "vitest";
import { repository } from "@/lib/db/repository";
import { enforceFeatureQuota } from "@/lib/payments/pro";

describe("Free-tier Limits vs Pro Quotas", () => {
  const freeUser = "test-quota-free-user";
  const proUser = "test-quota-pro-user";

  beforeEach(async () => {
    // Ensure proUser has active Pro
    await repository.upgradeToPro(proUser, {
      billingCycle: "monthly",
      orderId: "ord_pro_quota",
      paymentId: "pay_pro_quota",
    });
  });

  it("version-snapshot: forbidden on free tier, allowed on Pro", async () => {
    await expect(enforceFeatureQuota(freeUser, "version-snapshot")).rejects.toThrow(
      "Resume version snapshots require an active ResumeBMH Pro subscription"
    );

    await expect(enforceFeatureQuota(proUser, "version-snapshot")).resolves.toBeUndefined();
  });

  it("cover-letter: allows 1 on free tier, blocks 2nd; unlimited on Pro", async () => {
    const clUser = "test-quota-cl-user";
    // 1st cover letter allowed
    await expect(enforceFeatureQuota(clUser, "cover-letter")).resolves.toBeUndefined();

    // Save 1 cover letter
    await repository.saveCoverLetter({
      id: "cov-111",
      userId: clUser,
      companyName: "Acme Corp",
      targetRole: "Frontend Engineer",
      tone: "Professional & Polished",
      content: "Letter body...",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 2nd cover letter blocked on free tier
    await expect(enforceFeatureQuota(clUser, "cover-letter")).rejects.toThrow(
      "You have reached the free limit of 1 cover letter"
    );

    // Unlimited on Pro
    await expect(enforceFeatureQuota(proUser, "cover-letter")).resolves.toBeUndefined();
  });

  it("interview: allows 1 session on free tier, blocks 2nd; unlimited on Pro", async () => {
    const intUser = "test-quota-int-user";
    // 1st interview allowed
    await expect(enforceFeatureQuota(intUser, "interview")).resolves.toBeUndefined();

    // Save 1 interview session
    await repository.saveInterviewSession({
      id: "int-111",
      userId: intUser,
      targetRole: "Backend Engineer",
      status: "completed",
      questions: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 2nd interview blocked on free tier
    await expect(enforceFeatureQuota(intUser, "interview")).rejects.toThrow(
      "You have reached the free limit of 1 mock interview session"
    );

    // Unlimited on Pro
    await expect(enforceFeatureQuota(proUser, "interview")).resolves.toBeUndefined();
  });

  it("ai-bullet: allows 3 per day on free tier, blocks 4th; unlimited on Pro", async () => {
    const bulletUser = "test-quota-bullet-user";

    // 1st, 2nd, 3rd allowed
    await expect(enforceFeatureQuota(bulletUser, "ai-bullet")).resolves.toBeUndefined();
    await expect(enforceFeatureQuota(bulletUser, "ai-bullet")).resolves.toBeUndefined();
    await expect(enforceFeatureQuota(bulletUser, "ai-bullet")).resolves.toBeUndefined();

    // 4th blocked on free tier
    await expect(enforceFeatureQuota(bulletUser, "ai-bullet")).rejects.toThrow(
      "You have reached the free limit of 3 AI bullet improvements today"
    );

    // Unlimited on Pro
    await expect(enforceFeatureQuota(proUser, "ai-bullet")).resolves.toBeUndefined();
  });
});
