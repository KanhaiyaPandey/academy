import { Redis } from "@upstash/redis";

// Parse rediss://default:TOKEN@host:port → Upstash REST { url, token }
function createClient() {
  const raw = process.env.REDIS_URL;
  if (!raw) throw new Error("REDIS_URL is not defined");
  const parsed = new URL(raw);
  return new Redis({
    url: `https://${parsed.hostname}`,
    token: parsed.password,
  });
}

export const redis = createClient();
