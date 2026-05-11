import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

const USERNAME = "admin";
const PASSWORD = "pahal@2025";
const SECRET = process.env.JWT_SECRET || "supersecretjwtkey_change_in_production";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (username !== USERNAME || password !== PASSWORD) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = createHmac("sha256", SECRET).update(`${username}:admin`).digest("hex");

  const res = NextResponse.json({ success: true });
  res.cookies.set("admin_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8, // 8 hours
    path: "/",
  });
  return res;
}
