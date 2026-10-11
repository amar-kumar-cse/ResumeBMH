"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Mail, Lock, AlertCircle, CheckCircle2 } from "lucide-react";
import { Card, Button, Input } from "@/components/ui/primitives";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";
import { safeNextPath } from "@/lib/auth/config";

export type AuthMode = "login" | "signup" | "forgot" | "reset";

const COPY: Record<AuthMode, { title: string; subtitle: string; cta: string }> = {
  login: {
    title: "Welcome back",
    subtitle: "Log in to access your resumes, master profile, and interview practice.",
    cta: "Log in",
  },
  signup: {
    title: "Create your account",
    subtitle: "Start building ATS-ready resumes backed by the XYZ method.",
    cta: "Create account",
  },
  forgot: {
    title: "Reset your password",
    subtitle: "Enter your email address and we will send you a password reset link.",
    cta: "Send reset link",
  },
  reset: {
    title: "Choose a new password",
    subtitle: "Enter a strong password of at least 8 characters.",
    cta: "Update password",
  },
};

const MIN_PASSWORD = 8;

function friendlyError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "Incorrect email or password.";
  if (m.includes("email not confirmed"))
    return "Please verify your email first. Check your inbox for the confirmation link.";
  if (m.includes("already registered") || m.includes("already been registered"))
    return "An account with this email already exists. Try logging in.";
  if (m.includes("rate limit") || m.includes("too many"))
    return "Too many attempts. Please wait a minute and try again.";
  if (m.includes("password should be"))
    return `Password must be at least ${MIN_PASSWORD} characters.`;
  if (m.includes("unsupported provider") || m.includes("provider is not enabled")) {
    return "Google Sign-In is not enabled in your Supabase project yet. Please enable Google in Supabase Dashboard > Authentication > Providers, or sign in below with email and password.";
  }
  return message || "Something went wrong. Please try again.";
}

