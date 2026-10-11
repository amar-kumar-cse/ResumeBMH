/**
 * Simple in-memory sliding window rate limiter.
 * No npm package needed — just a Map + timestamps.
 */

interface RateLimitEntry {
  timestamps: number[];
}

const store = new Map<string, RateLimitEntry>();

// Clean up old entries every 5 minutes to prevent memory leaks
const CLEANUP_INTERVAL = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanup(windowMs: number) {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  const cutoff = now - windowMs;
  for (const [key, entry] of store.entries()) {
    entry.timestamps = entry.timestamps.filter((t) => t > cutoff);
    if (entry.timestamps.length === 0) {
      store.delete(key);
    }
  }
}

/**
 * Check if a request should be rate limited.
 * Synchronous in-memory sliding window rate limiter.
 *
 * @param key - Unique identifier (e.g., userId or IP + route)
 * @param maxRequests - Max requests allowed in the window
 * @param windowMs - Time window in milliseconds (default: 60s)
 * @returns { limited: boolean; remaining: number; retryAfterMs?: number }
 */
export function rateLimit(
  key: string,
  maxRequests: number,
  windowMs: number = 60_000
): { limited: boolean; remaining: number; retryAfterMs?: number } {
  cleanup(windowMs);

  const now = Date.now();
  const cutoff = now - windowMs;
  let entry = store.get(key);

  if (!entry) {
    entry = { timestamps: [] };
    store.set(key, entry);
  }

  // Remove timestamps outside the window
  entry.timestamps = entry.timestamps.filter((t) => t > cutoff);

  if (entry.timestamps.length >= maxRequests) {
    const oldestInWindow = entry.timestamps[0];
    const retryAfterMs = oldestInWindow + windowMs - now;
    return {
      limited: true,
      remaining: 0,
      retryAfterMs: Math.max(0, retryAfterMs),
    };
  }

  entry.timestamps.push(now);
  return {
    limited: false,
    remaining: maxRequests - entry.timestamps.length,
  };
}

/**
 * Distributed rate limiter with Upstash Redis REST support across serverless instances.
 * Automatically falls back to in-memory sliding window if Upstash credentials are not configured.
 */
export async function rateLimitDistributed(
  key: string,
  maxRequests: number,
  windowMs: number = 60_000
): Promise<{ limited: boolean; remaining: number; retryAfterMs?: number }> {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (url && token) {
    try {
      const windowSec = Math.max(1, Math.ceil(windowMs / 1000));
      // Atomic multi-command pipeline via Upstash REST: INCR + EXPIRE (NX) + TTL
      const res = await fetch(`${url}/pipeline`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify([
          ["INCR", `rl:${key}`],
          ["EXPIRE", `rl:${key}`, windowSec, "NX"],
          ["TTL", `rl:${key}`],
        ]),
        signal: AbortSignal.timeout(1500),
      });

      if (res.ok) {
        const results = await res.json();
        const count = typeof results[0]?.result === "number" ? results[0].result : 1;
        const ttlSec = typeof results[2]?.result === "number" && results[2].result > 0 ? results[2].result : windowSec;

        if (count > maxRequests) {
          return {
            limited: true,
            remaining: 0,
            retryAfterMs: ttlSec * 1000,
          };
        }

        return {
          limited: false,
          remaining: Math.max(0, maxRequests - count),
        };
      }
    } catch (err) {
      console.warn("[RateLimit] Upstash distributed check failed, falling back to in-memory:", err);
    }
  }

  // Graceful fallback to local sliding-window in-memory store
  return rateLimit(key, maxRequests, windowMs);
}

/** Pre-configured limiters for different route categories */
export const RATE_LIMITS = {
  /** AI-heavy routes: 10 requests per minute */
  ai: { maxRequests: 10, windowMs: 60_000 },
  /** Standard CRUD routes: 30 requests per minute */
  standard: { maxRequests: 30, windowMs: 60_000 },
  /** Payment routes: 5 requests per minute */
  payment: { maxRequests: 5, windowMs: 60_000 },
} as const;
