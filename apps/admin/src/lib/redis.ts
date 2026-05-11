import { Redis } from "@upstash/redis";

let cachedClient: Redis | null | undefined;

function fromRedisUrl(raw: string) {
  // Parse rediss://default:TOKEN@host:port → Upstash REST { url, token }
  const parsed = new URL(raw);
  return new Redis({
    url: `https://${parsed.hostname}`,
    token: parsed.password,
  });
}

function createClient(): Redis | null {
  // Prefer Upstash's standard env vars (common on Vercel integrations).
  const restUrl = process.env.UPSTASH_REDIS_REST_URL;
  const restToken = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (restUrl && restToken) return new Redis({ url: restUrl, token: restToken });

  const raw = process.env.REDIS_URL;
  if (raw) return fromRedisUrl(raw);

  // Cache is optional; missing env should not fail builds.
  return null;
}

export function getRedis(): Redis | null {
  if (cachedClient !== undefined) return cachedClient;
  cachedClient = createClient();
  return cachedClient;
}
