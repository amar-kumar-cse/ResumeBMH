import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Karyvo | AI Resume Builder, Free ATS Checker & Career Platform";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          backgroundColor: "#0b1329",
          padding: "60px 80px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "12px",
              backgroundColor: "#2563eb",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "24px",
              fontWeight: 800,
            }}
          >
            K
          </div>
          <span style={{ fontSize: "36px", fontWeight: 800, color: "#ffffff", letterSpacing: "-0.02em" }}>
            Resume<span style={{ color: "#38bdf8" }}>BMH</span>
          </span>
          <span style={{ fontSize: "16px", color: "#94a3b8", marginLeft: "12px", borderLeft: "2px solid #334155", paddingLeft: "16px" }}>
            by Karyvo
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px", maxWidth: "980px" }}>
          <div
            style={{
              display: "inline-flex",
              padding: "6px 16px",
              borderRadius: "9999px",
              backgroundColor: "rgba(56, 189, 248, 0.15)",
              color: "#38bdf8",
              fontSize: "18px",
              fontWeight: 600,
            }}
          >
            ATS-Optimized • Recruiter-Approved AI
          </div>
          <h1
            style={{
              fontSize: "54px",
              fontWeight: 900,
              color: "#ffffff",
              lineHeight: 1.15,
              margin: 0,
            }}
          >
            Write resumes hiring managers read. Grounded in your real experience.
          </h1>
          <p
            style={{
              fontSize: "22px",
              color: "#94a3b8",
              lineHeight: 1.4,
              margin: 0,
            }}
          >
            Single-Column ATS Builder • Standalone Health Scanner • XYZ Bullet Improver • Interview Prep
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", borderTop: "1px solid #1e293b", paddingTop: "24px" }}>
          <span style={{ color: "#64748b", fontSize: "18px", fontWeight: 500 }}>
            https://karyvo.com
          </span>
          <span style={{ color: "#10b981", fontSize: "18px", fontWeight: 600 }}>
            Factual Grounding • Single-Column Standard
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
