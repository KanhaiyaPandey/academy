import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { students } from "@pahal/db/schema";
import { eq } from "drizzle-orm";
import { successResponse, errorResponse } from "@pahal/lib/utils";

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const student = await db.query.students.findFirst({
      where: eq(students.id, Number(id)),
      with: { enrollments: { with: { course: true } }, fees: true },
    });
    if (!student) return NextResponse.json(errorResponse("Student not found"), { status: 404 });
    return NextResponse.json(successResponse(student));
  } catch {
    return NextResponse.json(errorResponse("Failed to fetch"), { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const [updated] = await db
      .update(students)
      .set({ ...body, updatedAt: new Date() })
      .where(eq(students.id, Number(id)))
      .returning();
    return NextResponse.json(successResponse(updated, "Student updated"));
  } catch {
    return NextResponse.json(errorResponse("Failed to update"), { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await db.delete(students).where(eq(students.id, Number(id)));
    return NextResponse.json(successResponse(null, "Student deleted"));
  } catch {
    return NextResponse.json(errorResponse("Failed to delete"), { status: 500 });
  }
}
