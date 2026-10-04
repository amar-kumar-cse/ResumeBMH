import { describe, it, expect } from "vitest";
import {
  extractNumericTokens,
  hasInventedNumbers,
  sanitizeDemoOutput,
  buildDeterministicFallback,
} from "@/lib/demo/noInventedNumbers";

describe("No Invented Numbers Validator", () => {
  it("extracts all numeric tokens properly", () => {
    const tokens = extractNumericTokens("Processed 4.2M daily transactions, reducing latency by 35% with 99.99% availability.");
    expect(tokens).toContain("4.2m");
    expect(tokens).toContain("35%");
    expect(tokens).toContain("99.99%");
  });

  it("detects when output invents a number that was NOT in the input", () => {
    const input = "Built payment API and handled database queries";
    const candidateOutput = "Architected payment API processing 4.2M transactions with 99.9% uptime.";
    expect(hasInventedNumbers(input, candidateOutput)).toBe(true);
  });

  it("accepts output when all numeric tokens originate from the input", () => {
    const input = "Reduced checkout latency by 35% using Redis cache";
    const candidateOutput = "Architected Redis caching layer, reducing checkout latency by 35%.";
    expect(hasInventedNumbers(input, candidateOutput)).toBe(false);
  });

  it("rejects invented numbers during sanitization and returns honest placeholder version", () => {
    const input = "Built user authentication microservice in Node.js";
    const outputWithInventedMetrics = {
      rewritten: "Engineered user authentication microservice in Node.js supporting 50k active users and reducing auth latency by 40%.",
      result: "Engineered auth microservice",
      metric: "50k",
      method: "Node.js optimizations",
    };

    const sanitized = sanitizeDemoOutput(input, outputWithInventedMetrics);
    expect(sanitized.needsMetric).toBe(true);
    expect(sanitized.metric).toBeNull();
    expect(sanitized.question).toBe("By how much did it improve? Add your real number.");
    expect(sanitized.rewritten).toContain("[add your number]");
    expect(extractNumericTokens(sanitized.rewritten)).not.toContain("50k");
    expect(extractNumericTokens(sanitized.rewritten)).not.toContain("40%");
  });

  it("deterministic fallback never invents numbers and prompts for input when no number exists", () => {
    const input = "Built payment microservice in Go";
    const fallback = buildDeterministicFallback(input);
    expect(fallback.needsMetric).toBe(true);
    expect(fallback.metric).toBeNull();
    expect(fallback.question).toBe("By how much did it improve? Add your real number.");
    expect(fallback.rewritten).toContain("[add your number]");
    expect(extractNumericTokens(fallback.rewritten).length).toBe(0);
  });

  it("deterministic fallback preserves existing number when present in input", () => {
    const input = "Improved response time by 30% using Redis";
    const fallback = buildDeterministicFallback(input);
    expect(fallback.needsMetric).toBe(false);
    expect(fallback.metric).toBe("30%");
    expect(fallback.question).toBeNull();
    expect(fallback.rewritten).toContain("30%");
  });
});
