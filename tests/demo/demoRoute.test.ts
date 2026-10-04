import { describe, it, expect } from "vitest";
import { POST } from "@/app/api/demo/improve-bullet/route";
import { NextRequest } from "next/server";

function createMockRequest(body: unknown, ip: string = "10.0.0.1"): NextRequest {
  return new NextRequest("http://localhost:3000/api/demo/improve-bullet", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": ip,
    },
    body: JSON.stringify(body),
  });
}

describe("Public Demo Route (/api/demo/improve-bullet)", () => {
  it("returns 400 on empty bullet input", async () => {
    const req = createMockRequest({ bullet: "" }, "192.168.1.1");
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
  });

  it("returns 400 on 301+ character input", async () => {
    const longBullet = "A".repeat(301);
    const req = createMockRequest({ bullet: longBullet }, "192.168.1.2");
    const res = await POST(req);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/300 characters or less/);
  });

  it("returns 200 and valid honest output for valid input without auth", async () => {
    const req = createMockRequest(
      { bullet: "Built customer onboarding workflow in React" },
      "192.168.1.3"
    );
    const res = await POST(req);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(true);
    expect(json.data).toHaveProperty("rewritten");
    expect(json.data).toHaveProperty("result");
    expect(json.data).toHaveProperty("needsMetric");
    expect(json.data.needsMetric).toBe(true);
    expect(json.data.rewritten).toContain("[add your number]");
  });

  it("returns 429 with Retry-After header after exceeding rate limit", async () => {
    const testIp = "192.168.1.99";

    // Rate limit is 5 requests per minute
    for (let i = 0; i < 5; i++) {
      const req = createMockRequest({ bullet: `Test bullet ${i}` }, testIp);
      const res = await POST(req);
      expect(res.status).toBe(200);
    }

    // 6th request should be rate-limited
    const limitedReq = createMockRequest({ bullet: "6th request should fail" }, testIp);
    const limitedRes = await POST(limitedReq);
    expect(limitedRes.status).toBe(429);
    expect(limitedRes.headers.get("Retry-After")).toBeDefined();
    const json = await limitedRes.json();
    expect(json.success).toBe(false);
    expect(json.error).toMatch(/Rate limit reached/);
  });

  it("permits signed-out visitors on /api/demo/improve-bullet while /api/ai/improve-bullet returns 401", async () => {
    // 1. Unauthenticated demo request succeeds
    const demoReq = createMockRequest(
      { bullet: "Refactored database query layer in PostgreSQL" },
      "192.168.1.150"
    );
    const demoRes = await POST(demoReq);
    expect(demoRes.status).toBe(200);
    const demoJson = await demoRes.json();
    expect(demoJson.success).toBe(true);

    // 2. Unauthenticated call to standard /api/ai/improve-bullet fails with 401 Unauthorized
    const { POST: postAiRoute } = await import("@/app/api/ai/improve-bullet/route");
    const aiReq = new NextRequest("http://localhost:3000/api/ai/improve-bullet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ bullet: "Refactored database query layer in PostgreSQL" }),
    });

    const aiRes = await postAiRoute(aiReq);
    expect(aiRes.status).toBe(401);
  });
});
