import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { leads } from "@pahal/db/schema";
import { desc } from "drizzle-orm";
import { successResponse, errorResponse } from "@pahal/lib/utils";
import { withCache, invalidate, KEYS, TTL } from "@/lib/cache";

export async function GET() {
  try {
    const data = await withCache(KEYS.leads, TTL.leads, () =>
      db.select().from(leads).orderBy(desc(leads.createdAt))
    );
    return NextResponse.json(successResponse(data));
  } catch {
    return NextResponse.json(errorResponse("Failed to fetch leads"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const [lead] = await db.insert(leads).values(body).returning();
    await invalidate(KEYS.leads, KEYS.stats);
    return NextResponse.json(successResponse(lead, "Lead created"), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to create lead"), { status: 500 });
  }
}
