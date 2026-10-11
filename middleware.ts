import { NextResponse, type NextRequest } from "next/server";
import { clerkMiddleware } from "@clerk/nextjs/server";
import { updateSession, withSessionCookies } from "@/lib/supabase/middleware";
import { isAuthPage, isDemoMode, isProtectedPath, safeNextPath } from "@/lib/auth/config";

function applySecurityHeaders(res: NextResponse, allowedOrigin?: string): void {
  if (allowedOrigin) {
    res.headers.set("Access-Control-Allow-Origin", allowedOrigin);
  }
  res.headers.set("X-Content-Type-Options", "nosniff");
  res.headers.set("X-Frame-Options", "DENY");
  res.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  const isDev = process.env.NODE_ENV !== "production";
  const scriptSrc = isDev
    ? "'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://*.clerk.accounts.dev https://*.clerk.com"
    : "'self' 'unsafe-inline' https://checkout.razorpay.com https://*.clerk.accounts.dev https://*.clerk.com";

  // Hardened CSP: allow Razorpay, Supabase, Google Fonts, Gemini AI, and Clerk Auth
  res.headers.set(
    "Content-Security-Policy",
    `default-src 'self'; script-src ${scriptSrc}; worker-src 'self' blob:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: blob: https: https://img.clerk.com; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com https://*.clerk.accounts.dev https://*.clerk.com; connect-src 'self' https://*.supabase.co https://api.razorpay.com https://generativelanguage.googleapis.com https://*.clerk.accounts.dev https://*.clerk.com;`
  );
  if (process.env.NODE_ENV === "production") {
    res.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
}

export default clerkMiddleware(async (auth, request) => {
  const { pathname } = request.nextUrl;
  const isProduction = process.env.NODE_ENV === "production";

  // ---------------------------------------------------------------------------
  // API routes: CORS + content-type checks + security headers.
  // ---------------------------------------------------------------------------
  if (pathname.startsWith("/api")) {
    const origin = request.headers.get("origin");
    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    // Strict CORS origin calculation: Never fallback to '*' in production
    let allowedOrigin = isProduction ? (appUrl || "") : "*";
    if (appUrl) {
      try {
        const parsedApp = new URL(appUrl);
        if (origin) {
          const parsedOrigin = new URL(origin);
          const isLocalhost =
            parsedOrigin.hostname === "localhost" || parsedOrigin.hostname === "127.0.0.1";

          if (parsedOrigin.origin === parsedApp.origin) {
            allowedOrigin = origin;
          } else if (!isProduction && isLocalhost) {
            // Localhost allowed ONLY in development
            allowedOrigin = origin;
          } else {
            allowedOrigin = parsedApp.origin;
          }
        } else {
          allowedOrigin = parsedApp.origin;
        }
      } catch {
        allowedOrigin = appUrl;
      }
    } else if (origin && !isProduction) {
      try {
        const parsedOrigin = new URL(origin);
        if (parsedOrigin.hostname === "localhost" || parsedOrigin.hostname === "127.0.0.1") {
          allowedOrigin = origin;
        }
      } catch {
        allowedOrigin = "http://localhost:3000";
      }
    }

    // 1. Handle CORS Preflight OPTIONS requests
    if (request.method === "OPTIONS") {
      const response = new NextResponse(null, { status: 204 });
      response.headers.set("Access-Control-Allow-Origin", allowedOrigin);
      response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
      response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
      response.headers.set("Access-Control-Max-Age", "86400");
      applySecurityHeaders(response);
      return response;
    }

    // 2. Validate Content-Type for state-modifying requests with a payload
    if (["POST", "PUT", "PATCH"].includes(request.method)) {
      const contentType = request.headers.get("content-type");
      const contentLength = request.headers.get("content-length");
      const hasBody = contentLength ? parseInt(contentLength, 10) > 0 : true;

      const isJson = contentType?.includes("application/json");
      const isMultipart = contentType?.includes("multipart/form-data");

      if (hasBody && (!contentType || (!isJson && !isMultipart))) {
        const errResponse = NextResponse.json(
          { success: false, error: "Unsupported Media Type. Content-Type must be application/json or multipart/form-data." },
          { status: 415 }
        );
        applySecurityHeaders(errResponse, allowedOrigin);
        return errResponse;
      }
    }

    // 3. Continue request and append standard Security Headers
    const response = NextResponse.next();
    applySecurityHeaders(response, allowedOrigin);
    return response;
  }

  // ---------------------------------------------------------------------------
  // Pages: refresh the Supabase session, guard private routes & apply security headers
  // ---------------------------------------------------------------------------
  if (isDemoMode()) {
    const response = NextResponse.next();
    applySecurityHeaders(response);
    return response;
  }

  const clerkAuth = await auth();
  const { response, user: supabaseUser } = await updateSession(request);
  applySecurityHeaders(response);

  const isAuthenticated = Boolean(clerkAuth?.userId || supabaseUser);

  // Signed-out users cannot open private pages.
  if (!isAuthenticated && isProtectedPath(pathname)) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.search = "";
    loginUrl.searchParams.set("next", safeNextPath(`${pathname}${request.nextUrl.search}`));
    const redirectRes = withSessionCookies(response, NextResponse.redirect(loginUrl));
    applySecurityHeaders(redirectRes);
    return redirectRes;
  }

  // Signed-in users do not need the login / signup screens.
  if (isAuthenticated && isAuthPage(pathname)) {
    const target = new URL(safeNextPath(request.nextUrl.searchParams.get("next")), request.url);
    const redirectRes = withSessionCookies(response, NextResponse.redirect(target));
    applySecurityHeaders(redirectRes);
    return redirectRes;
  }

  return response;
});

export const config = {
  // Run on pages and API routes, skip Next.js internals and static assets.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)"],
};
