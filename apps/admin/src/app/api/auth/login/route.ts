import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { employees } from "@pahal/db/schema";
import { eq } from "drizzle-orm";
import { signSession, SESSION_COOKIE, type SessionPayload } from "@/lib/session";

const ADMIN_USERNAME = "admin";
const ADMIN_PASSWORD = "pahal@2025";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  let payload: SessionPayload;

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    payload = {
      role: "admin",
      name: "Admin",
      exp: Date.now() + 8 * 60 * 60 * 1000,
    };
  } else {
    // Employee login: username = employeeId (e.g. EMP001), password = phone number
    const emp = await db.query.employees.findFirst({
      where: eq(employees.employeeId, username),
    });

    if (!emp || emp.phone !== password || !emp.isActive) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    payload = {
      role: "employee",
      empId: emp.id,
      name: `${emp.firstName} ${emp.lastName}`,
      exp: Date.now() + 8 * 60 * 60 * 1000,
    };
  }

  const res = NextResponse.json({
    success: true,
    role: payload.role,
    name: payload.name,
  });

  res.cookies.set(SESSION_COOKIE, signSession(payload), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 8,
    path: "/",
  });

  return res;
}
