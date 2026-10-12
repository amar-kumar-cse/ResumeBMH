import type { Metadata } from "next";
import { SignIn } from "@clerk/nextjs";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Log in",
  description: "Log in to your ResumeBMH account.",
  alternates: {
    canonical: "/login",
  },
  robots: { index: false, follow: false },
};

type SearchParams = Promise<{ next?: string; error?: string }>;

export default async function Page({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const hasClerk = Boolean(process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY);

  if (hasClerk) {
    return (
      <div className="mx-auto flex min-h-[75vh] w-full max-w-md items-center justify-center px-4 py-12">
        <SignIn
          routing="hash"
          signUpUrl="/signup"
          forceRedirectUrl={params.next || "/dashboard"}
          fallbackRedirectUrl="/dashboard"
          appearance={{
            elements: {
              rootBox: "w-full",
              card: "w-full bg-white border border-slate-200 shadow-elevated rounded-2xl p-6 sm:p-8",
              headerTitle: "font-heading text-2xl font-bold text-ink",
              headerSubtitle: "text-sm text-ink-muted",
              socialButtonsBlockButton: "border border-slate-200 hover:bg-slate-50 transition-colors py-2.5",
              socialButtonsBlockButtonText: "font-semibold text-slate-700",
              formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 shadow-sm transition-all",
              footerActionLink: "text-blue-600 hover:text-blue-700 font-semibold",
            },
          }}
        />
      </div>
    );
  }

  return <AuthForm mode="login" next={params.next} callbackError={params.error} />;
}
