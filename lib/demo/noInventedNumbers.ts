import { z } from "zod";

export const DemoInputSchema = z.object({
  bullet: z
    .string()
    .trim()
    .min(1, "Bullet point cannot be empty")
    .max(300, "Bullet point must be 300 characters or less"),
});

export const DemoOutputSchema = z.object({
  rewritten: z.string(),
  result: z.string(),
  metric: z.string().nullable(),
  method: z.string(),
  needsMetric: z.boolean(),
  question: z.string().nullable(),
});

export type DemoInput = z.infer<typeof DemoInputSchema>;
export type DemoOutput = z.infer<typeof DemoOutputSchema>;

/**
 * Extracts numeric tokens including decimals, percentages, and scale suffixes (e.g., 4.2M, 35%, 100k, $500).
 */
export function extractNumericTokens(text: string): string[] {
  const matches = text.match(/(?:\$|₹)?\d+(?:\.\d+)?(?:%|[a-zA-Z]+)?/g);
  return matches ? matches.map((m) => m.toLowerCase()) : [];
}

/**
 * Returns true if the output contains ANY numeric token that was not present in the input.
 */
export function hasInventedNumbers(input: string, output: string): boolean {
  const inputTokens = new Set(extractNumericTokens(input));
  const outputTokens = extractNumericTokens(output);

  for (const token of outputTokens) {
    if (!inputTokens.has(token)) {
      return true;
    }
  }
  return false;
}

/**
 * Strengthens initial action verbs without inventing numbers or companies.
 */
function strengthenActionVerb(text: string): { verb: string; remainder: string } {
  const weakVerbMap: Record<string, string> = {
    built: "Architected",
    build: "Architect",
    made: "Engineered",
    make: "Engineer",
    completed: "Delivered",
    complete: "Deliver",
    "worked on": "Spearheaded",
    "work on": "Spearhead",
    handled: "Streamlined",
    handle: "Streamline",
    fixed: "Resolved",
    fix: "Resolve",
    "helped with": "Collaborated to deliver",
    helped: "Facilitated",
    created: "Developed",
    managed: "Orchestrated",
    wrote: "Engineered",
  };

  const lower = text.toLowerCase();
  for (const [weak, strong] of Object.entries(weakVerbMap)) {
    if (lower.startsWith(weak + " ") || lower.startsWith(weak + ",")) {
      const rest = text.slice(weak.length).replace(/^[\s,]+/, "");
      return { verb: strong, remainder: rest };
    }
  }

  // Capitalize existing first word as fallback
  const parts = text.trim().split(/\s+/);
  const first = parts[0] || "Engineered";
  const capitalized = first.charAt(0).toUpperCase() + first.slice(1);
  return { verb: capitalized, remainder: parts.slice(1).join(" ") };
}

/**
 * Pure deterministic fallback that reorders and strengthens the sentence following the XYZ method
 * without ever appending invented numbers or metrics.
 */
export function buildDeterministicFallback(input: string): DemoOutput {
  const cleanInput = input.trim().replace(/[.]+$/, "");
  const inputNumbers = extractNumericTokens(cleanInput);
  const hasExistingNumber = inputNumbers.length > 0;

  const { verb, remainder } = strengthenActionVerb(cleanInput);

  if (hasExistingNumber) {
    const existingMetric = inputNumbers[0];
    return {
      rewritten: `${verb} ${remainder}.`,
      result: `${verb} ${remainder}`,
      metric: existingMetric,
      method: "Direct technical implementation",
      needsMetric: false,
      question: null,
    };
  }

  // No number in input -> Must use explicit placeholder and prompt the user for their real number
  const placeholder = "[add your number]";
  const rewritten = `${verb} ${remainder}, achieving ${placeholder} improvement.`;

  return {
    rewritten,
    result: `${verb} ${remainder}`,
    metric: null,
    method: "Refactored execution structure",
    needsMetric: true,
    question: "By how much did it improve? Add your real number.",
  };
}

/**
 * Validates candidate output against the input. If the candidate invents numbers,
 * it is discarded and replaced with the safe placeholder fallback.
 */
export function sanitizeDemoOutput(
  input: string,
  candidate: {
    rewritten: string;
    result: string;
    metric: string | null;
    method: string;
  }
): DemoOutput {
  // If candidate invents numbers not in input, discard immediately
  if (hasInventedNumbers(input, candidate.rewritten)) {
    return buildDeterministicFallback(input);
  }

  const inputNumbers = extractNumericTokens(input);
  const hasExistingNumber = inputNumbers.length > 0;

  if (!hasExistingNumber) {
    // Input had no number. Ensure rewritten text contains a placeholder rather than claiming a metric
    const hasPlaceholder = candidate.rewritten.includes("[add your number]");
    const safeRewritten = hasPlaceholder
      ? candidate.rewritten
      : `${candidate.rewritten.replace(/[.]+$/, "")} [add your number].`;

    return {
      rewritten: safeRewritten,
      result: candidate.result || "Delivered key capability",
      metric: null,
      method: candidate.method || "Engineered solution",
      needsMetric: true,
      question: "By how much did it improve? Add your real number.",
    };
  }

  return {
    rewritten: candidate.rewritten,
    result: candidate.result,
    metric: candidate.metric || inputNumbers[0] || null,
    method: candidate.method,
    needsMetric: false,
    question: null,
  };
}
