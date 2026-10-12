import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "ResumeBMH AI Resume Builder & Career Suite",
    short_name: "ResumeBMH",
    description:
      "Build ATS-friendly resumes, optimize achievements with the XYZ formula, scan for parsing errors, and prepare for interviews.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#2563eb",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