export function AuthForm({
  mode,
  next: nextProp,
  callbackError,
}: {
  mode: AuthMode;
  next?: string;
  callbackError?: string | boolean;
}) {
  const router = useRouter();
  const next = safeNextPath(nextProp);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    typeof callbackError === "string"
      ? callbackError === "callback"
        ? "Sign-in link is invalid or has expired. Please try again."
        : friendlyError(callbackError)
      : callbackError
      ? "Sign-in link is invalid or has expired. Please try again."
      : null
  );
  const [info, setInfo] = useState<string | null>(null);

  const copy = COPY[mode];
  const showEmail = mode !== "reset";
  const showPassword = mode !== "forgot";
  const showConfirm = mode === "signup" || mode === "reset";

  const callbackUrl = (target: string) =>
    `${window.location.origin}/auth/callback?next=${encodeURIComponent(target)}`;

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);

    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication is not configured yet. Add your Supabase keys to .env.local.");
      return;
    }

    if (showEmail && !/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    if (showPassword && mode !== "login" && password.length < MIN_PASSWORD) {
      setError(`Password must be at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (showConfirm && password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "login") {
        const { error: err } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (err) throw err;
        router.replace(next);
        router.refresh();
      } else if (mode === "signup") {
        const { data, error: err } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { emailRedirectTo: callbackUrl(next) },
        });
        if (err) throw err;
        if (data.session) {
          router.replace(next);
          router.refresh();
        } else {
          setInfo(
            "Account created! Please check your email inbox to confirm your address, then log in."
          );
        }
      } else if (mode === "forgot") {
        const { error: err } = await supabase.auth.resetPasswordForEmail(email.trim(), {
          redirectTo: callbackUrl("/reset-password"),
        });
        if (err) throw err;
        setInfo(
          "If an account exists for that email, we have sent password reset instructions. Please check your inbox."
        );
      } else if (mode === "reset") {
        const { error: err } = await supabase.auth.updateUser({ password });
        if (err) throw err;
        setInfo("Password updated successfully! Redirecting you to log in...");
        setTimeout(() => {
          router.replace("/login");
        }, 1500);
      }
    } catch (err: any) {
      setError(friendlyError(err?.message || "An unexpected error occurred."));
    } finally {
      setLoading(false);
    }
  }

  async function onGoogle() {
    setError(null);
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setError("Authentication is not configured yet. Add your Supabase keys to .env.local.");
      return;
    }
    setGoogleLoading(true);
    try {
      const { data, error: err } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl(next),
          skipBrowserRedirect: true,
        },
      });

      if (err) {
        setError(friendlyError(err.message));
        setGoogleLoading(false);
        return;
      }

      if (data?.url) {
        const res = await fetch(data.url, { method: "GET" }).catch(() => null);
        if (res && !res.ok) {
          const body = await res.json().catch(() => null);
          const rawMsg =
            body?.msg ||
            body?.error_description ||
            body?.message ||
            "Unsupported provider: provider is not enabled";
          setError(friendlyError(rawMsg));
          setGoogleLoading(false);
          return;
        }
        window.location.href = data.url;
      } else {
        setError("Could not generate Google authorization link.");
        setGoogleLoading(false);
      }
    } catch (e: any) {
      setError(friendlyError(e?.message || "Could not connect to Google sign-in."));
      setGoogleLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-4 py-12">
      <Card className="w-full space-y-6 p-7 sm:p-9 bg-white border-slate-200 shadow-elevated">
        <div className="space-y-2 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-2 group">
            <div className="relative h-8 w-8 rounded-lg overflow-hidden shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform bg-blue-600 flex items-center justify-center">
              <Image
                src="/favicon.ico"
                alt="Karyvo Logo"
                width={32}
                height={32}
                className="h-full w-full object-cover"
              />
            </div>
            <span className="font-brand text-2xl font-extrabold tracking-[-0.03em] text-slate-900 group-hover:text-blue-600 transition-colors">
              Resume<span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent font-black ml-0.5">BMH</span>
            </span>
          </Link>
          <h1 className="font-heading text-2xl font-bold tracking-tight text-ink">
            {copy.title}
          </h1>
          <p className="text-sm text-ink-muted leading-relaxed">
            {copy.subtitle}
          </p>
        </div>

        {(mode === "login" || mode === "signup") && (
          <>
            <Button
              type="button"
              variant="outline"
              size="md"
              className="w-full gap-2.5"
              onClick={onGoogle}
              isLoading={googleLoading}
            >
              <svg aria-hidden="true" viewBox="0 0 24 24" className="w-4 h-4 shrink-0">
                <path
                  fill="#4285F4"
                  d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5a5.6 5.6 0 0 1-2.4 3.7v3h3.9c2.3-2.1 3.5-5.2 3.5-8.9z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.2 0 6-1.1 7.9-2.9l-3.9-3c-1.1.7-2.5 1.2-4 1.2-3.1 0-5.7-2.1-6.6-4.9H1.4v3.1A12 12 0 0 0 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.4 14.4a7.2 7.2 0 0 1 0-4.8V6.5H1.4a12 12 0 0 0 0 11l4-3.1z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.8c1.8 0 3.3.6 4.6 1.8l3.4-3.4A12 12 0 0 0 1.4 6.5l4 3.1C6.3 6.9 8.9 4.8 12 4.8z"
                />
              </svg>
              <span>Continue with Google</span>
            </Button>

            <div className="flex items-center gap-3 text-xs text-ink-subtle">
              <span className="h-px flex-1 bg-slate-200" />
              <span>or with email</span>
              <span className="h-px flex-1 bg-slate-200" />
            </div>
          </>
        )}

        <form onSubmit={onSubmit} className="space-y-4" noValidate>
          {showEmail && (
            <div className="space-y-1.5">
              <label htmlFor="auth-email" className="block text-sm font-semibold text-ink">
                Email address
              </label>
              <div className="relative">
                <Mail
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="auth-email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="name@company.com"
                  className="w-full h-11 pl-10 pr-3.5 rounded-lg border border-slate-200 hover:border-slate-300 focus:border-accent focus:ring-2 focus:ring-accent bg-white text-ink text-sm transition-all placeholder:text-slate-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
          )}

          {showPassword && (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="auth-password" className="block text-sm font-semibold text-ink">
                  {mode === "reset" ? "New password" : "Password"}
                </label>
                {mode === "login" && (
                  <Link
                    href="/forgot-password"
                    className="text-xs font-semibold text-accent hover:text-accent-hover transition-colors"
                  >
                    Forgot password?
                  </Link>
                )}
              </div>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="auth-password"
                  type="password"
                  autoComplete={mode === "login" ? "current-password" : "new-password"}
                  required
                  minLength={mode === "login" ? undefined : MIN_PASSWORD}
                  placeholder={mode === "login" ? "Enter your password" : `At least ${MIN_PASSWORD} characters`}
                  className="w-full h-11 pl-10 pr-3.5 rounded-lg border border-slate-200 hover:border-slate-300 focus:border-accent focus:ring-2 focus:ring-accent bg-white text-ink text-sm transition-all placeholder:text-slate-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          {showConfirm && (
            <div className="space-y-1.5">
              <label htmlFor="auth-confirm" className="block text-sm font-semibold text-ink">
                Confirm password
              </label>
              <div className="relative">
                <Lock
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  aria-hidden="true"
                />
                <input
                  id="auth-confirm"
                  type="password"
                  autoComplete="new-password"
                  required
                  placeholder="Repeat your password"
                  className="w-full h-11 pl-10 pr-3.5 rounded-lg border border-slate-200 hover:border-slate-300 focus:border-accent focus:ring-2 focus:ring-accent bg-white text-ink text-sm transition-all placeholder:text-slate-400"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
            </div>
          )}

          <div aria-live="polite" className="space-y-2">
            {error && (
              <p
                role="alert"
                className="flex items-start gap-2.5 rounded-lg border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-xs text-rose-700 font-medium"
              >
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" aria-hidden="true" />
                <span>{error}</span>
              </p>
            )}
            {info && (
              <p
                role="status"
                className="flex items-start gap-2.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3.5 py-2.5 text-xs text-emerald-800 font-medium"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" aria-hidden="true" />
                <span>{info}</span>
              </p>
            )}
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full justify-center"
            isLoading={loading}
          >
            {copy.cta}
          </Button>
        </form>

        <p className="text-center text-sm text-ink-muted">
          {mode === "login" && (
            <>
              New to Karyvo?{" "}
              <Link
                href={`/signup?next=${encodeURIComponent(next)}`}
                className="font-semibold text-accent hover:text-accent-hover transition-colors underline"
              >
                Create an account
              </Link>
            </>
          )}
          {mode === "signup" && (
            <>
              Already have an account?{" "}
              <Link
                href={`/login?next=${encodeURIComponent(next)}`}
                className="font-semibold text-accent hover:text-accent-hover transition-colors underline"
              >
                Log in
              </Link>
            </>
          )}
          {(mode === "forgot" || mode === "reset") && (
            <Link
              href="/login"
              className="font-semibold text-accent hover:text-accent-hover transition-colors underline"
            >
              Back to log in
            </Link>
          )}
        </p>
      </Card>
    </div>
  );
}
