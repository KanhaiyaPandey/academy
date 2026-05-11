import { createHmac } from "crypto";
import type { NextRequest } from "next/server";

const SECRET = process.env.JWT_SECRET || "supersecretjwtkey_change_in_production";
export const SESSION_COOKIE = "admin_session";

export type SessionPayload = {
  role: "admin" | "employee";
  empId?: number;
  name: string;
  exp: number;
};

export function signSession(payload: SessionPayload): string {
  const b64 = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = createHmac("sha256", SECRET).update(b64).digest("hex");
  return `${b64}.${sig}`;
}

export function verifySession(token: string): SessionPayload | null {
  const dot = token.lastIndexOf(".");
  if (dot === -1) return null;
  const b64 = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const expected = createHmac("sha256", SECRET).update(b64).digest("hex");
  if (sig !== expected) return null;
  try {
    const payload: SessionPayload = JSON.parse(
      Buffer.from(b64, "base64url").toString()
    );
    if (payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function getSession(req: NextRequest): SessionPayload | null {
  const cookie = req.cookies.get(SESSION_COOKIE);
  if (!cookie?.value) return null;
  return verifySession(cookie.value);
}
