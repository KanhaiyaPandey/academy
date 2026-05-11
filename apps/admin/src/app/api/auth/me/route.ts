import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { successResponse, errorResponse } from "@pahal/lib/utils";

export async function GET(req: NextRequest) {
  const session = getSession(req);
  if (!session) {
    return NextResponse.json(errorResponse("Unauthorized"), { status: 401 });
  }
  return NextResponse.json(
    successResponse({ role: session.role, empId: session.empId, name: session.name })
  );
}
