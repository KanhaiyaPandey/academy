import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { leads } from "@pahal/db/schema";
import { eq } from "drizzle-orm";
import { successResponse, errorResponse } from "@pahal/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const [updated] = await db
      .update(leads)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(leads.id, Number(id)))
      .returning();
    return NextResponse.json(successResponse(updated, "Lead updated"));
  } catch {
    return NextResponse.json(errorResponse("Failed to update lead"), { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await db.delete(leads).where(eq(leads.id, Number(id)));
    return NextResponse.json(successResponse(null, "Lead deleted"));
  } catch {
    return NextResponse.json(errorResponse("Failed to delete lead"), { status: 500 });
  }
}
