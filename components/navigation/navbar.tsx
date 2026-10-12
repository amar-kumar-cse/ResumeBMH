"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  FileText,
  User,
  ShieldCheck,
  Send,
  Headphones,
  Crown,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
  LogOut,
  CreditCard,
} from "lucide-react";
import { useEffect, useState, useRef } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPro, setIsPro] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [authReady, setAuthReady] = useState(false);
  const accountRef = useRef<HTMLDivElement>(null);

  // Close account dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (accountRef.current && !accountRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Track signed-in user
  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    if (!supabase) {
      setAuthReady(true);
      return;
    }

    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUserEmail(data.user?.email ?? null);
      setAuthReady(true);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user?.email ?? null);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  // Subscription status verified from server
  useEffect(() => {
    if (!userEmail) {
      setIsPro(false);
      return;
    }
    fetch("/api/payments/subscription")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        setIsPro(Boolean(data?.data?.isPro));
      })
      .catch(() => {
        setIsPro(false);
      });
  }, [userEmail]);

  async function handleSignOut() {
    const supabase = createSupabaseBrowserClient();
    await supabase?.auth.signOut();
    setUserEmail(null);
    setMobileOpen(false);
    setAccountOpen(false);
    router.replace("/");
    router.refresh();
  }

  // Close menus on route change
  useEffect(() => {
    setMobileOpen(false);
    setAccountOpen(false);
  }, [pathname]);

  const appNavLinks = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/resume", label: "Resume", icon: FileText },
    { href: "/ats", label: "ATS Scanner", icon: ShieldCheck },
    { href: "/interview", label: "Interview", icon: Headphones },
  ];

  const landingNavLinks = [
    { href: "/#features", label: "Features" },
    { href: "/#how-it-works", label: "How it works" },
    { href: "/pricing", label: "Pricing" },
    { href: "/support", label: "Support" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full px-4 sm:px-6 lg:px-8 pt-3 pb-2">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 rounded-2xl border border-white/80 bg-white/85 backdrop-blur-xl shadow-[0_10px_30px_-5px_rgba(30,58,138,0.08),0_4px_12px_-2px_rgba(0,0,0,0.03)]">
        {/* Brand Logo: ResumeBMH with modern app icon */}
        <Link href="/" className="flex items-center gap-2.5 group select-none">
          <div className="relative h-9 w-9 rounded-xl overflow-hidden shadow-sm shadow-blue-500/20 group-hover:scale-105 transition-transform flex items-center justify-center bg-blue-600">
            <Image
              src="/favicon.ico"
              alt="ResumeBMH Logo"
              width={36}
              height={36}
              className="h-full w-full object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <span className="font-brand text-[21px] font-extrabold tracking-[-0.03em] text-slate-900 leading-none flex items-center">
              Resume<span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent font-black ml-0.5">BMH</span>
            </span>
            <span className="hidden sm:block text-[8px] font-bold text-slate-400 tracking-[0.22em] uppercase mt-1 leading-none">
              Build Your Better Resume
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-100/80 border border-slate-200/70 backdrop-blur-sm">
          {userEmail ? (
            appNavLinks.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-sm font-medium transition-all ${
                    isActive
                      ? "text-accent bg-white shadow-sm font-semibold"
                      : "text-ink-muted hover:text-ink hover:bg-white/60"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-accent" : "text-ink-subtle"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })
          ) : (
            landingNavLinks.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? "text-blue-600 bg-white shadow-sm font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })
          )}
        </nav>

        {/* Actions (Pro Status, Account Menu or Auth Buttons, Mobile Toggle) */}
        <div className="flex items-center gap-2.5">
          {/* Pro Status */}
          <Link
            href="/pricing"
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-semibold shadow-sm transition-all ${
              isPro
                ? "bg-amber-50 border-amber-200 text-amber-800"
                : "bg-white border-slate-200 text-ink-muted hover:text-ink hover:bg-slate-50"
            }`}
          >
            <Crown
              className={`w-3.5 h-3.5 ${
                isPro ? "text-amber-600 fill-amber-500/20" : "text-slate-400"
              }`}
              aria-hidden="true"
            />
            <span>{isPro ? "Pro Active" : "Pricing"}</span>
          </Link>

          {/* Account Menu (Desktop) */}
          {authReady && (
            <div className="hidden md:flex items-center">
              {userEmail ? (
                <div className="relative" ref={accountRef}>
                  <button
                    type="button"
                    onClick={() => setAccountOpen(!accountOpen)}
                    aria-expanded={accountOpen}
                    aria-haspopup="true"
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-ink text-sm font-semibold shadow-sm transition-all"
                  >
                    <User className="w-4 h-4 text-accent" />
                    <span className="max-w-[8rem] truncate font-medium text-xs">
                      {userEmail.split("@")[0]}
                    </span>
                    <ChevronDown
                      className={`w-3.5 h-3.5 text-ink-subtle transition-transform ${
                        accountOpen ? "rotate-180 text-accent" : ""
                      }`}
                    />
                  </button>

                  {accountOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-slate-200/90 p-1.5 shadow-elevated space-y-0.5 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                      <div className="px-3 py-2 border-b border-slate-100">
                        <span className="block text-xs text-ink-subtle">Signed in as</span>
                        <span className="block text-xs font-semibold text-ink truncate" title={userEmail}>
                          {userEmail}
                        </span>
                      </div>

                      <Link
                        href="/profile"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-muted hover:text-ink hover:bg-slate-50 font-medium transition-colors"
                      >
                        <User className="w-4 h-4 text-accent" />
                        <span>Master Profile</span>
                      </Link>

                      <Link
                        href="/cover-letter"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-muted hover:text-ink hover:bg-slate-50 font-medium transition-colors"
                      >
                        <Send className="w-4 h-4 text-accent" />
                        <span>Cover Letter</span>
                      </Link>

                      <Link
                        href="/pricing"
                        onClick={() => setAccountOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-ink-muted hover:text-ink hover:bg-slate-50 font-medium transition-colors"
                      >
                        <CreditCard className="w-4 h-4 text-accent" />
                        <span>Billing & Plan</span>
                      </Link>

                      <div className="pt-1 mt-1 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={handleSignOut}
                          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-600 hover:bg-rose-50 font-medium transition-colors"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Log out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="px-3.5 py-1.5 text-sm font-semibold text-slate-600 hover:text-blue-600 transition-colors"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 hover:from-blue-700 hover:to-indigo-700 px-4 py-1.5 text-sm font-semibold text-white shadow-sm shadow-blue-500/25 transition-[transform,box-shadow] duration-150 ease-out active:scale-[0.98] active:duration-75 touch-manipulation"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          )}

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg border border-slate-200 bg-white text-ink-muted hover:text-ink transition-colors shadow-sm"
          >
            {mobileOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Mobile Slide-down Menu */}
      {mobileOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl rounded-xl border border-slate-200 bg-white p-4 shadow-elevated space-y-3 animate-in fade-in slide-in-from-top-2 duration-150">
          {userEmail ? (
            <>
              <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
                {appNavLinks.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium transition-all ${
                        isActive
                          ? "text-accent bg-accent-light border border-accent-border/50 font-semibold"
                          : "text-ink-muted hover:bg-slate-50"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-accent" : "text-ink-subtle"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-2 rounded-lg text-sm text-ink-muted hover:bg-slate-50 font-medium"
                >
                  <User className="w-4 h-4 text-accent" />
                  <span>Master Profile</span>
                </Link>
                <Link
                  href="/cover-letter"
                  className="flex items-center gap-2 p-2 rounded-lg text-sm text-ink-muted hover:bg-slate-50 font-medium"
                >
                  <Send className="w-4 h-4 text-accent" />
                  <span>Cover Letter</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100">
              {landingNavLinks.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 p-2.5 rounded-lg text-sm font-medium transition-all ${
                      isActive
                        ? "text-blue-600 bg-blue-50 font-semibold"
                        : "text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          )}

          {authReady && (
            <div className="pt-1">
              {userEmail ? (
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-ink-subtle truncate max-w-[14rem]" title={userEmail}>
                    {userEmail}
                  </span>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-rose-600 shadow-sm"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log out</span>
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/login"
                    className="flex-1 py-2 text-center rounded-lg border border-slate-200 bg-white text-sm font-semibold text-ink shadow-sm"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/signup"
                    className="flex-1 py-2 text-center rounded-lg bg-accent text-sm font-semibold text-white shadow-sm"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </header>
  );
}
