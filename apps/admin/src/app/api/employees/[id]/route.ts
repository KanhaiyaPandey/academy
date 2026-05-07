import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { employees } from "@pahal/db/schema";
import { eq } from "drizzle-orm";
import { successResponse, errorResponse } from "@pahal/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const [updated] = await db
      .update(employees)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(employees.id, Number(id)))
      .returning();
    return NextResponse.json(successResponse(updated, "Employee updated"));
  } catch {
    return NextResponse.json(errorResponse("Failed to update"), { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await db.delete(employees).where(eq(employees.id, Number(id)));
    return NextResponse.json(successResponse(null, "Employee deleted"));
  } catch {
    return NextResponse.json(errorResponse("Failed to delete"), { status: 500 });
  }
}
