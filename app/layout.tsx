import type { Metadata } from "next";
import { Inter, Manrope, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/navigation/navbar";
import { Footer } from "@/components/navigation/footer";
import { AmbientSpotlight } from "@/components/landing/ambient-spotlight";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const brandFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-brand",
  weight: ["700", "800"],
  display: "swap",
});

import { SITE_URL, SITE_TITLE_DEFAULT, SITE_DESCRIPTION, SEO_KEYWORDS } from "@/lib/seo/config";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/favicon.ico",
  },
  title: {
    default: SITE_TITLE_DEFAULT,
    template: "%s | ResumeBMH",
  },
  description: SITE_DESCRIPTION,
  keywords: SEO_KEYWORDS,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: "ResumeBMH",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: `${SITE_URL}/opengraph-image`,
        width: 1200,
        height: 630,
        alt: "ResumeBMH AI Resume Builder and Career Platform",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_TITLE_DEFAULT,
    description: SITE_DESCRIPTION,
    images: [`${SITE_URL}/opengraph-image`],
  },
};

import { ClerkProvider } from "@clerk/nextjs";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider dynamic>
      <html lang="en" className={`${inter.variable} ${manrope.variable} ${brandFont.variable}`} suppressHydrationWarning>
        <body className="font-sans sky-cloud-canvas text-slate-800 flex flex-col min-h-screen selection:bg-blue-500/20 selection:text-blue-900 antialiased" suppressHydrationWarning>
          <AmbientSpotlight />
          <Navbar />
          <main className="flex-1 w-full relative z-10">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
