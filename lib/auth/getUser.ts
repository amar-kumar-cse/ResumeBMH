import { createClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DEMO_USER_ID, getSupabaseEnv, isDemoMode } from "@/lib/auth/config";

export interface AuthUser {
  userId: string;
  email?: string;
}

export class AuthError extends Error {
  constructor(message: string = "Authentication required") {
    super(message);
    this.name = "AuthError";
  }
}

/**
 * Authenticate the caller of an API route. FAILS CLOSED: if there is no valid,
 * server-verified user (Clerk or Supabase), an AuthError (HTTP 401) is thrown.
 */
export async function getUser(req: Request): Promise<AuthUser> {
  if (isDemoMode()) {
    return { userId: DEMO_USER_ID, email: "demo@karyvo.local" };
  }

  // 1. Clerk session check
  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
    try {
      const clerkAuth = await auth();
      if (clerkAuth?.userId) {
        const user = await currentUser().catch(() => null);
        const email = user?.emailAddresses?.[0]?.emailAddress;
        return { userId: clerkAuth.userId, email };
      }
    } catch {
      // Proceed to bearer/Supabase fallback
    }
  }

  const env = getSupabaseEnv();
  if (!env) {
    // Misconfiguration must never turn into "everyone is logged in".
    console.error("Auth is not configured: set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.");
    throw new AuthError("Authentication is not available");
  }

  // 2. Bearer token
  const authHeader = req.headers.get("authorization");
  if (authHeader?.toLowerCase().startsWith("bearer ")) {
    const token = authHeader.slice(7).trim();
    if (!token) throw new AuthError("Invalid or expired session");

    const supabase = createClient(env.url, env.anonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) throw new AuthError("Invalid or expired session");
    return { userId: data.user.id, email: data.user.email ?? undefined };
  }

  // 2. Session cookies
  const supabase = await createSupabaseServerClient();
  if (!supabase) throw new AuthError("Authentication is not available");

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) throw new AuthError();
  return { userId: data.user.id, email: data.user.email ?? undefined };
}

/**
 * Optional authentication: returns verified user if valid session exists,
 * or null for anonymous visitors (does NOT throw 401).
 */
export async function getUserOptional(req: Request): Promise<AuthUser | null> {
  try {
    return await getUser(req);
  } catch (err) {
    if (err instanceof AuthError) {
      return null;
    }
    return null;
  }
}

/**
 * For Server Components: the verified user, or null when signed out.
 * Never returns a value taken from an unverified cookie.
 */
export async function getServerUser(): Promise<AuthUser | null> {
  if (isDemoMode()) {
    return { userId: DEMO_USER_ID, email: "demo@karyvo.local" };
  }

  if (process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && process.env.CLERK_SECRET_KEY) {
    try {
      const clerkAuth = await auth();
      if (clerkAuth?.userId) {
        const user = await currentUser().catch(() => null);
        const email = user?.emailAddresses?.[0]?.emailAddress;
        return { userId: clerkAuth.userId, email };
      }
    } catch {
      // Proceed to Supabase check
    }
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) return null;

  const { data, error } = await supabase.auth.getUser();
  if (error || !data.user) return null;
  return { userId: data.user.id, email: data.user.email ?? undefined };
}

/** Back-compat helper: verified user id or null. */
export async function getServerUserId(): Promise<string | null> {
  const user = await getServerUser();
  return user?.userId ?? null;
}

/**
 * For protected pages: returns the verified user id or redirects to /login.
 * NOTE: redirect() works by throwing, so call this OUTSIDE any try/catch.
 */
export async function requireServerUserId(nextPath: string): Promise<string> {
  const userId = await getServerUserId();
  if (!userId) {
    redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  }
  return userId;
}
