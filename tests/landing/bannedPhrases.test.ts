import { describe, it, expect } from "vitest";
import fs from "fs";
import path from "path";

const BANNED_PATTERNS = [
  /98%\s+ATS\s+Pass\s+Rate/i,
  /100%\s+Zero\s+Hallucinations/i,
  /\+42%\s+Metrics/i,
  /ATS\s+Score:\s*98%/i,
  /Top\s+3%\s+Corporate\s+Elite/i,
  /at\s+Google,\s+Amazon,\s+Swiggy,\s+and\s+Razorpay/i,
  /Google'?s\s+XYZ\s+formula/i,
  /100%\s+ATS\s+Safe/i,
  /100%\s+text-parseable/i,
];

function getAllFiles(dirPath: string, arrayOfFiles: string[] = []): string[] {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== "node_modules" && file !== ".next" && file !== ".git") {
        getAllFiles(fullPath, arrayOfFiles);
      }
    } else if (/\.(tsx|ts|jsx|js|md)$/.test(file)) {
      arrayOfFiles.push(fullPath);
    }
  }

  return arrayOfFiles;
}

describe("Banned Marketing Phrases & False Claims Auditor", () => {
  it("ensures no banned phrases or unverifiable claims exist across app, components, and lib", () => {
    const rootDir = process.cwd();
    const directoriesToScan = ["app", "components", "lib"].map((dir) =>
      path.join(rootDir, dir)
    );

    const violations: { file: string; line: number; match: string }[] = [];

    for (const dir of directoriesToScan) {
      const files = getAllFiles(dir);

      for (const filePath of files) {
        const content = fs.readFileSync(filePath, "utf-8");
        const lines = content.split("\n");

        lines.forEach((line, idx) => {
          for (const pattern of BANNED_PATTERNS) {
            if (pattern.test(line)) {
              violations.push({
                file: path.relative(rootDir, filePath),
                line: idx + 1,
                match: line.trim(),
              });
            }
          }
        });
      }
    }

    if (violations.length > 0) {
      console.error("Found banned marketing phrases:", violations);
    }

    expect(violations).toEqual([]);
  });
});
