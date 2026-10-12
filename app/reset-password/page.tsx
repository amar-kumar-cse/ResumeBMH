import type { Metadata } from "next";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Reset password",
  description: "Choose a new ResumeBMH password.",
  alternates: {
    canonical: "/reset-password",
  },
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ next?: string; error?: string }>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  return <AuthForm mode="reset" next={params.next} callbackError={Boolean(params.error)} />;
}
