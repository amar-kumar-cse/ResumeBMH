import { repository } from "@/lib/db/repository";

export interface ProStatus {
  isPro: boolean;
  plan: "pro" | "free";
  status: string;
  currentPeriodEnd?: string | null;
}

/**
 * Server-side subscription and Pro entitlement verification.
 * Validates plan === "pro", status === "active", and ensures currentPeriodEnd has not elapsed.
 */
export async function checkProStatus(userId: string): Promise<ProStatus> {
  const sub = await repository.getSubscription(userId);
  if (!sub || sub.plan !== "pro") {
    return {
      isPro: false,
      plan: "free",
      status: sub?.status || "inactive",
      currentPeriodEnd: sub?.currentPeriodEnd,
    };
  }

  // Check expiration if currentPeriodEnd is recorded
  if (sub.currentPeriodEnd) {
    const expiresAt = new Date(sub.currentPeriodEnd).getTime();
    if (expiresAt < Date.now()) {
      return {
        isPro: false,
        plan: "free",
        status: "expired",
        currentPeriodEnd: sub.currentPeriodEnd,
      };
    }
    // Still within paid period, even if user canceled auto-renewal
    return {
      isPro: true,
      plan: "pro",
      status: sub.status,
      currentPeriodEnd: sub.currentPeriodEnd,
    };
  }

  if (sub.status === "active") {
    return {
      isPro: true,
      plan: "pro",
      status: "active",
      currentPeriodEnd: sub.currentPeriodEnd,
    };
  }

  return {
    isPro: false,
    plan: "free",
    status: sub.status,
    currentPeriodEnd: sub.currentPeriodEnd,
  };
}

/**
 * Gatekeeper helper for protected/pro-only API routes and server actions.
 * Throws a 403 Forbidden error if user does not possess an active Pro plan.
 */
export async function requirePro(userId: string): Promise<ProStatus> {
  const status = await checkProStatus(userId);
  if (!status.isPro) {
    const error = new Error("This feature requires an active Karyvo Pro subscription.");
    (error as Error & { status?: number }).status = 403;
    throw error;
  }
  return status;
}

/**
 * Enforces free-tier limits vs Pro entitlement.
 * Free tier gets:
 *   - 1 Cover Letter
 *   - 1 Interview Session
 *   - 3 AI Bullet Improvements / day
 *   - 0 Version Snapshots (Pro only)
 * Pro tier gets unlimited access across all features.
 */
export async function enforceFeatureQuota(
  userId: string,
  feature: "cover-letter" | "interview" | "ai-bullet" | "version-snapshot"
): Promise<void> {
  const proStatus = await checkProStatus(userId);
  if (proStatus.isPro) {
    return; // Pro users enjoy unlimited usage
  }

  if (feature === "version-snapshot") {
    const err = new Error("Resume version snapshots require an active Karyvo Pro subscription.");
    (err as Error & { status?: number }).status = 403;
    throw err;
  }

  if (feature === "cover-letter") {
    const letters = await repository.getCoverLetters(userId);
    if (letters.length >= 1) {
      const err = new Error("You have reached the free limit of 1 cover letter. Upgrade to Karyvo Pro for unlimited tailored cover letters.");
      (err as Error & { status?: number }).status = 403;
      throw err;
    }
  }

  if (feature === "interview") {
    const sessions = await repository.getInterviewSessions(userId);
    if (sessions.length >= 1) {
      const err = new Error("You have reached the free limit of 1 mock interview session. Upgrade to Karyvo Pro for unlimited interview prep.");
      (err as Error & { status?: number }).status = 403;
      throw err;
    }
  }

  if (feature === "ai-bullet") {
    const count = await repository.getDailyAIBulletCount(userId);
    if (count >= 3) {
      const err = new Error("You have reached the free limit of 3 AI bullet improvements today. Upgrade to Karyvo Pro for unlimited improvements.");
      (err as Error & { status?: number }).status = 403;
      throw err;
    }
    await repository.incrementDailyAIBulletCount(userId);
  }
}
