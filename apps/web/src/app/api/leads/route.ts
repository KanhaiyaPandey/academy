import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { leads } from "@pahal/db/schema";
import { successResponse, errorResponse } from "@pahal/lib/utils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, email, courseInterest, source, notes } = body;

    if (!name || !phone) {
      return NextResponse.json(errorResponse("Name and phone are required"), { status: 400 });
    }

    const [lead] = await db
      .insert(leads)
      .values({ name, phone, email, courseInterest, source: source || "website", notes, status: "new" })
      .returning();

    return NextResponse.json(successResponse(lead, "Lead captured successfully"), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to submit"), { status: 500 });
  }
}

export async function GET() {
  try {
    const allLeads = await db.query.leads.findMany({
      orderBy: (leads, { desc }) => [desc(leads.createdAt)],
    });
    return NextResponse.json(successResponse(allLeads));
  } catch {
    return NextResponse.json(errorResponse("Failed to fetch leads"), { status: 500 });
  }
}
