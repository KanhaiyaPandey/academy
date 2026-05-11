import { getRedis } from "./redis";

/**
 * Try to return data from Redis. On miss, call `fetcher`, store the result,
 * and return it. On any Redis error the fetcher result is returned directly
 * so a cache outage never breaks the API.
 */
export async function withCache<T>(
  key: string,
  ttlSeconds: number,
  fetcher: () => Promise<T>,
): Promise<T> {
  const redis = getRedis();
  if (!redis) return fetcher();
  try {
    const cached = await redis.get<T>(key);
    if (cached !== null && cached !== undefined) return cached;
    const data = await fetcher();
    await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
    return data;
  } catch {
    return fetcher();
  }
}

/** Delete one or more cache keys. Silently ignores Redis errors. */
export async function invalidate(...keys: string[]) {
  if (!keys.length) return;
  const redis = getRedis();
  if (!redis) return;
  try {
    await redis.del(...keys);
  } catch {
    // cache invalidation failure is non-fatal
  }
}

// ── Canonical cache keys ──────────────────────────────────────────────────────
export const KEYS = {
  stats:              "admin:stats",
  students:           "admin:students",
  courses:            "admin:courses",
  fees:               "admin:fees",
  employees:          "admin:employees",
  leads:              "admin:leads",
  attendance: (courseId: number | string) => `admin:attendance:${courseId}`,
} as const;

// ── TTLs (seconds) ────────────────────────────────────────────────────────────
export const TTL = {
  stats:      300,   // 5 min  — refreshes after any write to students/fees/leads
  students:   120,   // 2 min
  courses:    600,   // 10 min — courses change infrequently
  fees:       120,   // 2 min
  employees:  300,   // 5 min
  leads:       60,   // 1 min  — leads flow is fast-moving
  attendance: 300,   // 5 min  — per course
} as const;
